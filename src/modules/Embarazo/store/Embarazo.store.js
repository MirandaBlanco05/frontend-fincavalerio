// modules/Embarazo/store/Embarazo.store.js
import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/notification.store.js'
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
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.crear(datos)
        if (exito) {
          notification.notify('Embarazo registrado correctamente', 'success')
          await this.cargarEmbarazos()
        }
        this.cargando = false
        return exito
      } catch(err) {
        notification.notify('No se pudo crear el embarazo', 'error')
        this.cargando = false
        throw err
      }
    },

    async actualizarEmbarazo(id, datos) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.actualizar(id, datos)
        if (exito) {
          notification.notify('Embarazo actualizado correctamente', 'success')
          await this.cargarEmbarazos()
        }
        this.cargando = false
        return exito
      } catch(err) {
        notification.notify('No se pudo actualizar el embarazo', 'error')
        this.cargando = false
        throw err
      }
    },

    async eliminarEmbarazo(id) {
      const notification = useNotificationStore()
      this.cargando = true
      this.error = null
      try {
        const exito = await embarazoService.eliminar(id)
        if (exito) {
          notification.notify('Embarazo eliminado correctamente', 'success')
          await this.cargarEmbarazos()
        }
        this.cargando = false
        return exito
      } catch(err) {
        notification.notify('No se pudo eliminar el embarazo', 'error')
        this.cargando = false
        throw err
      }
    }
  }
})
