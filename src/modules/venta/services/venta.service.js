// src/modules/venta/services/venta.service.js
import api from '@/core/api/axios.js'

export const ventaService = {
  // Listar todas las ventas
  listar: () => api.get('/venta/listar'),
  
  // Obtener una venta por ID
  obtener: (id) => api.get(`/venta/${id}`),
  
  // Crear nueva venta
  crear: (data) => api.post('/venta/crear', data),
  
  // Actualizar venta
  actualizar: (id, data) => api.put(`/venta/update/${id}`, data),
  
  // Eliminar venta
  eliminar: (id) => api.delete(`/venta/eliminar/${id}`)
}