import { defineStore } from 'pinia'
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
      this.cargando = true
      this.error = null
      try {
        await vacunaService.crear(datos)
        await this.cargarVacunas()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al crear vacuna:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarVacuna(id, datos) {
      this.cargando = true
      this.error = null
      try {
        await vacunaService.actualizar(id, datos)
        await this.cargarVacunas()
        return true
      } catch (error) {
        this.error = error.message
        console.error('Error al actualizar vacuna:', error)
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarVacuna(id) {
      this.cargando = true
      this.error = null
      try {
        await vacunaService.eliminar(id)
        await this.cargarVacunas()
      } catch (error) {
        this.error = error.message
        console.error('Error al eliminar vacuna:', error)
        throw error
      } finally {
        this.cargando = false
      }
    }
  }
})