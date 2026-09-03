// Prisma Seed Data
// This script seeds the database with initial data for development purposes.
// Run with: npx tsx server/src/seeds/index.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // hashed in production
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // 2. Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      userId: adminUser.id,
      companyName: "Alpha Distributors Inc.",
      contactNumber: "+1-555-0101",
      address: "123 Supply Lane, Industrial District, NY 10001",
    },
  });
  console.log(`Created supplier: ${supplier1.companyName}`);

  const supplier2 = await prisma.supplier.create({
    data: {
      userId: adminUser.id,
      companyName: "Beta Supplies Ltd.",
      contactNumber: "+1-555-0102",
      address: "456 Wholesale Rd, Commercial Area, CA 90210",
    },
  });
  console.log(`Created supplier: ${supplier2.companyName}`);

  // 3. Create Customers
  const customer1 = await prisma.user.create({
    data: {
      name: "Customer One",
      email: "customer@example.com",
      password: "customer123", // hashed in production
      role: "CUSTOMER",
    },
  });
  console.log(`Created customer: ${customer1.email}`);

  const customer2 = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "jane123", // hashed in production
      role: "CUSTOMER",
    },
  });
  console.log(`Created customer: ${customer2.email}`);

  // 4. Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic devices and accessories",
    },
  });
  console.log(`Created category: ${electronics.name}`);

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      description: "Apparel and fashion items",
    },
  });
  console.log(`Created category: ${clothing.name}`);

  // 5. Create Products
  const product1 = await prisma.product.create({
    data: {
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

  const product2 = await prisma.product.create({
    data: {
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

  const product3 = await prisma.product.create({
    data: {
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

  const product4 = await prisma.product.create({
    data: {
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
  await prisma.stockTransaction.create({
    data: {
      productId: product1.id,
      type: "IN",
      quantity: 50,
      reason: "Initial stock",
    },
  });
  console.log("Created stock transaction for Smartphone X (IN)");

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
  await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: "DELIVERED",
      totalAmount: 699.99,
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