// modules/Embarazo/store/Embarazo.store.js
import { defineStore } from 'pinia'
import embarazoService from '../services/Embarazo.Service.js'

export const useEmbarazoStore = defineStore('embarazo', {
  state: () => ({
    embarazos: [],
    cargando: false,
    error: null
  }),
  actions: {
    async cargarEmbarazos() {
      this.cargando = true
      this.error = null
      try {
        this.embarazos = await embarazoService.listar()
      } catch (err) {
        this.error = 'No se pudieron cargar los embarazos'
      } finally {
        this.cargando = false
      }
    },

    async crearEmbarazo(datos) {
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.crear(datos)
        if (exito) await this.cargarEmbarazos()
        this.cargando = false
        return exito
      } catch(err) {
        this.error = 'No se pudo crear el embarazo'
        this.cargando = false
        throw err
      }
    },

    async actualizarEmbarazo(id, datos) {
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.actualizar(id, datos)
        if (exito) await this.cargarEmbarazos()
        this.cargando = false
        return exito
      } catch(err) {
        this.error = 'No se pudo actualizar el embarazo'
        this.cargando = false
        throw err
      }
    },

    async eliminarEmbarazo(id) {
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.eliminar(id)
        if (exito) await this.cargarEmbarazos()
        this.cargando = false
        return exito
      } catch(err) {
        this.error = 'No se pudo eliminar el embarazo'
        this.cargando = false
        throw err
      }
    }
  }
})
