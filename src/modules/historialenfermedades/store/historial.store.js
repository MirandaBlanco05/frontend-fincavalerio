import { defineStore } from 'pinia'
import historialService from '../services/historial.service.js'

export const useHistorialStore = defineStore('historial', {
  state: () => ({
    historiales: [],
    historialActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarHistoriales() {
      this.cargando = true
      this.error = null
      try {
        const response = await historialService.listar()
        this.historiales = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar historiales:', error)
      } finally {
        this.cargando = false
      }
    },

    async cargarHistorialesPorBovino(id_bovino) {
      this.cargando = true
      this.error = null
      try {
        const response = await historialService.listarPorBovino(id_bovino)
        this.historiales = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar historiales por bovino:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearHistorial(datos) {
      this.cargando = true
      this.error = null
      try {
        await historialService.crear(datos)
        await this.cargarHistoriales()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al crear historial:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarHistorial(id, datos) {
      this.cargando = true
      this.error = null
      try {
        await historialService.actualizar(id, datos)
        await this.cargarHistoriales()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al actualizar historial:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarHistorial(id) {
      this.cargando = true
      this.error = null
      try {
        await historialService.eliminar(id)
        await this.cargarHistoriales()
      } catch (error) {
        this.error = error.message
        console.error('Error al eliminar historial:', error)
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})