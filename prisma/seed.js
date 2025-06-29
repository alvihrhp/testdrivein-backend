"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Generate random phone number starting with 08
const generatePhoneNumber = () => {
    return '08' + Math.floor(100000000 + Math.random() * 900000000).toString();
};
// Generate random date within the next 30 days
const randomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    return date;
};
// Generate random time between 9 AM and 5 PM
const randomTime = () => {
    const hours = 9 + Math.floor(Math.random() * 8);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
// Generate image URLs for a car
const generateCarImages = (mobilId) => {
    const imageTypes = ['main', 'exterior', 'interior', 'dashboard', 'engine', 'rear', 'side', 'wheel', 'trunk', 'other'];
    return imageTypes.map((type) => ({
        url: 'https://s1.bwallpapers.com/wallpapers/2014/07/27/mercedes-benz-cls63_113335529.jpg',
        type,
        mobilId,
    }));
};
async function main() {
    console.log('🚀 Starting database seeding...');
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.booking.deleteMany({});
    await prisma.mobilImage.deleteMany({});
    await prisma.mobil.deleteMany({});
    await prisma.user.deleteMany({});
    // Create sales users
    console.log('👨\u200d💼 Creating sales users...');
    const salesPassword = await bcrypt.hash('Password123!', 10);
    const salesUsers = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Dimas',
                email: 'dimas@mail.com',
                password: salesPassword,
                phone: '6281334444359',
                role: client_1.Role.SALES,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Rafael',
                email: 'rafael@mail.com',
                password: salesPassword,
                phone: '62888887740',
                role: client_1.Role.SALES,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Rafyi',
                email: 'rafyi@mail.com',
                password: salesPassword,
                phone: '628119951699',
                role: client_1.Role.SALES,
            },
        })
    ]);
    // Create client users
    console.log('👥 Creating client users...');
    const clientPassword = await bcrypt.hash('Client123!', 10);
    const clientUsers = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Client One',
                email: 'client1@example.com',
                password: clientPassword,
                phone: '6281234567890',
                role: client_1.Role.CLIENT,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Client Two',
                email: 'client2@example.com',
                password: clientPassword,
                phone: '6281234567891',
                role: client_1.Role.CLIENT,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Client Three',
                email: 'client3@example.com',
                password: clientPassword,
                phone: '6281234567892',
                role: client_1.Role.CLIENT,
            },
        })
    ]);
    console.log('🚗 Creating cars with images...');
    // Car data - 9 MPV cars (3 per sales user) with hybrid and EV engine types
    const cars = [
        // Cars for Sales 1 (Dimas)
        {
            name: 'BYD Seal Premium',
            slug: 'byd-seal-premium',
            description: 'Luxury electric MPV with premium features and long range',
            price: 850000000,
            showroom: 'Central Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Electric,
            year: 2024,
            engine_capacity: 0,
            brand: 'BYD',
            capacity: 7,
            salesId: salesUsers[0].id,
        },
        {
            name: 'Toyota Alphard Hybrid',
            slug: 'toyota-alphard-hybrid',
            description: 'Premium hybrid MPV with luxurious interior and advanced features',
            price: 1500000000,
            showroom: 'South Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 2500,
            brand: 'Toyota',
            capacity: 7,
            salesId: salesUsers[0].id,
        },
        {
            name: 'Honda Odyssey Hybrid',
            slug: 'honda-odyssey-hybrid',
            description: 'Spacious hybrid MPV with modern design and fuel efficiency',
            price: 1200000000,
            showroom: 'West Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 2000,
            brand: 'Honda',
            capacity: 8,
            salesId: salesUsers[0].id,
        },
        // Cars for Sales 2 (Rafael)
        {
            name: 'BYD Seal Performance',
            slug: 'byd-seal-performance',
            description: 'High-performance electric MPV with sporty handling',
            price: 950000000,
            showroom: 'North Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Electric,
            year: 2024,
            engine_capacity: 0,
            brand: 'BYD',
            capacity: 7,
            salesId: salesUsers[1].id,
        },
        {
            name: 'Lexus LM 350h',
            slug: 'lexus-lm-350h',
            description: 'Ultra-luxurious hybrid MPV with VIP rear seating',
            price: 2000000000,
            showroom: 'East Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 2500,
            brand: 'Lexus',
            capacity: 6,
            salesId: salesUsers[1].id,
        },
        {
            name: 'Toyota Vellfire Hybrid',
            slug: 'toyota-vellfire-hybrid',
            description: 'Stylish hybrid MPV with premium comfort and technology',
            price: 1450000000,
            showroom: 'South Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 2500,
            brand: 'Toyota',
            capacity: 7,
            salesId: salesUsers[1].id,
        },
        // Cars for Sales 3 (Rafyi)
        {
            name: 'BYD Seal Standard',
            slug: 'byd-seal-standard',
            description: 'Affordable electric MPV with great range and features',
            price: 750000000,
            showroom: 'Central Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Electric,
            year: 2024,
            engine_capacity: 0,
            brand: 'BYD',
            capacity: 7,
            salesId: salesUsers[2].id,
        },
        {
            name: 'Kia Carnival Hybrid',
            slug: 'kia-carnival-hybrid',
            description: 'Modern hybrid MPV with premium features and spacious interior',
            price: 1100000000,
            showroom: 'West Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 2000,
            brand: 'Kia',
            capacity: 8,
            salesId: salesUsers[2].id,
        },
        {
            name: 'Mitsubishi Xpander Hybrid',
            slug: 'mitsubishi-xpander-hybrid',
            description: 'Popular hybrid MPV with rugged design and great fuel efficiency',
            price: 450000000,
            showroom: 'North Jakarta',
            jenis_mobil: client_1.JenisMobil.MPV,
            engine_type: client_1.EngineType.Hybrid,
            year: 2024,
            engine_capacity: 1500,
            brand: 'Mitsubishi',
            capacity: 7,
            salesId: salesUsers[2].id,
        },
    ];
    // Update the image URL to use the provided BYD Seal image
    const generateCarImages = (mobilId) => {
        const imageUrl = 'https://www.doktermobil.com/wp-content/uploads/2024/11/Review-dan-Spesifikasi-BYD-Seal-jpg.webp';
        const imageTypes = ['main', 'exterior', 'interior', 'dashboard', 'engine', 'rear', 'side', 'wheel', 'trunk', 'other'];
        return imageTypes.map((type) => ({
            url: imageUrl,
            type,
            mobilId,
        }));
    };
    // Create cars with images
    const createdMobils = [];
    for (const carData of cars) {
        // Create the car first
        const car = await prisma.mobil.create({
            data: {
                name: carData.name,
                slug: carData.slug,
                description: carData.description,
                price: carData.price,
                showroom: carData.showroom,
                jenis_mobil: carData.jenis_mobil,
                engine_type: carData.engine_type,
                year: carData.year,
                engine_capacity: carData.engine_capacity,
                brand: carData.brand,
                capacity: carData.capacity,
                sales: {
                    connect: { id: carData.salesId }
                }
            }
        });
        // Create images for the car
        const images = generateCarImages(car.id);
        await prisma.mobilImage.createMany({
            data: images
        });
        console.log(`✅ Created ${car.name} with ${images.length} images`);
        createdMobils.push(car);
    }
    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const statuses = [
        client_1.BookingStatus.PENDING,
        client_1.BookingStatus.APPROVED,
        client_1.BookingStatus.REJECTED,
        client_1.BookingStatus.COMPLETED
    ];
    for (const client of clientUsers) {
        for (let i = 0; i < 2; i++) {
            const mobil = createdMobils[Math.floor(Math.random() * createdMobils.length)];
            const sales = salesUsers[Math.floor(Math.random() * salesUsers.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const tanggal = randomDate();
            const jam = randomTime();
            // Get the main image for the car
            const mainImage = await prisma.mobilImage.findFirst({
                where: {
                    mobilId: mobil.id,
                    type: 'main'
                }
            });
            await prisma.booking.create({
                data: {
                    user: { connect: { id: client.id } },
                    mobil: { connect: { id: mobil.id } },
                    sales: { connect: { id: sales.id } },
                    mobilName: mobil.name,
                    mobilImage: (mainImage === null || mainImage === void 0 ? void 0 : mainImage.url) || 'https://s1.bwallpapers.com/wallpapers/2014/07/27/mercedes-benz-cls63_113335529.jpg',
                    mobilPrice: mobil.price,
                    showroom: mobil.showroom,
                    tanggal,
                    jam,
                    status,
                },
            });
        }
    }
    console.log('✨ Database seeded successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('====================');
    console.log('Sales Accounts:');
    salesUsers.forEach(user => {
        console.log(`- Email: ${user.email} | Password: password123`);
    });
    console.log('\nClient Accounts:');
    clientUsers.forEach(user => {
        console.log(`- Email: ${user.email} | Password: password123`);
    });
    console.log('\n🚀 Happy testing!');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
