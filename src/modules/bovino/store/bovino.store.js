// src/modules/bovino/store/bovino.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bovinoService } from '../services/bovino.service.js'

export const useBovinoStore = defineStore('bovino', () => {

  // ── Estado ────────────────────────────────────────
  const bovinos   = ref([])
  const cargando  = ref(false)
  const error     = ref(null)
  const mensaje   = ref(null)

  // ── Acciones ──────────────────────────────────────

  async function cargarBovinos() {
    cargando.value = true
    error.value = null
    try {
      const { data } = await bovinoService.listar()
      bovinos.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar bovinos'
    } finally {
      cargando.value = false
    }
  }

  async function crearBovino(datos) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await bovinoService.crear(datos)
      bovinos.value.push(data.bovino)
      mensaje.value = data.mensaje
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear bovino'
      return false
    } finally {
      cargando.value = false
    }
  }

  async function actualizarBovino(id, datos) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await bovinoService.actualizar(id, datos)
      const idx = bovinos.value.findIndex(b => b.id_bovino === id)
      if (idx !== -1) bovinos.value[idx] = data.bovino
      mensaje.value = data.message
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al actualizar bovino'
      return false
    } finally {
      cargando.value = false
    }
  }

  async function eliminarBovino(id) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await bovinoService.eliminar(id)
      bovinos.value = bovinos.value.filter(b => b.id_bovino !== id)
      mensaje.value = data.message
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar bovino'
      return false
    } finally {
      cargando.value = false
    }
  }

  function limpiarMensajes() {
    error.value = null
    mensaje.value = null
  }

  return {
    bovinos,
    cargando,
    error,
    mensaje,
    cargarBovinos,
    crearBovino,
    actualizarBovino,
    eliminarBovino,
    limpiarMensajes
  }
})