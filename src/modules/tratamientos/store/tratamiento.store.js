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
        notification.notify('Tratamiento registrado correctamente', 'success')
        await this.cargarTratamientos()
        return true
      } catch (error) {
        notification.notify(error.message || 'Error al crear tratamiento', 'error')
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
        notification.notify('Datos actualizados correctamente', 'success')
        await this.cargarTratamientos()
        return true
      } catch (error) {
        notification.notify(error.message || 'Error al actualizar tratamiento', 'error')
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
        notification.notify('Tratamiento eliminado', 'success')
        await this.cargarTratamientos()
      } catch (error) {
        notification.notify(error.message || 'Error al eliminar tratamiento', 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})