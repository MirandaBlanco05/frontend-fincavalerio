import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
import celoService from '../services/celo.service.js'

export const useCeloStore = defineStore('celo', {
  state: () => ({
    ciclos: [],
    cargando: false,
    error: null,
    mensaje: null
  }),

  actions: {
    async cargarCiclos() {
      this.cargando = true
      this.error = null
      try {
        const response = await celoService.listar()
        this.ciclos = response.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.mensaje || 'Error al cargar ciclos'
        console.error('Error al cargar ciclos:', error)
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    async crearCiclo(datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        const response = await celoService.crear(datos)
        await this.cargarCiclos()
        notification.notify('Ciclo de celo registrado', 'success')
        return { success: true, data: response.data }
      } catch (error) {
        const msg = error.response?.data?.mensaje || 'Error al crear ciclo'
        notification.notify(msg, 'error')
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    async actualizarCiclo(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        const response = await celoService.actualizar(id, datos)
        await this.cargarCiclos()
        notification.notify('Ciclo actualizado correctamente', 'success')
        return { success: true, data: response.data }
      } catch (error) {
        const msg = error.response?.data?.mensaje || 'Error al actualizar ciclo'
        notification.notify(msg, 'error')
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    async eliminarCiclo(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        await celoService.eliminar(id)
        await this.cargarCiclos()
        notification.notify('Ciclo eliminado correctamente', 'success')
        return { success: true }
      } catch (error) {
        const msg = error.response?.data?.mensaje || 'Error al eliminar ciclo'
        notification.notify(msg, 'error')
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    limpiarMensajes() {
      this.error = null
      this.mensaje = null
    }
  }
})