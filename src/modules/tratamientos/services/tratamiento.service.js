import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/tratamiento/listar')
  },
  
  obtenerPorId(id) {
    return api.get(`/tratamiento/${id}`)
  },
  
  crear(datos) {
    return api.post('/tratamiento/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/tratamiento/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/tratamiento/eliminar/${id}`)
  }
}