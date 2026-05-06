import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/vacuna/listar')
  },
  
  listarPorBovino(id_bovino) {
    return api.get(`/vacuna/bovino/${id_bovino}`)
  },
  
  obtenerPorId(id) {
    return api.get(`/vacuna/${id}`)
  },
  
  crear(datos) {
    return api.post('/vacuna/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/vacuna/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/vacuna/eliminar/${id}`)
  }
}