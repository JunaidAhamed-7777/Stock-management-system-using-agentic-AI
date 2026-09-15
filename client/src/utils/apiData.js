export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function toId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : NaN;
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
