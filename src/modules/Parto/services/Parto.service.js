// src/modules/parto/services/parto.service.js
import api from '@/core/api/axios.js'

const partoService = {

  async listar() {
    const { data } = await api.get('/parto/listar')
    return data
  },

  async obtener(id) {
    const { data } = await api.get(`/parto/${id}`)  // ← Correcto según backend
    return data
  },

  async crear(datos) {
    const { data } = await api.post('/parto/crear', datos)
    return data
  },

  async actualizar(id, datos) {
    const { data } = await api.put(`/parto/actualizar/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/parto/eliminar/${id}`)
    return data
  }

}

export default partoService