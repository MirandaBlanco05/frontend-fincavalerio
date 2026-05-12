import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
import vacunaService from '../services/vacuna.service.js'

export const useVacunaStore = defineStore('vacuna', {
  state: () => ({
    vacunas: [],
    vacunaActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarVacunas() {
      this.cargando = true
      this.error = null
      try {
        const response = await vacunaService.listar()
        this.vacunas = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar vacunas:', error)
      } finally {
        this.cargando = false
      }
    },

    async cargarVacunasPorBovino(id_bovino) {
      this.cargando = true
      this.error = null
      try {
        const response = await vacunaService.listarPorBovino(id_bovino)
        this.vacunas = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar vacunas por bovino:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearVacuna(datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await vacunaService.crear(datos)
        await this.cargarVacunas()
        notification.notify('Vacuna registrada correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al crear vacuna'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarVacuna(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await vacunaService.actualizar(id, datos)
        await this.cargarVacunas()
        notification.notify('Vacuna actualizada correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al actualizar vacuna'
        notification.notify(msg, 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarVacuna(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await vacunaService.eliminar(id)
        await this.cargarVacunas()
        notification.notify('Vacuna eliminada correctamente', 'success')
      } catch (error) {
        const msg = error.message || 'Error al eliminar vacuna'
        notification.notify(msg, 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})