// src/modules/ordenio/store/ordenio.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ordenioService } from '@/modules/ordenio/services/ordenio.service.js'

export const useOrdenioStore = defineStore('ordenio', () => {
  const ordenios = ref([])
  const ordenioActual = ref(null)
  const cargando = ref(false)
  const error = ref('')

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
      await cargarOrdenios()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear ordeño'
      console.error('Error creando ordeño:', e)
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
      await cargarOrdenios()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al actualizar ordeño'
      console.error('Error actualizando ordeño:', e)
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
      await cargarOrdenios()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar ordeño'
      console.error('Error eliminando ordeño:', e)
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