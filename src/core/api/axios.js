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
  const isProd = import.meta.env.PROD;
  const backendUrl = 'https://backend-fincavalerio.onrender.com/api';

  if (!config.url.startsWith('http')) {
    const cleanUrl = config.url.startsWith('/') ? config.url.substring(1) : config.url;
    
    if (isProd) {
      // En producción, forzamos la URL absoluta del backend
      config.url = `${backendUrl}/${cleanUrl.replace(/^api\//, '')}`;
    } else {
      // En desarrollo, usamos el prefijo /api para el proxy
      if (!config.url.startsWith('/api') && !config.url.startsWith('api/')) {
        config.url = `/api/${cleanUrl}`;
      }
    }
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