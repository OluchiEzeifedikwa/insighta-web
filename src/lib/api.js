import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND_URL) throw new Error('VITE_BACKEND_URL environment variable is not set');

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { 'X-API-Version': '1' },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve());
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(original)).catch((err) => Promise.reject(err));
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await axios.post(`${BACKEND_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err);
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
