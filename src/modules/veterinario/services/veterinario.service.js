import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/empleado/listar').then(res => {
      if (res.data && Array.isArray(res.data)) {
        res.data = res.data.map(e => ({
          ...e,
          id_veterinario: e.id_empleado,
          Id_veterinario: e.id_empleado
        }))
      }
      return res
    })
  },
  
  obtenerPorId(id) {
    return api.get(`/empleado/buscar/${id}`).then(res => {
      if (res.data) {
        res.data.id_veterinario = res.data.id_empleado
        res.data.Id_veterinario = res.data.id_empleado
      }
      return res
    })
  },
  
  crear(datos) {
    return api.post('/empleado/crear', datos)
  },
  
  actualizar(id, datos) {
    return api.put(`/empleado/update/${id}`, datos)
  },
  
  eliminar(id) {
    return api.delete(`/empleado/eliminar/${id}`)
  }
}