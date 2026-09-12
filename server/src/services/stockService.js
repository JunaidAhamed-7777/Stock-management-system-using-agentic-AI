const prisma = require('../prismaClient');

const getLowStock = async (user) => {
  const allProducts = await prisma.product.findMany({ include: { supplier: true } });
  const filtered = allProducts.filter((p) => p.quantity <= p.lowStockThreshold && (!user.supplierId || p.supplierId === user.supplierId));
  return filtered;
};

const adjustStock = async ({ productId, quantityChange, reason }, user) => {
  // Only ADMIN or SUPPLIER can adjust
  if (!['ADMIN', 'SUPPLIER'].includes(user.role)) {
    const err = new Error('Forbidden'); err.status = 403; throw err;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  // For supplier, check ownership
  if (user.role === 'SUPPLIER' && product.supplierId !== user.supplierId) {
    const err = new Error('Forbidden: not your product'); err.status = 403; throw err;
  }

  const newQuantity = product.quantity + quantityChange;
  if (newQuantity < 0) {
    const err = new Error('Resulting stock cannot be negative'); err.status = 400; throw err;
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id: productId }, data: { quantity: newQuantity } });
    await tx.stockTransaction.create({ data: { productId, type: quantityChange >= 0 ? 'IN' : 'OUT', quantity: Math.abs(quantityChange), reason } });
  });

  return { id: productId, quantity: newQuantity };
};

module.exports = { getLowStock, adjustStock };
