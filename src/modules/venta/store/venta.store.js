// src/modules/venta/store/venta.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import { ventaService } from '@/modules/venta/services/venta.service.js'

export const useVentaStore = defineStore('venta', () => {
  const ventas = ref([])
  const ventaActual = ref(null)
  const cargando = ref(false)
  const error = ref('')
  const notification = useNotificationStore()

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
      notification.notify(data.mensaje || 'Venta registrada correctamente', 'success')
      await cargarVentas() // Recargar lista
      return { success: true, data }
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear venta'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    } finally {
      cargando.value = false
    }
  }

  async function actualizarVenta(id, venta) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await ventaService.actualizar(id, venta)
      notification.notify(data.mensaje || 'Venta actualizada correctamente', 'success')
      await cargarVentas()
      return { success: true, data }
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al actualizar venta'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    } finally {
      cargando.value = false
    }
  }

  async function eliminarVenta(id) {
    cargando.value = true
    error.value = ''
    try {
      await ventaService.eliminar(id)
      notification.notify('Venta eliminada correctamente', 'success')
      await cargarVentas()
      return { success: true }
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar venta'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
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