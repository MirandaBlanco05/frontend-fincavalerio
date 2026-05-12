import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
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
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await historialService.crear(datos)
        await this.cargarHistoriales()
        notification.notify('Historial registrado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al crear historial'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarHistorial(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await historialService.actualizar(id, datos)
        await this.cargarHistoriales()
        notification.notify('Historial actualizado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al actualizar historial'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarHistorial(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await historialService.eliminar(id)
        await this.cargarHistoriales()
        notification.notify('Historial eliminado correctamente', 'success')
      } catch (error) {
        const msg = error.message || 'Error al eliminar historial'
        notification.notify(msg, 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})