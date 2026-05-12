// modules/inseminacion/store/inseminacion.store.js
import { defineStore } from 'pinia'
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
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.crear(datos)
      if (exito) await this.cargarInseminaciones()
      else this.error = 'No se pudo crear la inseminación'
      this.cargando = false
      return exito
    },

    async actualizarInseminacion(id, datos) {
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.actualizar(id, datos)
      if (exito) await this.cargarInseminaciones()
      else this.error = 'No se pudo actualizar la inseminación'
      this.cargando = false
      return exito
    },

    async eliminarInseminacion(id) {
      this.cargando = true
      this.error = null
      const exito = await inseminacionService.eliminar(id)
      if (exito) await this.cargarInseminaciones()
      else this.error = 'No se pudo eliminar la inseminación'
      this.cargando = false
      return exito
    }
  }
})