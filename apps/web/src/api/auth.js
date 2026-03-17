import { http } from './http';
export function login(payload) {
    return http.post('/auth/login', payload);
}
export function refresh(refreshToken) {
    return http.post('/auth/refresh', { refreshToken });
}
export function logout(refreshToken) {
    return http.post('/auth/logout', { refreshToken });
}
export function fetchProfile() {
    return http.get('/auth/profile');
}
export function fetchMenus() {
    return http.get('/permissions/menus');
}
export function fetchCodes() {
    return http.get('/permissions/codes');
}
