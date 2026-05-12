import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
import partoService from '../services/Parto.service.js'

export const usePartoStore = defineStore('parto', {
  state: () => ({
    partos: [],
    cargando: false,
    error: null
  }),
  actions: {
    async cargarPartos() {
      this.cargando = true
      this.error = null
      try {
        this.partos = await partoService.listar()
      } catch (err) {
        this.error = 'No se pudieron cargar los partos'
      } finally {
        this.cargando = false
      }
    },

    async crearParto(datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.crear(datos)
        if (res) {
          notification.notify('Parto registrado correctamente', 'success')
          await this.cargarPartos()
        }
        return true
      } catch(err) {
        notification.notify('No se pudo crear el parto', 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarParto(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.actualizar(id, datos)
        if (res) {
          notification.notify('Parto actualizado correctamente', 'success')
          await this.cargarPartos()
        }
        return true
      } catch(err) {
        notification.notify('No se pudo actualizar el parto', 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarParto(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.eliminar(id)
        if (res) {
          notification.notify('Parto eliminado', 'success')
          await this.cargarPartos()
        }
        return true
      } catch(err) {
        notification.notify('No se pudo eliminar el parto', 'error')
        return false
      } finally {
        this.cargando = false
      }
    }
  }
})
