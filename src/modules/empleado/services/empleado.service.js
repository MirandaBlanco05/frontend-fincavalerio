// src/modules/empleado/services/empleado.service.js
import api from '@/core/api/axios.js'

export const empleadoService = {
  listar: () => api.get('/empleado/listar'),              // ← AGREGADO /listar
  obtener: (id) => api.get(`/empleado/buscar/${id}`),     // ← CAMBIADO a /buscar/:id
  crear: (data) => api.post('/empleado/crear', data),     // ← AGREGADO /crear
  actualizar: (id, data) => api.put(`/empleado/update/${id}`, data),  // ← CAMBIADO a /update/:id
  eliminar: (id) => api.delete(`/empleado/eliminar/${id}`) // ← AGREGADO /eliminar
}