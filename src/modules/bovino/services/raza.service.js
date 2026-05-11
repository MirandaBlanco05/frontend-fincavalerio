import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/raza/listar')
  },
  
  crear(datos) {
    return api.post('/raza/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/raza/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/raza/eliminar/${id}`)
  }
}