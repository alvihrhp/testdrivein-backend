import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UserRole = 'CLIENT' | 'SALES';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

// Define a custom type for the search query
interface SearchQuery {
  OR?: Array<{
    name?: { contains: string; mode?: 'insensitive' | 'default' | 'sensitive' };
    description?: { contains: string; mode?: 'insensitive' | 'default' | 'sensitive' };
    showroom?: { contains: string; mode?: 'insensitive' | 'default' | 'sensitive' };
  }>;
}

// Type for Mobil update data
interface MobilUpdateData {
  name?: string;
  image?: string;
  description?: string;
  price?: number;
  showroom?: string;
  slug?: string;
}

// Type for Mobil with sales info and images
interface MobilWithSales {
  id: string;
  name: string;
  slug: string;
  image: string;
  images?: string[]; // Array of image URLs
  description: string;
  price: number;
  showroom: string;
  salesId: string;
  createdAt: Date;
  sales: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const getAllMobil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;
    
    const where: any = {};
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { showroom: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    
    // First, get the mobil list with sales info
    const mobilList = await prisma.mobil.findMany({
      where,
      include: {
        sales: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get the first image for each mobil
    const mobilListWithImages = await Promise.all(
      mobilList.map(async (mobil) => {
        // Get the first image URL for this mobil
        const images = await prisma.$queryRaw<Array<{ url: string }>>`
          SELECT "url" FROM "MobilImage" 
          WHERE "mobilId" = ${mobil.id}
          ORDER BY "type" ASC, "createdAt" ASC
          LIMIT 1
        `;
        
        const firstImageUrl = images[0]?.url || 'https://s1.bwallpapers.com/wallpapers/2014/07/27/mercedes-benz-cls63_113335529.jpg';
        
        return {
          ...mobil,
          image: firstImageUrl,
          sales: mobil.sales as any
        };
      })
    );
    
    res.json(mobilListWithImages);
  } catch (error) {
    console.error('Error fetching mobil list:', error);
    next(error);
  }
};

export const getMobilBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    // First get the mobil with sales info
    const mobil = await prisma.mobil.findUnique({
      where: { slug },
      include: {
        sales: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }) as unknown as MobilWithSales | null;

    if (!mobil) {
      res.status(404).json({ error: 'Mobil not found' });
      return;
    }
    
    // Then get all images for this mobil
    const images = await prisma.$queryRaw<Array<{ url: string }>>`
      SELECT "url" FROM "MobilImage" 
      WHERE "mobilId" = ${mobil.id}
      ORDER BY "type" ASC, "createdAt" ASC
    `;
    
    // Add images to the mobil object
    const mobilWithImages = {
      ...mobil,
      images: images.length > 0 ? images.map(img => img.url) : [mobil.image],
      image: images[0]?.url || mobil.image // Keep backward compatibility with the main image
    };

    res.json(mobilWithImages);
  } catch (error) {
    console.error('Error fetching mobil by slug:', error);
    next(error);
  }
};

export const createMobil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { name, image, description, price, showroom } = req.body;
    const salesId = req.user.id;

    // Validate required fields
    if (!name || !image || !description || !price || !showroom) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Generate base slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create mobil first to get the ID
    const mobil = await prisma.mobil.create({
      data: {
        name,
        slug: baseSlug, // Temporary slug without ID
        image,
        description,
        price: Number(price),
        showroom,
        sales: {
          connect: { id: salesId },
        },
      },
    });

    // Update the mobil with the new slug that includes the ID
    const updatedMobil = await prisma.mobil.update({
      where: { id: mobil.id },
      data: {
        slug: `${baseSlug}-${mobil.id}`,
      },
      include: {
        sales: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }) as unknown as MobilWithSales;

    res.status(201).json(updatedMobil);
    return;
  } catch (error) {
    console.error('Error creating mobil:', error);
    next(error);
    return;
  }
};

export const updateMobil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { name, image, description, price, showroom } = req.body;

    // Check if mobil exists and belongs to the user
    const existingMobil = await prisma.mobil.findUnique({
      where: { id },
    });

    if (!existingMobil) {
      res.status(404).json({ error: 'Mobil not found' });
      return;
    }

    // Only the owner can update
    if (existingMobil.salesId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to update this mobil' });
      return;
    }

    // Prepare update data
    const updateData: MobilUpdateData = {};
    if (name) {
      updateData.name = name;
      // If name changes, update the slug with the new name and existing ID
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Update mobil
    const updatedMobil = await prisma.mobil.update({
      where: { id },
      data: updateData,
      include: {
        sales: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }) as unknown as MobilWithSales;

    res.json(updatedMobil);
    return;
  } catch (error) {
    console.error('Error updating mobil:', error);
    next(error);
    return;
  }
};

export const deleteMobil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    // Check if mobil exists and belongs to the current user
    const existingMobil = await prisma.mobil.findUnique({
      where: { id },
      select: {
        id: true,
        salesId: true,
      },
    });

    if (!existingMobil) {
      res.status(404).json({ error: 'Mobil not found' });
      return;
    }

    if (existingMobil.salesId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to delete this mobil' });
      return;
    }

    // Delete mobil
    await prisma.mobil.delete({
      where: { id }
    });

    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting mobil:', error);
    next(error);
    return;
  }
};
