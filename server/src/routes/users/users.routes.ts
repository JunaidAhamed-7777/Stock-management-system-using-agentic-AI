import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthenticatedRequest } from "../../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Get current user profile
router.get("/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update current user profile
router.patch("/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        email: email,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Update me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Get all customers
router.get("/customers", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
