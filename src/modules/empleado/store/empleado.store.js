// src/modules/empleado/store/empleado.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { empleadoService } from '@/modules/empleado/services/empleado.service.js'

export const useEmpleadoStore = defineStore('empleado', () => {
  const empleados = ref([])
  const empleadoActual = ref(null)
  const cargando = ref(false)
  const error = ref('')

  async function cargarEmpleados() {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await empleadoService.listar()
      empleados.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar empleados'
      console.error('Error cargando empleados:', e)
    } finally {
      cargando.value = false
    }
  }

  async function obtenerEmpleado(id) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await empleadoService.obtener(id)
      empleadoActual.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al obtener empleado'
      console.error('Error obteniendo empleado:', e)
    } finally {
      cargando.value = false
    }
  }

  async function crearEmpleado(datos) {
    cargando.value = true
    error.value = ''
    try {
      await empleadoService.crear(datos)
      await cargarEmpleados()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear empleado'
      console.error('Error creando empleado:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function actualizarEmpleado(id, datos) {
    cargando.value = true
    error.value = ''
    try {
      await empleadoService.actualizar(id, datos)
      await cargarEmpleados()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al actualizar empleado'
      console.error('Error actualizando empleado:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function eliminarEmpleado(id) {
    cargando.value = true
    error.value = ''
    try {
      await empleadoService.eliminar(id)
      await cargarEmpleados()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar empleado'
      console.error('Error eliminando empleado:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  return {
    empleados,
    empleadoActual,
    cargando,
    error,
    cargarEmpleados,
    obtenerEmpleado,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
  }
})