import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import proveedorService from '../services/proveedor.service'

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)
  const notification = useNotificationStore()

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  async function cargarProveedores() {
    cargando.value = true
    limpiarMensajes()
    try {
      const data = await proveedorService.listar()
      proveedores.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar proveedores'
    } finally {
      cargando.value = false
    }
  }

  async function crearProveedor(datos) {
    limpiarMensajes()
    try {
      const data = await proveedorService.crear(datos)
      notification.notify('Proveedor registrado', 'success')
      await cargarProveedores()
      return { success: true, data }
    } catch (err) {
      const msg = err.message || 'Error al crear proveedor'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  async function actualizarProveedor(id, datos) {
    limpiarMensajes()
    try {
      const data = await proveedorService.actualizar(id, datos)
      notification.notify('Proveedor actualizado', 'success')
      await cargarProveedores()
      return { success: true, data }
    } catch (err) {
      const msg = err.message || 'Error al actualizar proveedor'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  async function eliminarProveedor(id) {
    limpiarMensajes()
    try {
      await proveedorService.eliminar(id)
      notification.notify('Proveedor eliminado', 'success')
      await cargarProveedores()
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Error al eliminar proveedor'
      notification.notify(msg, 'error')
      return { success: false, error: msg }
    }
  }

  return {
    proveedores,
    cargando,
    error,
    mensaje,
    limpiarMensajes,
    cargarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
  }
})