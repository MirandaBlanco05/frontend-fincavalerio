// src/modules/ordenio/services/ordenio.service.js
import api from '@/core/api/axios.js'

export const ordenioService = {
  listar: () => api.get('/ordenio/listar'),              // ← AGREGADO /listar
  obtener: (id) => api.get(`/ordenio/buscar/${id}`),     // ← CAMBIADO a /buscar/:id
  crear: (data) => api.post('/ordenio/crear', data),     // ← AGREGADO /crear
  actualizar: (id, data) => api.put(`/ordenio/update/${id}`, data),  // ← CAMBIADO a /update/:id
  eliminar: (id) => api.delete(`/ordenio/eliminar/${id}`) // ← AGREGADO /eliminar
}