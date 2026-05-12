import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
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
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.crear(datos)
        await this.cargarTratamientos()
        notification.notify('Tratamiento registrado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al crear tratamiento'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarTratamiento(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.actualizar(id, datos)
        await this.cargarTratamientos()
        notification.notify('Tratamiento actualizado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al actualizar tratamiento'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarTratamiento(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await tratamientoService.eliminar(id)
        await this.cargarTratamientos()
        notification.notify('Tratamiento eliminado correctamente', 'success')
      } catch (error) {
        const msg = error.message || 'Error al eliminar tratamiento'
        notification.notify(msg, 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})