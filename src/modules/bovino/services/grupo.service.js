import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/grupo/listar')
  },
  
  crear(datos) {
    return api.post('/grupo/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/grupo/actualizar/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/grupo/eliminar/${id}`)
  }
}