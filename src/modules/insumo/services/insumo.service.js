import api from '@/core/api/axios.js'

const insumoService = {
  async listar() {
    const res = await api.get('/insumo/listar')
    return res.data
  },

  async crear(datos) {
    const res = await api.post('/insumo/crear', datos)
    return res.data
  },

  async actualizar(id, datos) {
    const res = await api.put(`/insumo/update/${id}`, datos)
    return res.data
  },

  async eliminar(id) {
    const res = await api.delete(`/insumo/eliminar/${id}`)
    return res.data
  }
}

export default insumoService