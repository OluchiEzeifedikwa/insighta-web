import api from './api';

let csrfToken = null;

export async function getCsrfToken() {
  if (!csrfToken) {
    const res = await api.get('/auth/csrf-token');
    csrfToken = res.data.csrf_token;
  }
  return csrfToken;
}

export function clearCsrfToken() {
  csrfToken = null;
}

export async function csrfPost(url, data = {}) {
  const token = await getCsrfToken();
  return api.post(url, data, { headers: { 'X-CSRF-Token': token } });
}
