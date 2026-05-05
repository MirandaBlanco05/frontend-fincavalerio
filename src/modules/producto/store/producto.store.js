import { defineStore } from 'pinia'
import { ref } from 'vue'
import productoService from '../services/producto.service'

export const useProductoStore = defineStore('producto', () => {
  const productos = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  async function cargarProductos() {
    cargando.value = true
    limpiarMensajes()
    try {
      const data = await productoService.listar()
      productos.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar productos'
    } finally {
      cargando.value = false
    }
  }

  async function crearProducto(datos) {
    limpiarMensajes()
    try {
      const data = await productoService.crear(datos)
      mensaje.value = 'Producto creado correctamente'
      await cargarProductos()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al crear producto'
      return { success: false, error: error.value }
    }
  }

  async function actualizarProducto(id, datos) {
    limpiarMensajes()
    try {
      const data = await productoService.actualizar(id, datos)
      mensaje.value = 'Producto actualizado correctamente'
      await cargarProductos()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al actualizar producto'
      return { success: false, error: error.value }
    }
  }

  async function eliminarProducto(id) {
    limpiarMensajes()
    try {
      await productoService.eliminar(id)
      mensaje.value = 'Producto eliminado correctamente'
      await cargarProductos()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Error al eliminar producto'
      return { success: false, error: error.value }
    }
  }

  return {
    productos,
    cargando,
    error,
    mensaje,
    limpiarMensajes,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  }
})