import axios from '@/core/api/axios.js'

export const proveedorService = {
  async listar() {
    try {
      const response = await axios.get('/proveedor/listar')
      return response.data
    } catch (error) {
      console.error('Error al listar proveedores:', error)
      throw error
    }
  },

  async obtener(id) {
    try {
      const response = await axios.get(`/proveedor/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener proveedor:', error)
      throw error
    }
  },

  async crear(proveedor) {
    try {
      const response = await axios.post('/proveedor/crear', proveedor)
      return response.data
    } catch (error) {
      console.error('Error al crear proveedor:', error)
      throw error
    }
  },

  async actualizar(id, proveedor) {
    try {
      const response = await axios.put(`/proveedor/update/${id}`, proveedor)
      return response.data
    } catch (error) {
      console.error('Error al actualizar proveedor:', error)
      throw error
    }
  },

  async eliminar(id) {
    try {
      const response = await axios.delete(`/proveedor/eliminar/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      throw error
    }
  }
}