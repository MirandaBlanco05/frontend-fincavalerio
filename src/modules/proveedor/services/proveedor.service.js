import api from '@/core/api/axios.js'

const proveedorService = {
  async listar() {
    const res = await api.get('/proveedor/listar')
    return res.data
  },

  async obtener(id) {
    const res = await api.get(`/proveedor/${id}`)
    return res.data
  },

  async crear(datos) {
    const res = await api.post('/proveedor/crear', datos)
    return res.data
  },

  async actualizar(id, datos) {
    const res = await api.put(`/proveedor/update/${id}`, datos)
    return res.data
  },

  async eliminar(id) {
    const res = await api.delete(`/proveedor/eliminar/${id}`)
    return res.data
  }
}

export default proveedorService