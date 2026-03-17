import type { CategoryDTO, InventoryAdjustPayload, InventoryRecordDTO, OrderDTO, PageResult, ProductDTO, ProductFilter, ProductUpsertPayload } from '@enterprise/shared';
import { http } from './http';

export function fetchProducts(params: ProductFilter) {
  return http.get<PageResult<ProductDTO>>('/products', { params });
}

export function createProduct(payload: ProductUpsertPayload) {
  return http.post<ProductDTO>('/products', payload);
}

export function updateProduct(id: string, payload: ProductUpsertPayload) {
  return http.patch<ProductDTO>(`/products/${id}`, payload);
}

export function publishProduct(id: string, status: 'active' | 'inactive') {
  return http.patch<ProductDTO>(`/products/${id}/status`, { status });
}

export function deleteProduct(id: string) {
  return http.delete<null>(`/products/${id}`);
}

export function adjustInventory(payload: InventoryAdjustPayload) {
  return http.post<ProductDTO>('/products/inventory/adjust', payload);
}

export function fetchCategories() {
  return http.get<CategoryDTO[]>('/products/categories');
}

export function fetchInventoryRecords() {
  return http.get<InventoryRecordDTO[]>('/products/inventory/records');
}

export function fetchOrders() {
  return http.get<OrderDTO[]>('/products/orders');
}
