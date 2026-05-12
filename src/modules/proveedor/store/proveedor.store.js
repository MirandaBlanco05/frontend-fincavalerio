import { defineStore } from 'pinia'
import { ref } from 'vue'
import proveedorService from '../services/proveedor.service'

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)

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
      mensaje.value = 'Proveedor creado correctamente'
      await cargarProveedores()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al crear proveedor'
      return { success: false, error: error.value }
    }
  }

  async function actualizarProveedor(id, datos) {
    limpiarMensajes()
    try {
      const data = await proveedorService.actualizar(id, datos)
      mensaje.value = 'Proveedor actualizado correctamente'
      await cargarProveedores()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al actualizar proveedor'
      return { success: false, error: error.value }
    }
  }

  async function eliminarProveedor(id) {
    limpiarMensajes()
    try {
      await proveedorService.eliminar(id)
      mensaje.value = 'Proveedor eliminado correctamente'
      await cargarProveedores()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Error al eliminar proveedor'
      return { success: false, error: error.value }
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