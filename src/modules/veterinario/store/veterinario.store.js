import { defineStore } from 'pinia'
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
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.crear(datos)
        await this.cargarVeterinarios()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al crear veterinario:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarVeterinario(id, datos) {
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.actualizar(id, datos)
        await this.cargarVeterinarios()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al actualizar veterinario:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarVeterinario(id) {
      this.cargando = true
      this.error = null
      try {
        await veterinarioService.eliminar(id)
        await this.cargarVeterinarios()
      } catch (error) {
        this.error = error.message
        console.error('Error al eliminar veterinario:', error)
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})