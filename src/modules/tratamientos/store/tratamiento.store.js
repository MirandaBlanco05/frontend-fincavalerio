import { defineStore } from 'pinia'
import tratamientoService from '../services/tratamiento.service.js'

export const useTratamientoStore = defineStore('tratamiento', {
  state: () => ({
    tratamientos: [],
    tratamientoActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarTratamientos() {
      this.cargando = true
      this.error = null
      try {
        const response = await tratamientoService.listar()
        this.tratamientos = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar tratamientos:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearTratamiento(datos) {
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.crear(datos)
        await this.cargarTratamientos()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al crear tratamiento:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarTratamiento(id, datos) {
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.actualizar(id, datos)
        await this.cargarTratamientos()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al actualizar tratamiento:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarTratamiento(id) {
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.eliminar(id)
        await this.cargarTratamientos()
      } catch (error) {
        this.error = error.message
        console.error('Error al eliminar tratamiento:', error)
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})