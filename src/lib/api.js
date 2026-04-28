import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND_URL) throw new Error('VITE_BACKEND_URL environment variable is not set');

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { 'X-API-Version': '1' },
});

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);
let csrfToken = null;
let csrfFetchPromise = null;

async function fetchCsrfToken() {
  if (csrfToken) return csrfToken;
  if (csrfFetchPromise) return csrfFetchPromise;
  csrfFetchPromise = axios
    .get(`${BACKEND_URL}/auth/csrf-token`, { withCredentials: true })
    .then((res) => {
      csrfToken = res.data.csrf_token;
      csrfFetchPromise = null;
      return csrfToken;
    })
    .catch((err) => {
      csrfFetchPromise = null;
      throw err;
    });
  return csrfFetchPromise;
}

api.interceptors.request.use(async (config) => {
  if (MUTATING.has(config.method?.toLowerCase())) {
    config.headers['X-CSRF-Token'] = await fetchCsrfToken();
  }
  return config;
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

    if (error.response?.status === 403 && !original._csrfRetry) {
      original._csrfRetry = true;
      csrfToken = null;
      original.headers['X-CSRF-Token'] = await fetchCsrfToken();
      return api(original);
    }

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
