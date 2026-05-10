import api from '@/core/api/axios.js'

export const proveedorService = {
  async listar() {
    try {
      const response = await api.get('/proveedor/listar')
      return response.data
    } catch (error) {
      console.error('Error al listar proveedores:', error)
      throw error
    }
  },

  async obtener(id) {
    try {
      const response = await api.get(`/proveedor/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener proveedor:', error)
      throw error
    }
  },

  async crear(proveedor) {
    try {
      const response = await api.post('/proveedor/crear', proveedor)
      return response.data
    } catch (error) {
      console.error('Error al crear proveedor:', error)
      throw error
    }
  },

  async actualizar(id, proveedor) {
    try {
      const response = await api.put(`/proveedor/update/${id}`, proveedor)
      return response.data
    } catch (error) {
      console.error('Error al actualizar proveedor:', error)
      throw error
    }
  },

  async eliminar(id) {
    try {
      const response = await api.delete(`/proveedor/eliminar/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      throw error
    }
  }
}