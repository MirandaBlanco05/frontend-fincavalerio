// src/modules/produccion/store/produccion.store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { produccionService } from '../services/produccion.service.js'

export const useProduccionStore = defineStore('produccion', () => {

  // ── Estado ────────────────────────────────
  const nacimientos = ref([])
  const ingresos    = ref([])
  const gastos      = ref([])
  const ventas      = ref([])
  const resumen     = ref(null)
  const cargando    = ref(false)
  const error       = ref(null)
  const mensaje     = ref(null)

  // ── Cargar datos ──────────────────────────
  async function cargar(fn, destino) {
    cargando.value = true
    error.value = null
    try {
      const { data } = await fn()
      destino.value = data
    } catch (e) {
      // Si el endpoint no existe aún, simplemente deja vacío
      console.warn('Endpoint no disponible:', e.message)
      destino.value = []
    } finally {
      cargando.value = false
    }
  }

  const cargarNacimientos = () => cargar(produccionService.listarNacimientos, nacimientos)
  const cargarIngresos    = () => cargar(produccionService.listarIngresos,    ingresos)
  const cargarGastos      = () => cargar(produccionService.listarGastos,      gastos)
  const cargarVentas      = () => cargar(produccionService.listarVentas,      ventas)

  // ── Crear registros ───────────────────────
  async function crear(fn, payload) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await fn(payload)
      mensaje.value = data.mensaje || 'Guardado correctamente'
      return true
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al guardar'
      return false
    } finally {
      cargando.value = false
    }
  }

  const crearNacimiento = (d) => crear(produccionService.crearNacimiento, d)
  const crearIngreso    = (d) => crear(produccionService.crearIngreso,    d)
  const crearGasto      = (d) => crear(produccionService.crearGasto,      d)
  const crearVenta      = (d) => crear(produccionService.crearVenta,      d)

  function limpiarMensajes() { error.value = null; mensaje.value = null }

  return {
    nacimientos, ingresos, gastos, ventas, resumen,
    cargando, error, mensaje,
    cargarNacimientos, cargarIngresos, cargarGastos, cargarVentas,
    crearNacimiento, crearIngreso, crearGasto, crearVenta,
    limpiarMensajes
  }
})