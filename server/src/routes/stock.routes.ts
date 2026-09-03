import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get low stock products
router.get("/low-stock", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });

    return res.json(products.filter((product) => product.quantity <= product.lowStockThreshold));
  } catch (error) {
    console.error("Get low stock products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get stock transactions
router.get("/transactions", async (req, res) => {
  try {
    const { productId } = req.query;

    const where: any = {};

    if (productId) {
      where.productId = Number(productId);
    }

    const transactions = await prisma.stockTransaction.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Get stock transactions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Manual stock adjustment
router.patch("/adjust", async (req, res) => {
  try {
    const { productId, quantity, type, reason } = req.body;

    if (!productId || quantity === undefined || !type) {
      return res.status(400).json({ message: "productId, quantity, and type are required" });
    }

    if (type !== "IN" && type !== "OUT" && type !== "ADJUSTMENT") {
      return res.status(400).json({ message: "Invalid stock transaction type" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let newQuantity = product.quantity;

    if (type === "IN") {
      newQuantity += quantity;
    } else if (type === "OUT") {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock for OUT adjustment" });
      }
      newQuantity -= quantity;
    } else if (type === "ADJUSTMENT") {
      newQuantity += quantity;
    }

    await prisma.product.update({
      where: { id: productId },
      data: { quantity: newQuantity },
    });

    await prisma.stockTransaction.create({
      data: {
        productId,
        type,
        quantity: Math.abs(quantity),
        reason: reason || "Manual adjustment",
      },
    });

    return res.json({
      message: "Stock adjusted successfully",
      product: { id: product.id, name: product.name, quantity: newQuantity },
    });
  } catch (error) {
    console.error("Adjust stock error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
