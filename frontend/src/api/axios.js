import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { "Content-Type": "application/json" },
});

// attach token
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('access_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// auto‑refresh
let isRefreshing = false, queue = [];
api.interceptors.response.use(
  r => r,
  async err => {
    const { config, response } = err;
    if (response?.status === 401 && !config.__isRetry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
          });
          localStorage.setItem('access_token', data.access);
          isRefreshing = false;
          queue.forEach(cb => cb(data.access));
          queue = [];
        } catch (e) {
          // logout user
          localStorage.clear();
          window.location.href = '/';
        }
      }
      return new Promise(resolve => {
        queue.push(tok => {
          config.headers.Authorization = `Bearer ${tok}`;
          config.__isRetry = true;
          resolve(api(config));
        });
      });
    }
    return Promise.reject(err);
  }
);

export default api;
