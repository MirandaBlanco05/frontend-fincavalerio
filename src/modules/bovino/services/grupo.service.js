import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/api/grupo/listar')
  },
  
  crear(datos) {
    return api.post('/api/grupo/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/api/grupo/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/api/grupo/eliminar/${id}`)
  }
}