import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import insumoService from '../services/insumo.service'

export const useInsumoStore = defineStore('insumo', () => {
  const insumos = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)
  const notification = useNotificationStore()

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  async function cargarInsumos() {
    cargando.value = true
    limpiarMensajes()
    try {
      const data = await insumoService.listar()
      insumos.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar insumos'
    } finally {
      cargando.value = false
    }
  }

  async function crearInsumo(datos) {
    limpiarMensajes()
    try {
      const data = await insumoService.crear(datos)
      notification.notify('Insumo registrado correctamente', 'success')
      await cargarInsumos()
      return { success: true, data }
    } catch (err) {
      const msg = err.message || 'Error al crear insumo'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  async function actualizarInsumo(id, datos) {
    limpiarMensajes()
    if (!id) {
      error.value = 'ID de insumo no proporcionado'
      return { success: false, error: error.value }
    }
    try {
      const data = await insumoService.actualizar(id, datos)
      notification.notify('Insumo actualizado correctamente', 'success')
      await cargarInsumos()
      return { success: true, data }
    } catch (err) {
      const msg = err.message || 'Error al actualizar insumo'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  async function eliminarInsumo(id) {
    limpiarMensajes()
    try {
      await insumoService.eliminar(id)
      notification.notify('Insumo eliminado correctamente', 'success')
      await cargarInsumos()
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Error al eliminar insumo'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  return {
    insumos,
    cargando,
    error,
    mensaje,
    limpiarMensajes,
    cargarInsumos,
    crearInsumo,
    actualizarInsumo,
    eliminarInsumo
  }
})
