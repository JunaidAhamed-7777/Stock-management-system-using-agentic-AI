const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

const ALLOWED_ROLES = ['CUSTOMER', 'SUPPLIER', 'ADMIN'];

const register = async ({ name, email, password, role = 'CUSTOMER' }) => {
  if (!ALLOWED_ROLES.includes(role)) {
    const err = new Error('Invalid role');
    err.status = 400;
    throw err;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hashed = bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
  return user;
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = signToken({ userId: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = { register, login, getMe };
