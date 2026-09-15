export const ROLES = {
  ADMIN: "ADMIN",
  SUPPLIER: "SUPPLIER",
  CUSTOMER: "CUSTOMER",
};

export function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

export function isRole(user, role) {
  return normalizeRole(user?.role) === normalizeRole(role);
}

export function portalHome(role) {
  switch (normalizeRole(role)) {
    case ROLES.ADMIN:
      return "/admin/dashboard";
    case ROLES.SUPPLIER:
      return "/supplier/dashboard";
    case ROLES.CUSTOMER:
      return "/customer/dashboard";
    default:
      return "/login";
  }
}

export function portalLabel(role) {
  switch (normalizeRole(role)) {
    case ROLES.ADMIN:
      return "Admin Portal";
    case ROLES.SUPPLIER:
      return "Supplier Portal";
    case ROLES.CUSTOMER:
      return "Customer Portal";
    default:
      return "StockFlow";
  }
}

export function roleSubtitle(role) {
  switch (normalizeRole(role)) {
    case ROLES.ADMIN:
      return "Global Operations";
    case ROLES.SUPPLIER:
      return "Inbound Fulfillment";
    case ROLES.CUSTOMER:
      return "Procurement Desk";
    default:
      return "Enterprise";
  }
}
