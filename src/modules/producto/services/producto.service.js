import api from '@/core/api/axios.js'

const productoService = {
  async listar() {
    const res = await api.get('/producto/listar')
    return res.data
  },

  async crear(datos) {
    const res = await api.post('/producto/crear', datos)
    return res.data
  },

  async actualizar(id, datos) {
    const res = await api.put(`/producto/update/${id}`, datos)
    return res.data
  },

  async eliminar(id) {
    const res = await api.delete(`/producto/eliminar/${id}`)
    return res.data
  }
}

export default productoService