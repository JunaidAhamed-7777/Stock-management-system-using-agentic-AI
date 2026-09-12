const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

const getProfileById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

const updateProfile = async (id, data) => {
  const { name, email } = data;
  const updated = await prisma.user.update({
    where: { id },
    data: { name, email },
  });
  return { id: updated.id, name: updated.name, email: updated.email, role: updated.role };
};

module.exports = { getProfileById, updateProfile };
