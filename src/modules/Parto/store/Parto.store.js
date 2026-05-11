import { defineStore } from 'pinia'
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
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.crear(datos)
        if (res) await this.cargarPartos()
        return true
      } catch(err) {
        this.error = 'No se pudo crear el parto'
        return false
      } finally {
        this.cargando = false
      }
    },

    async actualizarParto(id, datos) {
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.actualizar(id, datos)
        if (res) await this.cargarPartos()
        return true
      } catch(err) {
        this.error = 'No se pudo actualizar el parto'
        return false
      } finally {
        this.cargando = false
      }
    },

    async eliminarParto(id) {
      this.cargando = true
      this.error = null
      try {
        const res = await partoService.eliminar(id)
        if (res) await this.cargarPartos()
        return true
      } catch(err) {
        this.error = 'No se pudo eliminar el parto'
        return false
      } finally {
        this.cargando = false
      }
    }
  }
})
