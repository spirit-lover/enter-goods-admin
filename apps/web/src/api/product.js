import { http } from './http';
export function fetchProducts(params) {
    return http.get('/products', { params });
}
export function createProduct(payload) {
    return http.post('/products', payload);
}
export function updateProduct(id, payload) {
    return http.patch(`/products/${id}`, payload);
}
export function publishProduct(id, status) {
    return http.patch(`/products/${id}/status`, { status });
}
export function deleteProduct(id) {
    return http.delete(`/products/${id}`);
}
export function adjustInventory(payload) {
    return http.post('/products/inventory/adjust', payload);
}
export function fetchCategories() {
    return http.get('/products/categories');
}
export function fetchInventoryRecords() {
    return http.get('/products/inventory/records');
}
export function fetchOrders() {
    return http.get('/products/orders');
}
