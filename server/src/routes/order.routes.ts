import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Create new order - customerId comes from JWT, not request body
router.post("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Require CUSTOMER role
    if (req.user!.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Only customers can create orders" });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Validate every productId is a valid integer and every quantity is a positive integer
    for (const item of items) {
      const { productId, quantity } = item;

      if (!Number.isInteger(productId)) {
        return res.status(400).json({ message: `Invalid productId: ${productId}` });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity: ${quantity}` });
      }
    }

    // Start a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order first
      const newOrder = await tx.order.create({
        data: {
          customerId: req.user!.userId,
          status: "PENDING",
          totalAmount: 0,
        },
      });

      // Calculate total and validate stock
      let total = 0;

      for (const item of items) {
        const { productId, quantity } = item;

        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error(`Product ${productId} not found`);
        }

        if (product.quantity < quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.quantity}`);
        }

        total += product.price * quantity;

        // Create order item connected to the new order
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId,
            quantity,
            price: product.price,
          },
        });

        // Reduce product stock
        await tx.product.update({
          where: { id: productId },
          data: {
            quantity: product.quantity - quantity,
          },
        });

        // Create stock transaction
        await tx.stockTransaction.create({
          data: {
            productId,
            type: "OUT",
            quantity,
            reason: "Order placement",
          },
        });
      }

      // Update order with total amount
      await tx.order.update({
        where: { id: newOrder.id },
        data: { totalAmount: total },
      });

      return newOrder;
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    // Handle specific error codes
    if (error instanceof Error) {
      const message = error.message;
      if (message.startsWith("Product")) {
        return res.status(404).json({ message });
      }
      if (message.includes("Insufficient stock")) {
        return res.status(400).json({ message });
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all orders - ADMIN sees all, CUSTOMER sees own, SUPPLIER sees supplier orders
router.get("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;

    if (role === "ADMIN") {
      const orders = await prisma.order.findMany({
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(orders);
    }

    if (role === "CUSTOMER") {
      const orders = await prisma.order.findMany({
        where: { customerId: Number(userId) },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(orders);
    }

    // SUPPLIER - see all orders (existing behavior extended)
    if (role === "SUPPLIER") {
      const orders = await prisma.order.findMany({
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json(orders);
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get order by ID - validate integer ID, enforce authorization
router.get("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID is a valid integer
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prisma.order.findUnique({
      where: { id: parsedId },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Enforce authorization - CUSTOMER can only access their own orders
    if (req.user!.role === "CUSTOMER" && order.customerId !== req.user!.userId) {
      return res.status(403).json({ message: "Access denied: not your order" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update order status - admin only
router.patch("/:id/status", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID is a valid integer
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Only ADMIN can change status
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can change order status" });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parsedId },
    });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await prisma.order.update({
      where: { id: parsedId },
      data: { status },
    });

    return res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;