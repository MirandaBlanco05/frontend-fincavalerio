import api from '@/core/api/axios.js'

export const produccionService = {
  // CRUD listas — rutas corregidas según el backend real
  listarNacimientos()    { return api.get('/parto/listar') },
  crearNacimiento(d)     { return api.post('/parto/crear', d) },
  listarIngresos()       { return api.get('/ingreso/') },
  listarGastos()         { return api.get('/gasto/') },
  crearGasto(d)          { return api.post('/gasto/', d) },
  listarVentas()         { return api.get('/ingreso/') },
  crearVenta(d)          { return api.post('/ingreso/', d) },

  // Endpoints de dashboard (módulo PRODUCCION)
  dashboardPrincipal()   { return api.get('/produccion/dashboard') },
  dashboardGastos()      { return api.get('/produccion/gastos') },
  dashboardIngresos()    { return api.get('/produccion/ingresos') },
  dashboardNacimientos() { return api.get('/produccion/nacimientos') },
  dashboardReproduccion(){ return api.get('/produccion/reproduccion') },
  dashboardLeche()       { return api.get('/produccion/leche') },

  // Reporte PDF
  reporteIngresos()      { return api.get('/reportes/ingresos', { responseType: 'blob' }) },
}
