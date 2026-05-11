import api from '@/core/api/axios.js'

const clienteService = {
  async listar() {
    const res = await api.get('/cliente/listar')
    return res.data
  },

  async obtener(id) {
    const res = await api.get(`/cliente/${id}`)
    return res.data
  },

  async crear(datos) {
    const res = await api.post('/cliente/crear', datos)
    return res.data
  },

  async actualizar(id, datos) {
    const res = await api.put(`/cliente/update/${id}`, datos)
    return res.data
  },

  async eliminar(id) {
    const res = await api.delete(`/cliente/eliminar/${id}`)
    return res.data
  }
}

export default clienteService