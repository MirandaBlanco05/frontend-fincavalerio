import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/api/raza/listar')
  },
  
  crear(datos) {
    return api.post('/api/raza/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/api/raza/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/api/raza/eliminar/${id}`)
  }
}