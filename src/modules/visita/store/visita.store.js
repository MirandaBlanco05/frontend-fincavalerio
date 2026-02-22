// src/modules/visita/store/visita.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visitaService } from '../services/visita.service.js'

export const useVisitaStore = defineStore('visita', () => {

  // ── Estado ────────────────────────────────────────────
  const visitas        = ref([])
  const veterinarios   = ref([])
  const bovinos        = ref([])
  const motivos        = ref([])
  const cargando       = ref(false)
  const error          = ref(null)
  const mensaje        = ref(null)

  // ── Cargar visitas ────────────────────────────────────
  async function cargarVisitas() {
    cargando.value = true
    error.value = null
    try {
      const { data } = await visitaService.listar()
      visitas.value = data
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar visitas'
    } finally {
      cargando.value = false
    }
  }

  // ── Cargar catálogos (vets, bovinos, motivos) ─────────
  async function cargarCatalogos() {
    try {
      const [resVets, resBov, resMot] = await Promise.allSettled([
        visitaService.listarVeterinarios(),
        visitaService.listarBovinos(),
        visitaService.listarMotivos()
      ])
      if (resVets.status === 'fulfilled') veterinarios.value = resVets.value.data
      if (resBov.status  === 'fulfilled') bovinos.value      = resBov.value.data
      if (resMot.status  === 'fulfilled') motivos.value      = resMot.value.data
    } catch (e) {
      console.warn('Error cargando catálogos:', e)
    }
  }

  // ── Crear visita ──────────────────────────────────────
  async function crearVisita(datos) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await visitaService.crear(datos)
      mensaje.value = data.mensaje
      await cargarVisitas()
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al crear la visita'
      return false
    } finally {
      cargando.value = false
    }
  }

  // ── Eliminar visita ───────────────────────────────────
  async function eliminarVisita(id) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await visitaService.eliminar(id)
      visitas.value = visitas.value.filter(v => v.Id_visita !== id)
      mensaje.value = data.mensaje
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al eliminar la visita'
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
    visitas, veterinarios, bovinos, motivos,
    cargando, error, mensaje,
    cargarVisitas, cargarCatalogos,
    crearVisita, eliminarVisita,
    limpiarMensajes
  }
})