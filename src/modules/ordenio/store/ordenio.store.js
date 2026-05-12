// src/modules/ordenio/store/ordenio.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import { ordenioService } from '@/modules/ordenio/services/ordenio.service.js'

export const useOrdenioStore = defineStore('ordenio', () => {
  const ordenios = ref([])
  const ordenioActual = ref(null)
  const cargando = ref(false)
  const error = ref('')
  const notification = useNotificationStore()

  async function cargarOrdenios() {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ordenioService.listar()
      ordenios.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar ordeños'
      console.error('Error cargando ordeños:', e)
    } finally {
      cargando.value = false
    }
  }

  async function obtenerOrdenio(id) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ordenioService.obtener(id)
      ordenioActual.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al obtener ordeño'
      console.error('Error obteniendo ordeño:', e)
    } finally {
      cargando.value = false
    }
  }

  async function crearOrdenio(datos) {
    cargando.value = true
    error.value = ''
    try {
      await ordenioService.crear(datos)
      notification.notify('Ordeño registrado correctamente', 'success')
      await cargarOrdenios()
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear ordeño'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  async function actualizarOrdenio(id, datos) {
    cargando.value = true
    error.value = ''
    try {
      await ordenioService.actualizar(id, datos)
      notification.notify('Ordeño actualizado correctamente', 'success')
      await cargarOrdenios()
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al actualizar ordeño'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  async function eliminarOrdenio(id) {
    cargando.value = true
    error.value = ''
    try {
      await ordenioService.eliminar(id)
      notification.notify('Ordeño eliminado', 'success')
      await cargarOrdenios()
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar ordeño'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  return {
    ordenios,
    ordenioActual,
    cargando,
    error,
    cargarOrdenios,
    obtenerOrdenio,
    crearOrdenio,
    actualizarOrdenio,
    eliminarOrdenio
  }
})