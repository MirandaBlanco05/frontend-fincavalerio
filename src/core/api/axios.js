// src/core/api/axios.js
// Instancia base de Axios para todas las peticiones al backend

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? '/api' : 'https://backend-fincavalerio.onrender.com/api'),
  timeout: 60000,
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