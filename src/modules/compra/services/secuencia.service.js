import axios from '@/core/api/axios.js'

export const secuenciaService = {
  async listar() {
    try {
      const response = await axios.get('/comprobante/secuencia/listar')
      return response.data
    } catch (error) {
      console.error('Error al listar secuencias NCF:', error)
      throw error
    }
  },

  async obtener(id) {
    try {
      const response = await axios.get(`/comprobante/secuencia/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener secuencia NCF:', error)
      throw error
    }
  },

  async crear(secuencia) {
    try {
      const response = await axios.post('/comprobante/secuencia/crear', secuencia)
      return response.data
    } catch (error) {
      console.error('Error al crear secuencia NCF:', error)
      throw error
    }
  },

  async actualizar(id, secuencia) {
    try {
      const response = await axios.put(`/comprobante/secuencia/actualizar/${id}`, secuencia)
      return response.data
    } catch (error) {
      console.error('Error al actualizar secuencia NCF:', error)
      throw error
    }
  },

  async eliminar(id) {
    try {
      const response = await axios.delete(`/comprobante/secuencia/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar secuencia NCF:', error)
      throw error
    }
  }
}