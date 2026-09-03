import authApi from "./api";

export interface StockTransaction {
  id: number;
  productId: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason: string;
  product?: {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    lowStockThreshold: number;
  };
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  category?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    companyName: string;
  };
}

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await authApi().get("/stock/low-stock");
  return response.data as LowStockProduct[];
};

export const getStockTransactions = async (
  productId?: number
): Promise<StockTransaction[]> => {
  const params: any = {};
  if (productId) {
    params.productId = productId;
  }
  const response = await authApi().get("/stock/transactions", { params });
  return response.data as StockTransaction[];
};

export const adjustStock = async (
  productId: number,
  quantity: number,
  type: "IN" | "OUT" | "ADJUSTMENT",
  reason: string = "Manual adjustment"
): Promise<{ message: string; product: { id: number; name: string; quantity: number } }> => {
  const response = await authApi().patch("/stock/adjust", {
    productId,
    quantity,
    type,
    reason,
  });
  return response.data;
};