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
        const exito = await partoService.crear(datos)
        if (exito) await this.cargarPartos()
        this.cargando = false
        return exito
      } catch(err) {
        this.error = 'No se pudo crear el parto'
        this.cargando = false
        throw err
      }
    }
  }
})
