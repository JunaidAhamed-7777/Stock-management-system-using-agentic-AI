"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all products with optional filtering
router.get("/", async (req, res) => {
    try {
        const { category, supplierId, lowStock } = req.query;
        const where = {};
        if (category) {
            where.categoryId = parseInt(category);
        }
        if (supplierId) {
            where.supplierId = parseInt(supplierId);
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
    }
    catch (error) {
        console.error("Get products error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Get product by ID
router.get("/:id", async (req, res) => {
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
    }
    catch (error) {
        console.error("Get product error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Create product (admin or supplier)
router.post("/", auth_js_1.authenticate, async (req, res) => {
    try {
        const { name, description, sku, price, quantity, lowStockThreshold, categoryId, supplierId } = req.body;
        if (req.user.role !== "ADMIN" && req.user.role !== "SUPPLIER") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!name || !sku || price === undefined || categoryId === undefined) {
            return res.status(400).json({ message: "Name, SKU, price, and categoryId are required" });
        }
        const parsedCategoryId = Number(categoryId);
        if (!Number.isInteger(parsedCategoryId) || !(await prisma.category.findUnique({ where: { id: parsedCategoryId } }))) {
            return res.status(400).json({ message: "A valid categoryId is required" });
        }
        let resolvedSupplierId;
        if (req.user.role === "SUPPLIER") {
            const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.userId } });
            if (!supplier) {
                return res.status(400).json({ message: "Supplier profile not found" });
            }
            resolvedSupplierId = supplier.id;
        }
        else {
            resolvedSupplierId = Number(supplierId);
            if (!Number.isInteger(resolvedSupplierId) || !(await prisma.supplier.findUnique({ where: { id: resolvedSupplierId } }))) {
                return res.status(400).json({ message: "A valid supplierId is required" });
            }
        }
        const product = await prisma.product.create({
            data: {
                name,
                description,
                sku,
                price: parseFloat(price),
                quantity: quantity ?? 0,
                lowStockThreshold: lowStockThreshold ?? 10,
                categoryId: parsedCategoryId,
                supplierId: resolvedSupplierId,
            },
        });
        return res.status(201).json(product);
    }
    catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Update product (admin or supplier who owns it)
router.put("/:id", async (req, res) => {
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
                price: price !== undefined ? parseFloat(price) : product.price,
                quantity: quantity ?? product.quantity,
                lowStockThreshold: lowStockThreshold ?? product.lowStockThreshold,
                categoryId: categoryId ?? product.categoryId,
                supplierId: supplierId ?? product.supplierId,
            },
        });
        return res.json(updatedProduct);
    }
    catch (error) {
        console.error("Update product error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Delete product (admin only)
router.delete("/:id", async (req, res) => {
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
    }
    catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map