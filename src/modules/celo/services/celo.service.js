// src/modules/celo/services/celo.service.js
import api from '@/core/api/axios.js'

export const celoService = {
  listar: () => api.get('/ciclo/listar'),
  obtener: (id) => api.get(`/ciclo/${id}`),
  crear: (data) => api.post('/ciclo/crear', data),
  actualizar: (id, data) => api.put(`/ciclo/update/${id}`, data),
  eliminar: (id) => api.delete(`/ciclo/delete/${id}`)
}