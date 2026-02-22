// src/modules/produccion/services/produccion.service.js
import api from '@/core/api/axios.js'

export const produccionService = {
  listarNacimientos() { return api.get('/nacimiento/listar') },
  crearNacimiento(d)  { return api.post('/nacimiento/crear', d) },
  listarIngresos()    { return api.get('/ingreso/listar') },
  listarGastos()      { return api.get('/gasto/listar') },
  crearGasto(d)       { return api.post('/gasto/crear', d) },
  listarVentas()      { return api.get('/venta/listar') },
  crearVenta(d)       { return api.post('/venta/crear', d) },
  // Reporte PDF — devuelve blob
  reporteIngresos()   { return api.get('/reportes/ingresos', { responseType: 'blob' }) },
}