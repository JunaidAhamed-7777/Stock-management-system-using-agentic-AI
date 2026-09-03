import authApi from "./api";

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  customer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateOrderItems {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  items: CreateOrderItems[];
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const createOrder = async (items: CreateOrderItems[]): Promise<Order> => {
  const response = await authApi().post("/orders", { items });
  return response.data as Order;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await authApi().get("/orders");
  return response.data as Order[];
};

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await authApi().get(`/orders/${id}`);
  return response.data as Order;
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<Order> => {
  const response = await authApi().patch(`/orders/${id}/status`, { status });
  return response.data as Order;
};