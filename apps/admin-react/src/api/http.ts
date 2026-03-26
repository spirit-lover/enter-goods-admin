import axios from 'axios';

const ACCESS_TOKEN_KEY = 'enterprise_access_token';
const REFRESH_TOKEN_KEY = 'enterprise_refresh_token';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  timeout: 10000
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

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

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
