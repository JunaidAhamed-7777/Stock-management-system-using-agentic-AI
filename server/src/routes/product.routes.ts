import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all products with optional filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, supplierId, lowStock } = req.query;

    const where: any = {};

    if (category) {
      where.categoryId = parseInt(category as string);
    }

    if (supplierId) {
      where.supplierId = parseInt(supplierId as string);
    }

    if (lowStock === "true") {
      where.quantity = {
        lte: 10,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
      },
    });

    return res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get product by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        supplier: true,
        orderItems: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create product (admin or supplier)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, sku, price, quantity, lowStockThreshold, categoryId, supplierId } = req.body;

    if (!name || !sku || price === undefined) {
      return res.status(400).json({ message: "Name, SKU, and price are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        price: parseFloat(price as string),
        quantity: quantity ?? 0,
        lowStockThreshold: lowStockThreshold ?? 10,
        categoryId: categoryId ?? undefined,
        supplierId: supplierId ?? undefined,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update product (admin or supplier who owns it)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, sku, price, quantity, lowStockThreshold, categoryId, supplierId } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? product.name,
        description: description ?? product.description,
        sku: sku ?? product.sku,
        price: price !== undefined ? parseFloat(price as string) : product.price,
        quantity: quantity ?? product.quantity,
        lowStockThreshold: lowStockThreshold ?? product.lowStockThreshold,
        categoryId: categoryId ?? product.categoryId,
        supplierId: supplierId ?? product.supplierId,
      },
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete product (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;