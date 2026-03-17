import axios from 'axios';
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
    timeout: 10000
});
instance.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('enterprise_access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
function unwrap(response) {
    return response.data.data;
}
export const http = {
    get(url, config) {
        return instance.get(url, config).then((response) => unwrap(response));
    },
    post(url, payload, config) {
        return instance.post(url, payload, config).then((response) => unwrap(response));
    },
    patch(url, payload, config) {
        return instance.patch(url, payload, config).then((response) => unwrap(response));
    },
    delete(url, config) {
        return instance.delete(url, config).then((response) => unwrap(response));
    }
};
