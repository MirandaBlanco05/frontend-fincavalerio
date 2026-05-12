// modules/inseminacion/store/inseminacion.store.js
import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
import inseminacionService from '../services/inseminacion.service.js'

export const useInseminacionStore = defineStore('inseminacion', {
  state: () => ({
    inseminaciones: [],
    cargando: false,
    error: null
  }),
  actions: {
    async cargarInseminaciones() {
      this.cargando = true
      this.error = null
      try {
        this.inseminaciones = await inseminacionService.listar()
      } catch (err) {
        this.error = 'No se pudieron cargar las inseminaciones'
      } finally {
        this.cargando = false
      }
    },

    async crearInseminacion(datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.crear(datos)
      if (exito) {
        notification.notify('Inseminación registrada', 'success')
        await this.cargarInseminaciones()
      } else {
        notification.notify('No se pudo crear la inseminación', 'error')
      }
      this.cargando = false
      return exito
    },

    async actualizarInseminacion(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.actualizar(id, datos)
      if (exito) {
        notification.notify('Inseminación actualizada', 'success')
        await this.cargarInseminaciones()
      } else {
        notification.notify('No se pudo actualizar la inseminación', 'error')
      }
      this.cargando = false
      return exito
    },

    async eliminarInseminacion(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.eliminar(id)
      if (exito) {
        notification.notify('Inseminación eliminada', 'success')
        await this.cargarInseminaciones()
      } else {
        notification.notify('No se pudo eliminar la inseminación', 'error')
      }
      this.cargando = false
      return exito
    }
  }
})