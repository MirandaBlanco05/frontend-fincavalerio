import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import { produccionService } from '../services/produccion.service.js'

export const useProduccionStore = defineStore('produccion', () => {

  // ── Estado CRUD ───────────────────────────────────────
  const nacimientos = ref([])
  const ingresos    = ref([])
  const gastos      = ref([])
  const ventas      = ref([])
  const producciones = ref([])
  const resumen     = ref(null)
  const cargando    = ref(false)
  const error       = ref(null)
  const mensaje     = ref(null)
  const notification = useNotificationStore()

  // ── Estado Dashboard ──────────────────────────────────
  const dashPrincipal    = ref(null)
  const dashGastos       = ref(null)
  const dashIngresos     = ref(null)
  const dashNacimientos  = ref(null)
  const dashReproduccion = ref(null)
  const dashLeche        = ref(null)

  // ── Helper CRUD (listas) ──────────────────────────────
  async function cargar(fn, destino) {
    cargando.value = true
    error.value = null
    try {
      const { data } = await fn()
      destino.value = data
    } catch (e) {
      console.warn('Endpoint no disponible:', e.message)
      destino.value = []
    } finally {
      cargando.value = false
    }
  }

  // ── Helper Dashboard (objetos, sin sobreescribir con []) ─
  async function cargarDash(fn, destino) {
    try {
      const { data } = await fn()
      destino.value = data
    } catch (e) {
      console.warn('Dashboard endpoint no disponible:', e.message)
      destino.value = null
    }
  }

  // ── Loaders CRUD ──────────────────────────────────────
  const cargarNacimientos = () => cargar(produccionService.listarNacimientos, nacimientos)
  const cargarIngresos    = () => cargar(produccionService.listarIngresos,    ingresos)
  const cargarGastos      = () => cargar(produccionService.listarGastos,      gastos)
  const cargarVentas      = () => cargar(produccionService.listarVentas,      ventas)

  // ── Loaders Dashboard ─────────────────────────────────
  const cargarDashPrincipal    = () => cargarDash(produccionService.dashboardPrincipal,    dashPrincipal)
  const cargarDashGastos       = () => cargarDash(produccionService.dashboardGastos,       dashGastos)
  const cargarDashIngresos     = () => cargarDash(produccionService.dashboardIngresos,     dashIngresos)
  const cargarDashNacimientos  = () => cargarDash(produccionService.dashboardNacimientos,  dashNacimientos)
  const cargarDashReproduccion = () => cargarDash(produccionService.dashboardReproduccion, dashReproduccion)
  const cargarDashLeche        = () => cargarDash(produccionService.dashboardLeche,        dashLeche)

  // ── Crear registros ───────────────────────────────────
  async function crear(fn, payload) {
    cargando.value = true
    error.value = null
    mensaje.value = null
    try {
      const { data } = await fn(payload)
      notification.notify(data.mensaje || 'Registro guardado correctamente', 'success')
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al guardar registro'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  const crearNacimiento = (d) => crear(produccionService.crearNacimiento, d)
  const crearGasto      = (d) => crear(produccionService.crearGasto,      d)
  const crearVenta      = (d) => crear(produccionService.crearVenta,      d)

  function limpiarMensajes() { error.value = null; mensaje.value = null }

  return {
    // CRUD state
    nacimientos, ingresos, gastos, ventas, resumen,
    cargando, error, mensaje,
    // Dashboard state
    dashPrincipal, dashGastos, dashIngresos,
    dashNacimientos, dashReproduccion, dashLeche,
    // CRUD actions
    cargarNacimientos, cargarIngresos, cargarGastos, cargarVentas,
    crearNacimiento, crearIngreso, crearGasto, crearVenta,
    limpiarMensajes,
    // Dashboard actions
    cargarDashPrincipal, cargarDashGastos, cargarDashIngresos,
    cargarDashNacimientos, cargarDashReproduccion, cargarDashLeche,
  }
})
