import authApi from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  categoryId: number;
  supplierId?: number;
  category?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    companyName: string;
  };
  orderItems?: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export interface ProductFilters {
  category?: string;
  supplierId?: string;
  lowStock?: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity?: number;
  lowStockThreshold?: number;
  categoryId: number;
  supplierId?: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  lowStockThreshold?: number;
  categoryId?: number;
  supplierId?: number;
}

export const getProducts = async (filters?: ProductFilters) => {
  const params: any = {};

  if (filters) {
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.supplierId) {
      params.supplierId = filters.supplierId;
    }
    if (filters.lowStock) {
      params.lowStock = "true";
    }
  }

  const response = await authApi().get("/products", { params });
  return response.data as Product[];
};

export const getProductById = async (id: number) => {
  const response = await authApi().get(`/products/${id}`);
  return response.data as Product;
};

export const createProduct = async (data: CreateProductData) => {
  const response = await authApi().post("/products", data);
  return response.data as Product;
};

export const updateProduct = async (id: number, data: UpdateProductData) => {
  const response = await authApi().put(`/products/${id}`, data);
  return response.data as Product;
};

export const deleteProduct = async (id: number) => {
  const response = await authApi().delete(`/products/${id}`);
  return response.data;
};