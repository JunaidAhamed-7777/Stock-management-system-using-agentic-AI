import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthenticatedRequest } from "../../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;

    if (role === "ADMIN") {
      const [totalProducts, totalStock, totalOrders, pendingOrders] = await Promise.all([
        prisma.product.count(),
        prisma.product.aggregate({ _sum: { quantity: true } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
      ]);

      const lowStockProducts = await prisma.product.findMany({
        where: {
          quantity: { lte: 10 },
        },
        select: { name: true, quantity: true, lowStockThreshold: true },
      });

      return res.json({
        role: "ADMIN",
        stats: {
          totalProducts,
          totalStock: totalStock._sum.quantity || 0,
          totalOrders,
          pendingOrders,
        },
        lowStockProducts,
      });
    }


    if (role === "SUPPLIER") {
      const supplier = await prisma.supplier.findUnique({
        where: { userId: userId },
      });

      if (!supplier) {
        return res.status(404).json({ message: "Supplier profile not found" });
      }

      const [productCount, totalStock] = await Promise.all([
        prisma.product.count({ where: { supplierId: supplier.id } }),
        prisma.product.aggregate({
          where: { supplierId: supplier.id },
          _sum: { quantity: true },
        }),
      ]);

      const supplierOrders = await prisma.order.findMany({
        where: {
          orderItems: {
            some: {
              product: { supplierId: supplier.id },
            },
          },
        },
        select: { id: true, status: true, totalAmount: true, createdAt: true },
      });

      return res.json({
        role: "SUPPLIER",
        stats: {
          productCount,
          totalStock: totalStock._sum.quantity || 0,
          orderCount: supplierOrders.length,
        },
        recentOrders: supplierOrders.slice(0, 5),
      });
    }

    if (role === "CUSTOMER") {
      const customerOrders = await prisma.order.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, totalAmount: true, createdAt: true },
      });

      return res.json({
        role: "CUSTOMER",
        stats: {
          totalOrders: customerOrders.length,
        },
        recentOrders: customerOrders.slice(0, 5),
      });
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
