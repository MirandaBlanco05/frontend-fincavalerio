import api from '@/core/api/axios.js'

const embarazoService = {

  async listar() {
    const { data } = await api.get('/embarazo/listar')
    return data
  },

  async crear(datos) {
    const { data } = await api.post('/embarazo/crear', datos)
    return data
  },

  async actualizar(id, datos) {
    const { data } = await api.put(`/embarazo/update/${id}`, datos)
    return data
  },

  async eliminar(id) {
    const { data } = await api.delete(`/embarazo/delete/${id}`)
    return data
  }

}

export default embarazoService