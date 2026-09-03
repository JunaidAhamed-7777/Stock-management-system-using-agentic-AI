"use strict";
// Prisma Seed Data
// This script seeds the database with initial data for development purposes.
// Run with: npx tsx server/src/seeds/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Starting database seeding...");
    const password = async (value) => bcryptjs_1.default.hash(value, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const upsertUser = (name, email, plainPassword, role) => password(plainPassword).then((hashedPassword) => prisma.user.upsert({
        where: { email },
        update: { name, password: hashedPassword, role },
        create: { name, email, password: hashedPassword, role },
    }));
    // 1. Create Admin User
    const adminUser = await upsertUser("Admin User", "admin@example.com", "admin123", "ADMIN");
    console.log(`Created admin user: ${adminUser.email}`);
    // 2. Create Suppliers
    const supplierUser1 = await upsertUser("Alpha Supplier", "alpha.supplier@example.com", "supplier123", "SUPPLIER");
    const supplierUser2 = await upsertUser("Beta Supplier", "beta.supplier@example.com", "supplier123", "SUPPLIER");
    const alphaSupplier = await prisma.supplier.findFirst({ where: { companyName: "Alpha Distributors Inc." } });
    const supplier1 = alphaSupplier
        ? await prisma.supplier.update({ where: { id: alphaSupplier.id }, data: { userId: supplierUser1.id, contactNumber: "+1-555-0101", address: "123 Supply Lane, Industrial District, NY 10001" } })
        : await prisma.supplier.create({ data: { userId: supplierUser1.id, companyName: "Alpha Distributors Inc.", contactNumber: "+1-555-0101", address: "123 Supply Lane, Industrial District, NY 10001" } });
    console.log(`Created supplier: ${supplier1.companyName}`);
    const betaSupplier = await prisma.supplier.findFirst({ where: { companyName: "Beta Supplies Ltd." } });
    const supplier2 = betaSupplier
        ? await prisma.supplier.update({ where: { id: betaSupplier.id }, data: { userId: supplierUser2.id, contactNumber: "+1-555-0102", address: "456 Wholesale Rd, Commercial Area, CA 90210" } })
        : await prisma.supplier.create({ data: { userId: supplierUser2.id, companyName: "Beta Supplies Ltd.", contactNumber: "+1-555-0102", address: "456 Wholesale Rd, Commercial Area, CA 90210" } });
    console.log(`Created supplier: ${supplier2.companyName}`);
    // 3. Create Customers
    const customer1 = await upsertUser("Customer One", "customer@example.com", "customer123", "CUSTOMER");
    console.log(`Created customer: ${customer1.email}`);
    const customer2 = await upsertUser("Jane Doe", "jane.doe@example.com", "jane123", "CUSTOMER");
    console.log(`Created customer: ${customer2.email}`);
    // 4. Create Categories
    const electronics = await prisma.category.upsert({ where: { name: "Electronics" }, update: { description: "Electronic devices and accessories" }, create: { name: "Electronics", description: "Electronic devices and accessories" } });
    console.log(`Created category: ${electronics.name}`);
    const clothing = await prisma.category.upsert({ where: { name: "Clothing" }, update: { description: "Apparel and fashion items" }, create: { name: "Clothing", description: "Apparel and fashion items" } });
    console.log(`Created category: ${clothing.name}`);
    // 5. Create Products
    const product1 = await prisma.product.upsert({
        where: { sku: "SMX-128" }, update: {
            name: "Smartphone X", description: "Latest smartphone with 128GB storage", price: 699.99, quantity: 50, lowStockThreshold: 10, categoryId: electronics.id, supplierId: supplier1.id,
        }, create: {
            name: "Smartphone X",
            description: "Latest smartphone with 128GB storage",
            sku: "SMX-128",
            price: 699.99,
            quantity: 50,
            lowStockThreshold: 10,
            categoryId: electronics.id,
            supplierId: supplier1.id,
        },
    });
    console.log(`Created product: ${product1.name}`);
    const product2 = await prisma.product.upsert({
        where: { sku: "LP-15" }, update: {
            name: "Laptop Pro", description: "Professional laptop for developers", price: 1299.99, quantity: 20, lowStockThreshold: 5, categoryId: electronics.id, supplierId: supplier1.id,
        }, create: {
            name: "Laptop Pro",
            description: "Professional laptop for developers",
            sku: "LP-15",
            price: 1299.99,
            quantity: 20,
            lowStockThreshold: 5,
            categoryId: electronics.id,
            supplierId: supplier1.id,
        },
    });
    console.log(`Created product: ${product2.name}`);
    const product3 = await prisma.product.upsert({
        where: { sku: "TS-001" }, update: {
            name: "T-Shirt Basic", description: "Classic cotton t-shirt", price: 19.99, quantity: 100, lowStockThreshold: 30, categoryId: clothing.id, supplierId: supplier2.id,
        }, create: {
            name: "T-Shirt Basic",
            description: "Classic cotton t-shirt",
            sku: "TS-001",
            price: 19.99,
            quantity: 100,
            lowStockThreshold: 30,
            categoryId: clothing.id,
            supplierId: supplier2.id,
        },
    });
    console.log(`Created product: ${product3.name}`);
    const product4 = await prisma.product.upsert({
        where: { sku: "HD-300" }, update: {
            name: "Headphones Deluxe", description: "Wireless headphones with noise cancellation", price: 99.99, quantity: 8, lowStockThreshold: 10, categoryId: electronics.id, supplierId: supplier2.id,
        }, create: {
            name: "Headphones Deluxe",
            description: "Wireless headphones with noise cancellation",
            sku: "HD-300",
            price: 99.99,
            quantity: 8,
            lowStockThreshold: 10,
            categoryId: electronics.id,
            supplierId: supplier2.id,
        },
    });
    console.log(`Created product: ${product4.name}`);
    // 6. Create Stock Transactions
    const initialStockTransaction = await prisma.stockTransaction.findFirst({ where: { productId: product1.id, type: "IN", quantity: 50, reason: "Initial stock" } });
    if (!initialStockTransaction)
        await prisma.stockTransaction.create({
            data: {
                productId: product1.id,
                type: "IN",
                quantity: 50,
                reason: "Initial stock",
            },
        });
    console.log("Created stock transaction for Smartphone X (IN)");
    const orderStockTransaction = await prisma.stockTransaction.findFirst({ where: { productId: product4.id, type: "OUT", quantity: 2, reason: "Order placement" } });
    if (!orderStockTransaction)
        await prisma.stockTransaction.create({
            data: {
                productId: product4.id,
                type: "OUT",
                quantity: 2,
                reason: "Order placement",
            },
        });
    console.log("Created stock transaction for Headphones Deluxe (OUT)");
    // 7. Create Orders
    const existingOrder = await prisma.order.findFirst({ where: { customerId: customer1.id, status: "DELIVERED" } });
    if (!existingOrder)
        await prisma.order.create({
            data: {
                customerId: customer1.id,
                status: "DELIVERED",
                totalAmount: 699.99,
                orderItems: { create: { productId: product1.id, quantity: 1, price: 699.99 } },
            },
        });
    console.log("Created order for customer");
    console.log("Database seeding completed!");
}
main()
    .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map