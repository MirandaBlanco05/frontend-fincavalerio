// src/core/api/axios.js
// Instancia base de Axios para todas las peticiones al backend

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',          // Proxy configurado en vite.config.js → localhost:3000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de respuesta: maneja errores globales
api.interceptors.response.use(
  response => response,
  error => {
    const mensaje = error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('[API Error]', mensaje, error)
    return Promise.reject(error)
  }
)

export default api