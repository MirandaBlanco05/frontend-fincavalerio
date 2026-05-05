import { defineStore } from 'pinia'
import { ref } from 'vue'
import insumoService from '../services/insumo.service'

export const useInsumoStore = defineStore('insumo', () => {
  const insumos = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)

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
      mensaje.value = 'Insumo creado correctamente'
      await cargarInsumos()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al crear insumo'
      return { success: false, error: error.value }
    }
  }

  async function actualizarInsumo(id, datos) {
    limpiarMensajes()
    try {
      const data = await insumoService.actualizar(id, datos)
      mensaje.value = 'Insumo actualizado correctamente'
      await cargarInsumos()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al actualizar insumo'
      return { success: false, error: error.value }
    }
  }

  async function eliminarInsumo(id) {
    limpiarMensajes()
    try {
      await insumoService.eliminar(id)
      mensaje.value = 'Insumo eliminado correctamente'
      await cargarInsumos()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Error al eliminar insumo'
      return { success: false, error: error.value }
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
