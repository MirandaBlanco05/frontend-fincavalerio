import { defineStore } from 'pinia'
import { ref } from 'vue'
import clienteService from '../services/cliente.service'

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  async function cargarClientes() {
    cargando.value = true
    limpiarMensajes()
    try {
      const data = await clienteService.listar()
      clientes.value = data
    } catch (err) {
      error.value = err.message || 'Error al cargar clientes'
    } finally {
      cargando.value = false
    }
  }

  async function crearCliente(datos) {
    limpiarMensajes()
    try {
      const data = await clienteService.crear(datos)
      mensaje.value = 'Cliente creado correctamente'
      await cargarClientes()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al crear cliente'
      return { success: false, error: error.value }
    }
  }

  async function actualizarCliente(id, datos) {
    limpiarMensajes()
    try {
      const data = await clienteService.actualizar(id, datos)
      mensaje.value = 'Cliente actualizado correctamente'
      await cargarClientes()
      return { success: true, data }
    } catch (err) {
      error.value = err.message || 'Error al actualizar cliente'
      return { success: false, error: error.value }
    }
  }

  async function eliminarCliente(id) {
    limpiarMensajes()
    try {
      await clienteService.eliminar(id)
      mensaje.value = 'Cliente eliminado correctamente'
      await cargarClientes()
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Error al eliminar cliente'
      return { success: false, error: error.value }
    }
  }

  return {
    clientes,
    cargando,
    error,
    mensaje,
    limpiarMensajes,
    cargarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
  }
})