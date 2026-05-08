// src/core/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const Login           = () => import('@/modules/login/views/Login.vue')
const Dashboard       = () => import('@/views/Dashboard.vue')
const BovinoIndex     = () => import('@/modules/bovino/views/BovinoIndex.vue')
const BovinoList      = () => import('@/modules/bovino/views/BovinoList.vue')
const BovinoForm      = () => import('@/modules/bovino/views/BovinoForm.vue')
const ProduccionIndex = () => import('@/modules/produccion/views/ProduccionIndex.vue')
const CeloIndex       = () => import('@/modules/celo/views/CeloIndex.vue')
const EmpleadoIndex   = () => import('@/modules/empleado/views/EmpleadoIndex.vue')
const OrdenioIndex    = () => import('@/modules/ordenio/views/OrdenioIndex.vue')
const OrdenioForm     = () => import('@/modules/ordenio/views/OrdenioForm.vue')
const CompraIndex     = () => import('@/modules/compra/views/compraindex.vue')

const VentaIndex      = () => import('@/modules/venta/views/VentaIndex.vue')
const VentaForm       = () => import('@/modules/venta/views/VentaForm.vue')

const InseminacionIndex   = () => import('@/modules/inseminacion/InseminacionIndex.vue')
const NewInseminacionForm = () => import('@/modules/inseminacion/NewInseminacionForm.vue')

const EmbarazoIndex   = () => import('@/modules/Embarazo/EmbarazoIndex.vue')
const NewEmbarazoForm = () => import('@/modules/Embarazo/NewEmbarazoForm.vue')

const PartoIndex   = () => import('@/modules/Parto/PartoIndex.vue')
const NewPartoForm = () => import('@/modules/Parto/NewPartoForm.vue')

// Salud y Bienestar
const VeterinarioIndex     = () => import('@/modules/veterinario/views/VeterinariosList.vue')
const VeterinarioForm = () => import('@/modules/veterinario/views/VeterinarioForm.vue')
const AgendaVeterinariaIndex = () => import('@/modules/agendaveterinaria/views/AgendaVeterinariaIndex.vue')

// Historial de Enfermedades
const HistorialIndex = () => import('@/modules/historialenfermedades/views/HistorialIndex.vue')
const HistorialForm = () => import('@/modules/historialenfermedades/views/HistorialForm.vue')

// Vacunas
const VacunasIndex = () => import('@/modules/vacuna/views/VacunaIndex.vue')
const VacunaForm  = () => import('@/modules/vacuna/views/VacunaForm.vue')

// Tratamientos
const TratamientosIndex = () => import('@/modules/tratamientos/views/TratamientoIndex.vue')
const TratamientoForm  = () => import('@/modules/tratamientos/views/TratamientoForm.vue')

// Inventario
const ProductoIndex = () => import('@/modules/producto/views/ProductoIndex.vue')
const InsumoIndex = () => import('@/modules/insumo/views/InsumoIndex.vue')

// Contactos
const ClienteIndex = () => import('@/modules/cliente/views/ClienteIndex.vue')
const ProveedorIndex = () => import('@/modules/proveedor/views/ProveedorIndex.vue')

const routes = [
  { path: '/',      redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { publico: true } },

  { path: '/dashboard',  name: 'Dashboard',  component: Dashboard },
  { path: '/produccion', name: 'Produccion', component: ProduccionIndex },
  
  // Ganadería
  { path: '/ordenio',    name: 'Ordenio',    component: OrdenioIndex },
  { path: '/ordenio/nuevo', name: 'OrdenioNuevo', component: OrdenioForm },
  { path: '/ordenio/editar/:id', name: 'OrdenioEditar', component: OrdenioForm },
  
  // Salud y Bienestar
  { path: '/veterinarios',           name: 'Veterinarios',        component: VeterinarioIndex },
{ path: '/veterinarios/nuevo',     name: 'VeterinarioNuevo',    component: VeterinarioForm },
{ path: '/veterinarios/editar/:id', name: 'VeterinarioEditar',  component: VeterinarioForm },
  { path: '/agenda-veterinaria',    name: 'AgendaVeterinaria',     component: AgendaVeterinariaIndex },
  
  // Historial de Enfermedades
  { path: '/historial-enfermedades',         name: 'HistorialEnfermedades', component: HistorialIndex },
  { path: '/historial-enfermedades/nuevo',   name: 'HistorialNuevo',        component: HistorialForm },
  { path: '/historial-enfermedades/editar/:id', name: 'HistorialEditar',    component: HistorialForm },
  
  // Vacunas
  { path: '/vacunas',               name: 'Vacunas',       component: VacunasIndex },
  { path: '/vacunas/nuevo',         name: 'VacunaNueva',   component: VacunaForm },
  { path: '/vacunas/editar/:id',    name: 'VacunaEditar',  component: VacunaForm },
  
  // Tratamientos
  { path: '/tratamientos',          name: 'Tratamientos',       component: TratamientosIndex },
  { path: '/tratamientos/nuevo',    name: 'TratamientoNuevo',   component: TratamientoForm },
  { path: '/tratamientos/editar/:id', name: 'TratamientoEditar', component: TratamientoForm },
  
  // Reproducción
  { path: '/ciclo-celo',              name: 'CicloCelo',      component: CeloIndex },
  { path: '/ciclo-celo/nuevo',        name: 'CeloNuevo',      component: () => import('@/modules/celo/views/CeloForm.vue') },
  { path: '/ciclo-celo/editar/:id',   name: 'CeloEditar',     component: () => import('@/modules/celo/views/CeloForm.vue') },

  { path: '/inseminaciones',          name: 'Inseminaciones', component: InseminacionIndex },
  { path: '/inseminaciones/nuevo',    name: 'InseminacionNueva', component: NewInseminacionForm },
  { path: '/inseminaciones/editar/:id', name: 'InseminacionEditar', component: NewInseminacionForm },

  { path: '/embarazos',               name: 'Embarazos',      component: EmbarazoIndex },
  { path: '/embarazos/nuevo',         name: 'EmbarazoNuevo',  component: NewEmbarazoForm },
  { path: '/embarazos/editar/:id',    name: 'EmbarazoEditar', component: NewEmbarazoForm },

  { path: '/partos',                  name: 'Partos',         component: PartoIndex },
  { path: '/partos/nuevo',            name: 'PartoNuevo',     component: NewPartoForm },
  { path: '/partos/editar/:id',       name: 'PartoEditar',    component: NewPartoForm },

  // Facturación
  { path: '/venta',       name: 'Venta',       component: VentaIndex },
  { path: '/compra',      name: 'Compra',      component: CompraIndex },
  { path: '/venta/nueva', name: 'VentaNueva',  component: VentaForm },
  { path: '/venta/editar/:id', name: 'VentaEditar', component: VentaForm },
  { path: '/compra/nueva', name: 'CompraNueva', component: () => import('@/modules/compra/views/CompraForm.vue') },
  { path: '/compra/editar/:id', name: 'CompraEditar', component: () => import('@/modules/compra/views/CompraForm.vue') },

  // Inventario
  { path: '/productos', name: 'Productos', component: ProductoIndex },
  { path: '/productos/nuevo', name: 'ProductoNuevo', component: () => import('@/modules/producto/views/ProductoForm.vue') },
  { path: '/productos/editar/:id', name: 'ProductoEditar', component: () => import('@/modules/producto/views/ProductoForm.vue') },
  { path: '/insumos',   name: 'Insumos',   component: InsumoIndex },
  
  // Contactos
  { path: '/empleados',    name: 'Empleados',   component: EmpleadoIndex },
  { path: '/empleados/nuevo', name: 'EmpleadoNuevo', component: () => import('@/modules/empleado/views/EmpleadoForm.vue') },
  { path: '/empleados/editar/:id', name: 'EmpleadoEditar', component: () => import('@/modules/empleado/views/EmpleadoForm.vue') },
  { path: '/clientes',    name: 'Clientes',   component: ClienteIndex },
  { path: '/clientes/nuevo', name: 'ClienteNuevo', component: () => import('@/modules/cliente/views/ClienteForm.vue') },
  { path: '/clientes/editar/:id', name: 'ClienteEditar', component: () => import('@/modules/cliente/views/ClienteForm.vue') },
  { path: '/proveedores', name: 'Proveedores',component: ProveedorIndex },
  { path: '/proveedores/nuevo', name: 'ProveedorNuevo', component: () => import('@/modules/proveedor/views/ProveedorForm.vue') },
  { path: '/proveedores/editar/:id', name: 'ProveedorEditar', component: () => import('@/modules/proveedor/views/ProveedorForm.vue') },

  // Rutas anidadas para módulos complejos
  {
    path: '/bovinos',
    component: BovinoIndex,
    children: [
      { path: '',           name: 'BovinosList',    component: BovinoList },
      { path: 'nuevo',      name: 'BovinoNuevo',   component: BovinoForm },
      { path: 'editar/:id', name: 'BovinoEditar',  component: BovinoForm }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const haySession = localStorage.getItem('usuario')
  if (!to.meta.publico && !haySession) return '/login'
  if (to.path === '/login' && haySession) return '/dashboard'
})

export default router