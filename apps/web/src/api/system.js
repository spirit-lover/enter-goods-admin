import { http } from './http';
export function fetchDashboardSummary() {
    return http.get('/dashboard/summary');
}
export function fetchUsers() {
    return http.get('/system/users');
}
export function fetchRoles() {
    return http.get('/system/roles');
}
export function fetchMenus() {
    return http.get('/system/menus');
}
export function fetchLogs() {
    return http.get('/system/logs');
}
export function fetchSettings() {
    return http.get('/system/settings');
}
