// Request interceptor attaches the bearer token from localStorage.
// Response interceptor: on a 401, attempts exactly one silent refresh via
// POST /api/auth/refresh, then retries the original request once with the
// new token. If the refresh itself fails, the session is cleared and the
// user is sent back to /login.
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'ascend_admin_token';
export const REFRESH_TOKEN_KEY = 'ascend_admin_refresh_token';
export const USER_KEY = 'ascend_admin_user';

const axiosInstance = axios.create({ baseURL: API_URL });

let isRefreshing = false;
let pendingRequests: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const resolvePendingRequests = (token: string | null, error?: unknown) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingRequests = [];
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      if (error.response?.status === 401 && window.location.pathname !== '/login') {
        clearSession();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      if (!data?.success || !data?.token) {
        throw new Error('Refresh did not return a token');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      resolvePendingRequests(data.token);
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      resolvePendingRequests(null, refreshError);
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
