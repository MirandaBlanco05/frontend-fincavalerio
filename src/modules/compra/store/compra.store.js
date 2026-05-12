import { ref } from 'vue'
import { useNotificationStore } from '@/store/notification.store.js'
import { compraService } from '@/modules/compra/services/compra.service.js'
import { proveedorService } from '@/modules/compra/services/proveedor.service.js'
import { secuenciaService } from '@/modules/compra/services/secuencia.service.js'

export const useComprasStore = defineStore('compras', () => {
  const compras = ref([])
  const compraActual = ref(null)
  const proveedores = ref([])
  const secuenciasNCF = ref([])
  const cargando = ref(false)
  const error = ref('')
  const notification = useNotificationStore()

  async function cargarCompras() {
    cargando.value = true
    error.value = ''
    try {
      const response = await compraService.listar()
      console.log('Respuesta compras:', response)
      compras.value = Array.isArray(response) ? response : (response?.data || [])
    } catch (e) {
      error.value = e.response?.data?.error || 'Error al cargar compras'
      console.error('Error cargando compras:', e)
      compras.value = []
    } finally {
      cargando.value = false
    }
  }

  async function obtenerCompra(id) {
    cargando.value = true
    error.value = ''
    try {
      const response = await compraService.obtener(id)
      console.log('Compra obtenida:', response)
      compraActual.value = response?.data || response
      return compraActual.value
    } catch (e) {
      const serverError = e.response?.data?.error
      const status = e.response?.status
      error.value = serverError || (status ? `Error HTTP ${status}` : e.message || 'Error desconocido')
      console.error('Error obteniendo compra:', e)
      return null
    } finally {
      cargando.value = false
    }
  }

  async function crearCompra(datos) {
    cargando.value = true
    error.value = ''
    try {
      await compraService.crear(datos)
      await cargarCompras()
      notification.notify('Compra registrada correctamente', 'success')
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear compra'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  async function actualizarCompra(id, datos) {
    cargando.value = true
    error.value = ''
    try {
      await compraService.actualizar(id, datos)
      await cargarCompras()
      notification.notify('Compra actualizada correctamente', 'success')
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al actualizar compra'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  async function cargarProveedores() {
    try {
      const data = await proveedorService.listar()
      console.log('Proveedores obtenidos:', data)
      proveedores.value = Array.isArray(data) ? data : (data?.data || [])
    } catch (e) {
      console.error('Error cargando proveedores:', e)
      proveedores.value = []
    }
  }

  async function cargarSecuenciasNCF() {
    try {
      const data = await secuenciaService.listar()
      console.log('Secuencias NCF obtenidas:', data)
      const listaCompleta = Array.isArray(data) ? data : (data?.data || [])
      secuenciasNCF.value = listaCompleta.filter(s => s.estado === 'disponible' || !s.estado)
    } catch (e) {
      console.error('Error cargando secuencias NCF:', e)
      secuenciasNCF.value = []
    }
  }

  async function eliminarCompra(id) {
    cargando.value = true
    error.value = ''
    try {
      await compraService.eliminar(id)
      await cargarCompras()
      notification.notify('Compra eliminada correctamente', 'success')
      return true
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar compra'
      notification.notify(msg, 'error')
      return false
    } finally {
      cargando.value = false
    }
  }

  return {
    compras,
    compraActual,
    proveedores,
    secuenciasNCF,
    cargando,
    error,
    cargarCompras,
    obtenerCompra,
    crearCompra,
    actualizarCompra,
    eliminarCompra,
    cargarProveedores,
    cargarSecuenciasNCF
  }
})