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
const EmpleadoForm    = () => import('@/modules/empleado/views/EmpleadoForm.vue')
const OrdenioIndex    = () => import('@/modules/ordenio/views/OrdenioIndex.vue')
const CompraIndex     = () => import('@/modules/compra/views/compraindex.vue')
const CompraForm      = () => import('@/modules/compra/views/CompraForm.vue')
const OrdenioForm     = () => import('@/modules/ordenio/views/OrdenioForm.vue')

const VentaIndex      = () => import('@/modules/venta/views/VentaIndex.vue')
const VentaForm       = () => import('@/modules/venta/views/VentaForm.vue')

// Reproducción
const CeloIndex        = () => import('@/modules/celo/views/CeloIndex.vue')
const PartoIndex      = () => import('@/modules/Parto/PartoIndex.vue')
const InseminacionIndex   = () => import('@/modules/inseminacion/InseminacionIndex.vue')
const InseminacionForm    = () => import('@/modules/inseminacion/InseminacionForm.vue')
const NewInseminacionForm = () => import('@/modules/inseminacion/NewInseminacionForm.vue')
const EmbarazoIndex   = () => import('@/modules/Embarazo/EmbarazoIndex.vue')
const EmbarazoForm    = () => import('@/modules/Embarazo/EmbarazoForm.vue')
const NewEmbarazoForm = () => import('@/modules/Embarazo/NewEmbarazoForm.vue')

// Salud y Bienestar
const VeterinarioIndex     = () => import('@/modules/veterinario/views/VeterinariosList.vue')
const VeterinarioForm      = () => import('@/modules/veterinario/views/VeterinarioForm.vue')
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
const ProductoForm  = () => import('@/modules/producto/views/ProductoForm.vue')
const InsumoIndex = () => import('@/modules/insumo/views/InsumoIndex.vue')

// Contactos
const ClienteIndex = () => import('@/modules/cliente/views/ClienteIndex.vue')
const ClienteForm  = () => import('@/modules/cliente/views/ClienteForm.vue')
const ProveedorIndex = () => import('@/modules/proveedor/views/ProveedorIndex.vue')
const ProveedorForm  = () => import('@/modules/proveedor/views/ProveedorForm.vue')

const routes = [
  { path: '/',      redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { publico: true } },

  { path: '/dashboard',  name: 'Dashboard',  component: Dashboard },
  { path: '/produccion', name: 'Produccion', component: ProduccionIndex },
  
  // Ganadería
  { path: '/ordenio',          name: 'Ordenio',       component: OrdenioIndex },
  { path: '/ordenio/nuevo',    name: 'OrdenioNuevo',  component: OrdenioForm },
  { path: '/ordenio/editar/:id', name: 'OrdenioEditar', component: OrdenioForm },
  
  // Salud y Bienestar
  { path: '/veterinarios',          name: 'Veterinarios',          component: VeterinarioIndex },
  { path: '/veterinarios/nuevo',    name: 'VeterinarioNuevo',       component: VeterinarioForm },
  { path: '/veterinarios/editar/:id', name: 'VeterinarioEditar',     component: VeterinarioForm },
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
  { path: '/venta/nueva', name: 'VentaNueva',  component: VentaForm },
  { path: '/venta/editar/:id', name: 'VentaEditar', component: VentaForm },
  { path: '/compra',      name: 'Compra',      component: CompraIndex },
  { path: '/compra/nueva', name: 'CompraNueva', component: CompraForm },
  { path: '/compra/editar/:id', name: 'CompraEditar', component: CompraForm },

  // Inventario
  { path: '/productos',          name: 'Productos',       component: ProductoIndex },
  { path: '/productos/nuevo',    name: 'ProductoNuevo',   component: ProductoForm },
  { path: '/productos/editar/:id', name: 'ProductoEditar',  component: ProductoForm },
  { path: '/insumos',            name: 'Insumos',         component: InsumoIndex },
  
  // Contactos
  { path: '/empleado',          name: 'Empleado',        component: EmpleadoIndex },
  { path: '/empleado/nuevo',     name: 'EmpleadoNuevo',   component: EmpleadoForm },
  { path: '/empleado/editar/:id', name: 'EmpleadoEditar',  component: EmpleadoForm },
  { path: '/clientes',          name: 'Clientes',        component: ClienteIndex },
  { path: '/clientes/nuevo',     name: 'ClienteNuevo',    component: ClienteForm },
  { path: '/clientes/editar/:id', name: 'ClienteEditar',   component: ClienteForm },
  { path: '/proveedores',          name: 'Proveedores',     component: ProveedorIndex },
  { path: '/proveedores/nuevo',    name: 'ProveedorNuevo',  component: ProveedorForm },
  { path: '/proveedores/editar/:id', name: 'ProveedorEditar', component: ProveedorForm },

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
  
  { path: '/inseminaciones',       name: 'InseminacionesList', component: InseminacionForm },
  { path: '/inseminaciones/nuevo', name: 'InseminacionNueva',  component: NewInseminacionForm },

  { path: '/embarazos',       name: 'EmbarazosList', component: EmbarazoIndex },
  { path: '/embarazos/nuevo', name: 'EmbarazoNuevo',  component: NewEmbarazoForm },

  { path: '/partos',       name: 'PartosList', component: PartoIndex },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const haySession = localStorage.getItem('usuario')
  if (!to.meta.publico && !haySession) return '/login'
  if (to.path === '/login' && haySession) return '/dashboard'
})

export default router