// src/core/api/axios.js
import axios from 'axios'

const api = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para asegurar que todas las rutas lleven el prefijo /api correctamente
api.interceptors.request.use(config => {
  // Si la URL no es absoluta y no empieza por /api, se lo agregamos
  if (!config.url.startsWith('http') && !config.url.startsWith('/api')) {
    const cleanUrl = config.url.startsWith('/') ? config.url.substring(1) : config.url;
    config.url = `/api/${cleanUrl}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    const mensaje = error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('[API Error]', mensaje, error)
    return Promise.reject(error)
  }
)

export default api