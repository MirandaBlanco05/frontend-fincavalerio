import { defineStore } from 'pinia'
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
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        const response = await celoService.crear(datos)
        await this.cargarCiclos()
        this.mensaje = 'Ciclo creado correctamente'
        setTimeout(() => { this.mensaje = null }, 3000)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.mensaje || 'Error al crear ciclo'
        console.error('Error al crear ciclo:', error)
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    async actualizarCiclo(id, datos) {
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        const response = await celoService.actualizar(id, datos)
        await this.cargarCiclos()
        this.mensaje = 'Ciclo actualizado correctamente'
        setTimeout(() => { this.mensaje = null }, 3000)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.mensaje || 'Error al actualizar ciclo'
        console.error('Error al actualizar ciclo:', error)
        return { success: false }
      } finally {
        this.cargando = false
      }
    },

    async eliminarCiclo(id) {
      this.cargando = true
      this.error = null
      this.mensaje = null
      try {
        await celoService.eliminar(id)
        await this.cargarCiclos()
        this.mensaje = 'Ciclo eliminado correctamente'
        setTimeout(() => { this.mensaje = null }, 3000)
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.mensaje || 'Error al eliminar ciclo'
        console.error('Error al eliminar ciclo:', error)
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