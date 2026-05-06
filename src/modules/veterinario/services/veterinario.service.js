import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/veterinario/listar')
  },
  
  obtenerPorId(id) {
    return api.get(`/veterinario/${id}`)
  },
  
  crear(datos) {
    return api.post('/veterinario/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/veterinario/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/veterinario/eliminar/${id}`)
  }
}