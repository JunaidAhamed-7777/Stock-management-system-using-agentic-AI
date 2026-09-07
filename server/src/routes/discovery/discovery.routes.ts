import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();


// Get all categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all suppliers (Publicly accessible for product browsing, but can be restricted)
router.get("/suppliers", async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        companyName: true,
        contactNumber: true,
        address: true,
      },
    });
    return res.json(suppliers);
  } catch (error) {
    console.error("Get suppliers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get supplier by ID
router.get("/suppliers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        companyName: true,
        contactNumber: true,
        address: true,
      },
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.json(supplier);
  } catch (error) {
    console.error("Get supplier error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
