import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/reproduccion/listar')
  },

  crear(datos) {
    return api.post('/reproduccion/crear', datos)
  },

  actualizar(id, datos) {
    return api.put(`/reproduccion/actualizar/${id}`, datos)
  },

  eliminar(id) {
    return api.delete(`/reproduccion/eliminar/${id}`)
  }
}