// src/core/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://backend-fincavalerio.onrender.com/api' 
    : '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    const mensaje = error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('[API Error]', mensaje, error)
    return Promise.reject(error)
  }
)

export default api