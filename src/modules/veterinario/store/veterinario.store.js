import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
import veterinarioService from '../services/veterinario.service.js'

export const useVeterinarioStore = defineStore('veterinario', {
  state: () => ({
    veterinarios: [],
    veterinarioActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarVeterinarios() {
      this.cargando = true
      this.error = null
      try {
        const response = await veterinarioService.listar()
        this.veterinarios = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error al cargar veterinarios:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearVeterinario(datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.crear(datos)
        notification.notify('Veterinario registrado', 'success')
        await this.cargarVeterinarios()
        return true
      } catch (error) {
        notification.notify(error.message || 'Error al crear veterinario', 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarVeterinario(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.actualizar(id, datos)
        notification.notify('Datos actualizados', 'success')
        await this.cargarVeterinarios()
        return true
      } catch (error) {
        notification.notify(error.message || 'Error al actualizar', 'error')
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarVeterinario(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.eliminar(id)
        notification.notify('Veterinario eliminado', 'success')
        await this.cargarVeterinarios()
      } catch (error) {
        notification.notify(error.message || 'Error al eliminar', 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})