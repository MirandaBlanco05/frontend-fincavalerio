// src/modules/ordenio/services/ordenio.service.js
import api from '@/core/api/axios.js'

export const ordenioService = {
  listar: () => api.get('/ordenio'),
  obtener: (id) => api.get(`/ordenio/${id}`),
  crear: (data) => api.post('/ordenio', data),
  actualizar: (id, data) => api.put(`/ordenio/${id}`, data),
  eliminar: (id) => api.delete(`/ordenio/${id}`)
}