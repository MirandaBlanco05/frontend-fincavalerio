import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import clienteService from '../services/cliente.service'

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mensaje = ref(null)
  const notification = useNotificationStore()

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
    try {
      const data = await clienteService.crear(datos)
      notification.notify('Cliente registrado correctamente', 'success')
      await cargarClientes()
      return { success: true, data }
    } catch (err) {
      notification.notify(err.message || 'Error al crear cliente', 'error')
      return { success: false }
    }
  }

  async function actualizarCliente(id, datos) {
    try {
      const data = await clienteService.actualizar(id, datos)
      notification.notify('Cliente actualizado correctamente', 'success')
      await cargarClientes()
      return { success: true, data }
    } catch (err) {
      notification.notify(err.message || 'Error al actualizar cliente', 'error')
      return { success: false }
    }
  }

  async function eliminarCliente(id) {
    try {
      await clienteService.eliminar(id)
      notification.notify('Cliente eliminado', 'success')
      await cargarClientes()
      return { success: true }
    } catch (err) {
      notification.notify(err.message || 'Error al eliminar cliente', 'error')
      return { success: false }
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