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
const CompraIndex     = () => import('@/modules/compra/views/compraindex.vue')

const VentaIndex      = () => import('@/modules/venta/views/VentaIndex.vue')
const VentaForm       = () => import('@/modules/venta/views/VentaForm.vue')

const InseminacionIndex   = () => import('@/modules/inseminacion/InseminacionIndex.vue')
const InseminacionForm    = () => import('@/modules/inseminacion/InseminacionForm.vue')
const NewInseminacionForm = () => import('@/modules/inseminacion/NewInseminacionForm.vue')

const EmbarazoIndex   = () => import('@/modules/Embarazo/EmbarazoIndex.vue')
const EmbarazoForm    = () => import('@/modules/Embarazo/EmbarazoForm.vue')
const NewEmbarazoForm = () => import('@/modules/Embarazo/NewEmbarazoForm.vue')

const PartoIndex   = () => import('@/modules/Parto/PartoIndex.vue')
const PartoForm    = () => import('@/modules/Parto/PartoForm.vue')
const NewPartoForm = () => import('@/modules/Parto/NewPartoForm.vue')

// Salud y Bienestar
const VeterinarioIndex     = () => import('@/modules/veterinario/views/VeterinariosList.vue')
const AgendaVeterinariaIndex = () => import('@/modules/agendaveterinaria/views/AgendaVeterinariaIndex.vue')

// Historial de Enfermedades
const HistorialList = () => import('@/modules/historialenfermedades/views/HistorialList.vue')
const HistorialForm = () => import('@/modules/historialenfermedades/views/HistorialForm.vue')

// Vacunas
const VacunasList = () => import('@/modules/vacuna/views/VacunasList.vue')
const VacunaForm  = () => import('@/modules/vacuna/views/VacunaForm.vue')

// Tratamientos
const TratamientosList = () => import('@/modules/tratamientos/views/TratamientosList.vue')
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
  
  // Salud y Bienestar
  { path: '/veterinarios',          name: 'Veterinarios',          component: VeterinarioIndex },
  { path: '/agenda-veterinaria',    name: 'AgendaVeterinaria',     component: AgendaVeterinariaIndex },
  
  // Historial de Enfermedades
  { path: '/historial-enfermedades',         name: 'HistorialEnfermedades', component: HistorialList },
  { path: '/historial-enfermedades/nuevo',   name: 'HistorialNuevo',        component: HistorialForm },
  { path: '/historial-enfermedades/editar/:id', name: 'HistorialEditar',    component: HistorialForm },
  
  // Vacunas
  { path: '/vacunas',               name: 'Vacunas',       component: VacunasList },
  { path: '/vacunas/nuevo',         name: 'VacunaNueva',   component: VacunaForm },
  { path: '/vacunas/editar/:id',    name: 'VacunaEditar',  component: VacunaForm },
  
  // Tratamientos
  { path: '/tratamientos',          name: 'Tratamientos',       component: TratamientosList },
  { path: '/tratamientos/nuevo',    name: 'TratamientoNuevo',   component: TratamientoForm },
  { path: '/tratamientos/editar/:id', name: 'TratamientoEditar', component: TratamientoForm },
  
  // Reproducción
{
  path: '/ciclo-celo',
  name: 'CicloCelo',
  component: () => import('@/modules/celo/views/CeloIndex.vue')
},
  // Facturación
  { path: '/venta',       name: 'Venta',       component: VentaIndex },
  { path: '/compra',      name: 'Compra',      component: CompraIndex },
  { path: '/venta/nueva', name: 'VentaNueva',  component: VentaForm },

  // Inventario
  { path: '/productos', name: 'Productos', component: ProductoIndex },
  { path: '/insumos',   name: 'Insumos',   component: InsumoIndex },
  
  // Contactos
  { path: '/empleado',    name: 'Empleado',   component: EmpleadoIndex },
  { path: '/clientes',    name: 'Clientes',   component: ClienteIndex },
  { path: '/proveedores', name: 'Proveedores',component: ProveedorIndex },

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
  
  {
    path: '/inseminaciones',
    component: InseminacionIndex,
    children: [
      { path: '',      name: 'InseminacionesList',      component: InseminacionForm },
      { path: 'nuevo', name: 'InseminacionNueva',       component: NewInseminacionForm }
    ]
  },

  {
    path: '/embarazos',
    component: EmbarazoIndex,
    children: [
      { path: '',      name: 'EmbarazosList',      component: EmbarazoForm },
      { path: 'nuevo', name: 'EmbarazoNuevo',      component: NewEmbarazoForm }
    ]
  },

  {
    path: '/partos',
    component: PartoIndex,
    children: [
      { path: '',      name: 'PartosList',      component: PartoForm },
      { path: 'nuevo', name: 'PartoNuevo',      component: NewPartoForm }
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