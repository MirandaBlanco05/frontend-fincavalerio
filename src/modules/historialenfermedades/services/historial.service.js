import api from '@/core/api/axios.js'

export default {
  // Listar todos los historiales con sus enfermedades
  listar() {
    return api.get('/historial/listar')
  },
  
  // Obtener historial de un bovino específico
  listarPorBovino(id_bovino) {
    return api.get(`/historial/bovino/${id_bovino}`)
  },
  
  // Obtener un historial por ID
  obtenerPorId(id) {
    return api.get(`/historial/${id}`)
  },
  
  // Crear nuevo historial de enfermedad
  crear(datos) {
    return api.post('/historial/crear', datos)
  },
  
  // Actualizar historial
  actualizar(id, datos) {
    return api.put(`/historial/update/${id}`, datos)
  },
  
  // Eliminar historial
  eliminar(id) {
    return api.delete(`/historial/eliminar/${id}`)
  }
}