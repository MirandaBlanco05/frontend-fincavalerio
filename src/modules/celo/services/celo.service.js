import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/ciclo/listar')
  },

  crear(datos) {
    return api.post('/ciclo/crear', datos)
  },

  actualizar(id, datos) {
    return api.put(`/ciclo/actualizar/${id}`, datos)
  },

  eliminar(id) {
    return api.delete(`/ciclo/eliminar/${id}`)
  }
}