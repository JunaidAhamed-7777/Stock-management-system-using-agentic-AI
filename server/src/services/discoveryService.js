const prisma = require('../prismaClient');

const getCategories = async () => prisma.category.findMany();

const getSuppliers = async () => {
  return prisma.supplier.findMany({ include: { user: true } });
};

const getSupplierById = async (id) => {
  const sup = await prisma.supplier.findUnique({ where: { id }, include: { user: true } });
  if (!sup) throw new Error('Supplier not found');
  return sup;
};

module.exports = { getCategories, getSuppliers, getSupplierById };
