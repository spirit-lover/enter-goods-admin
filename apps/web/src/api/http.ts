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

function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}

export const http = {
  get<T>(url: string, config?: object) {
    return instance.get(url, config).then((response) => unwrap<T>(response));
  },
  post<T>(url: string, payload?: unknown, config?: object) {
    return instance.post(url, payload, config).then((response) => unwrap<T>(response));
  },
  patch<T>(url: string, payload?: unknown, config?: object) {
    return instance.patch(url, payload, config).then((response) => unwrap<T>(response));
  },
  delete<T>(url: string, config?: object) {
    return instance.delete(url, config).then((response) => unwrap<T>(response));
  }
};
