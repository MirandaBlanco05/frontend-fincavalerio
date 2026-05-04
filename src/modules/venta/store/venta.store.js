// src/modules/venta/store/venta.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ventaService } from '@/modules/venta/services/venta.service.js'

export const useVentaStore = defineStore('venta', () => {
  const ventas = ref([])
  const ventaActual = ref(null)
  const cargando = ref(false)
  const error = ref('')

  async function cargarVentas() {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ventaService.listar()
      ventas.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar ventas'
      console.error('Error cargar ventas:', e)
    } finally {
      cargando.value = false
    }
  }

  async function obtenerVenta(id) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ventaService.obtener(id)
      ventaActual.value = data
      return data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al obtener venta'
      console.error('Error obtener venta:', e)
      return null
    } finally {
      cargando.value = false
    }
  }

  async function crearVenta(venta) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ventaService.crear(venta)
      await cargarVentas() // Recargar lista
      return { success: true, data }
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear venta'
      console.error('Error crear venta:', e)
      return { success: false, error: error.value }
    } finally {
      cargando.value = false
    }
  }

  async function actualizarVenta(id, venta) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ventaService.actualizar(id, venta)
      await cargarVentas()
      return { success: true, data }
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al actualizar venta'
      console.error('Error actualizar venta:', e)
      return { success: false, error: error.value }
    } finally {
      cargando.value = false
    }
  }

  async function eliminarVenta(id) {
    cargando.value = true
    error.value = ''
    try {
      await ventaService.eliminar(id)
      await cargarVentas()
      return { success: true }
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar venta'
      console.error('Error eliminar venta:', e)
      return { success: false, error: error.value }
    } finally {
      cargando.value = false
    }
  }

  return {
    ventas,
    ventaActual,
    cargando,
    error,
    cargarVentas,
    obtenerVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta
  }
})