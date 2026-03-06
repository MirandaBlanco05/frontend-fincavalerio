// src/modules/celo/store/celo.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { celoService } from '@/modules/celo/services/celo.service.js'

export const useCeloStore = defineStore('celo', () => {
  const ciclos = ref([])
  const cicloActual = ref(null)
  const cargando = ref(false)
  const error = ref('')

  async function cargarCiclos() {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await celoService.listar()
      ciclos.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar ciclos'
      console.error('Error cargando ciclos:', e)
    } finally {
      cargando.value = false
    }
  }

  async function obtenerCiclo(id) {
    cargando.value = true
    error.value = ''
    try {
      const { data } = await celoService.obtener(id)
      cicloActual.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al obtener ciclo'
      console.error('Error obteniendo ciclo:', e)
    } finally {
      cargando.value = false
    }
  }

  async function crearCiclo(datos) {
    cargando.value = true
    error.value = ''
    try {
      await celoService.crear(datos)
      await cargarCiclos()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear ciclo'
      console.error('Error creando ciclo:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function actualizarCiclo(id, datos) {
    cargando.value = true
    error.value = ''
    try {
      await celoService.actualizar(id, datos)
      await cargarCiclos()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al actualizar ciclo'
      console.error('Error actualizando ciclo:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function eliminarCiclo(id) {
    cargando.value = true
    error.value = ''
    try {
      await celoService.eliminar(id)
      await cargarCiclos()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar ciclo'
      console.error('Error eliminando ciclo:', e)
      return false
    } finally {
      cargando.value = false
    }
  }

  return {
    ciclos,
    cicloActual,
    cargando,
    error,
    cargarCiclos,
    obtenerCiclo,
    crearCiclo,
    actualizarCiclo,
    eliminarCiclo
  }
})