import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Create new order
router.post("/", async (req, res) => {
  try {
    const { customerId, items } = req.body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Customer ID and items are required" });
    }

    // Start a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          customerId,
          status: "PENDING",
          totalAmount: 0, // Will calculate below
        },
      });

      // Calculate total and validate stock
      let total = 0;
      const orderItemsData = [];

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

        orderItemsData.push({
          orderId: newOrder.id,
          productId,
          quantity,
          price: product.price,
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
    return res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin) or user's orders
router.get("/", async (req, res) => {
  try {
    const { userId, role } = req;

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

    if (userId) {
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

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
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

    return res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update order status (admin only)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;