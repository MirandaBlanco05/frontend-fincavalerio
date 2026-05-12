import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import productoService from '../services/producto.service'

export const useProductoStore = defineStore('producto', () => {
  const productos = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)
  const notification = useNotificationStore()

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
    try {
      const data = await productoService.crear(datos)
      notification.notify('Producto registrado correctamente', 'success')
      await cargarProductos()
      return { success: true, data }
    } catch (err) {
      notification.notify(err.message || 'Error al crear producto', 'error')
      return { success: false }
    }
  }

  async function actualizarProducto(id, datos) {
    try {
      const data = await productoService.actualizar(id, datos)
      notification.notify('Producto actualizado correctamente', 'success')
      await cargarProductos()
      return { success: true, data }
    } catch (err) {
      notification.notify(err.message || 'Error al actualizar producto', 'error')
      return { success: false }
    }
  }

  async function eliminarProducto(id) {
    try {
      await productoService.eliminar(id)
      notification.notify('Producto eliminado', 'success')
      await cargarProductos()
      return { success: true }
    } catch (err) {
      notification.notify(err.message || 'Error al eliminar producto', 'error')
      return { success: false }
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