import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Get low stock products
router.get("/low-stock", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    
    if (role === "ADMIN") {
      const products = await prisma.product.findMany({
        where: {
          quantity: { lte: 10 },
        },
        include: {
          category: true,
          supplier: true,
        },
      });
      return res.json(products);
    }

    if (role === "SUPPLIER") {
      const supplier = await prisma.supplier.findUnique({ where: { userId: req.user!.userId } });
      if (!supplier) return res.status(404).json({ message: "Supplier profile not found" });

      const products = await prisma.product.findMany({
        where: {
          supplierId: supplier.id,
          quantity: { lte: 10 },
        },
        include: {
          category: true,
          supplier: true,
        },
      });
      return res.json(products);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Get low stock products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get stock transactions
router.get("/transactions", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    const { productId } = req.query;

    if (role !== "ADMIN") {
      // Suppliers should only see transactions for their products
      if (role === "SUPPLIER") {
        const supplier = await prisma.supplier.findUnique({ where: { userId: req.user!.userId } });
        if (!supplier) return res.status(404).json({ message: "Supplier profile not found" });
        
        if (productId) {
          const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
          if (!product || product.supplierId !== supplier.id) {
            return res.status(403).json({ message: "Forbidden: You do not own this product" });
          }
        } else {
          // If no productId, return all transactions for supplier's products
          const supplierProducts = await prisma.product.findMany({
            where: { supplierId: supplier.id },
            select: { id: true }
          });
          const productIds = supplierProducts.map(p => p.id);
          
          const transactions = await prisma.stockTransaction.findMany({
            where: { productId: { in: productIds } },
            include: { product: true },
            orderBy: { createdAt: "desc" },
          });
          return res.json(transactions);
        }
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

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
router.patch("/adjust", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== "ADMIN" && role !== "SUPPLIER") {
      return res.status(403).json({ message: "Forbidden" });
    }

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

    if (role === "SUPPLIER") {
      const supplier = await prisma.supplier.findUnique({ where: { userId: req.user!.userId } });
      if (!supplier || product.supplierId !== supplier.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this product" });
      }
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
