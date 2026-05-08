import api from '@/core/api/axios.js'

const inseminacionService = {

  async listar() {
    const { data } = await api.get('/inseminacion/listar')
    return data
  },

  async crear(datos) {
    const { data } = await api.post('/inseminacion/crear', datos)
    return data
  },

  async actualizar(id, datos) {
    const { data } = await api.put(`/inseminacion/actualizar/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/inseminacion/eliminar/${id}`)
    return data
  }

}

export default inseminacionService