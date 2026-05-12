// src/modules/bovino/store/bovino.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bovinoService } from '../services/bovino.service.js'
import { useNotificationStore } from '@/store/notification.store.js'
import grupoService from '../services/grupo.service.js'
import razaService from '../services/raza.service.js'

export const useBovinoStore = defineStore('bovino', () => {

  // ── Estado ────────────────────────────────────────
  const bovinos   = ref([])
  const grupos    = ref([])
  const razas     = ref([])
  const cargando  = ref(false)
  const error     = ref(null)
  const mensaje   = ref(null)
  const notification = useNotificationStore()

  // ── Acciones ──────────────────────────────────────

  async function cargarGruposyRazas() {
    try {
      const [gRes, rRes] = await Promise.all([
        grupoService.listar(),
        razaService.listar()
      ])
      grupos.value = gRes.data
      razas.value = rRes.data
    } catch (e) {
      console.error('Error cargando grupos/razas:', e)
    }
  }

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
      const response = await bovinoService.crear(datos)
      notification.notify('Animal registrado correctamente', 'success')
      await cargarBovinos()
      return { success: true, data: response.data }
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear bovino'
      notification.notify(msg, 'error')
      return { success: false }
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
      notification.notify(data.message || 'Animal actualizado correctamente', 'success')
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al actualizar bovino'
      notification.notify(msg, 'error')
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
      await bovinoService.eliminar(id)
      notification.notify('Animal eliminado', 'success')
      await cargarBovinos()
      return { success: true }
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar bovino'
      notification.notify(msg, 'error')
      return { success: false }
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
    grupos,
    razas,
    cargando,
    error,
    mensaje,
    cargarGruposyRazas,
    cargarBovinos,
    crearBovino,
    actualizarBovino,
    eliminarBovino,
    limpiarMensajes
  }
})