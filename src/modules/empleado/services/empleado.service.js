// src/modules/empleado/services/empleado.service.js
import api from '@/core/api/axios.js'

export const empleadoService = {
  listar: () => api.get('/empleado'),
  obtener: (id) => api.get(`/empleado/${id}`),
  crear: (data) => api.post('/empleado', data),
  actualizar: (id, data) => api.put(`/empleado/${id}`, data),
  eliminar: (id) => api.delete(`/empleado/${id}`)
}