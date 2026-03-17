export type ProductStatus = 'draft' | 'active' | 'inactive';

export interface ProductDTO {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: number;
  costPrice: number;
  stock: number;
  sales: number;
  status: ProductStatus;
  cover: string;
  description: string;
  updatedAt: string;
}

export interface ProductFilter {
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  page: number;
  pageSize: number;
}

export interface ProductUpsertPayload {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  status: ProductStatus;
  cover: string;
  description: string;
}

export interface InventoryAdjustPayload {
  productId: string;
  change: number;
  reason: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  sort: number;
}

export interface OrderDTO {
  id: string;
  orderNo: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'closed';
  createdAt: string;
}

export interface InventoryRecordDTO {
  id: string;
  productId: string;
  productName: string;
  change: number;
  reason: string;
  createdAt: string;
  operatorName: string;
}
