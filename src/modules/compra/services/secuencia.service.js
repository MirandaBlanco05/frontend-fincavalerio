import api from '@/core/api/axios.js'

export const secuenciaService = {
  async listar() {
    try {
      const response = await api.get('/ncf/secuencia/listar')
      return response.data
    } catch (error) {
      console.error('Error al listar secuencias NCF:', error)
      throw error
    }
  },

  async obtener(id) {
    try {
      const response = await api.get(`/ncf/secuencia/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener secuencia NCF:', error)
      throw error
    }
  },

  async crear(secuencia) {
    try {
      const response = await api.post('/ncf/secuencia/crear', secuencia)
      return response.data
    } catch (error) {
      console.error('Error al crear secuencia NCF:', error)
      throw error
    }
  },

  async actualizar(id, secuencia) {
    try {
      const response = await api.put(`/ncf/secuencia/actualizar/${id}`, secuencia)
      return response.data
    } catch (error) {
      console.error('Error al actualizar secuencia NCF:', error)
      throw error
    }
  },

  async eliminar(id) {
    try {
      const response = await api.delete(`/ncf/secuencia/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar secuencia NCF:', error)
      throw error
    }
  }
}