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
        await this.cargarVeterinarios()
        notification.notify('Veterinario registrado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al crear veterinario'
        notification.notify(msg, 'error')
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
        await this.cargarVeterinarios()
        notification.notify('Veterinario actualizado correctamente', 'success')
        return true
      } catch (error) {
        const msg = error.message || 'Error al actualizar veterinario'
        notification.notify(msg, 'error')
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
        await this.cargarVeterinarios()
        notification.notify('Veterinario eliminado correctamente', 'success')
      } catch (error) {
        const msg = error.message || 'Error al eliminar veterinario'
        notification.notify(msg, 'error')
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})