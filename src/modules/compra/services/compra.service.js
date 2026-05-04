import api from '@/core/api/axios.js'

export const compraService = {
  listar: () => api.get('/compra/listar'),
  obtener: (id) => api.get(`/compra/${id}`),
  crear: (data) => api.post('/compra/crear', data),
  actualizar: (id, data) => api.put(`/compra/update/${id}`, data),
  eliminar: (id) => api.delete(`/compra/${id}`)
}