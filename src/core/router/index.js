// src/core/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

<<<<<<< HEAD
=======
// 🔹 Ciclo Celo
const CicloCeloIndex = () => import('@/modules/CicloCelo/views/CicloCeloIndex.vue')
const CicloCeloForm  = () => import('@/modules/CicloCelo/views/CicloCeloForm.vue')

// 🔹 Login y Dashboard
>>>>>>> 13f3351842f54bd554aa07b256739035351d0854
const Login           = () => import('@/modules/login/views/Login.vue')
const Dashboard       = () => import('@/views/Dashboard.vue')

// 🔹 Bovino
const BovinoIndex     = () => import('@/modules/bovino/views/BovinoIndex.vue')
const BovinoList      = () => import('@/modules/bovino/views/BovinoList.vue')
const BovinoForm      = () => import('@/modules/bovino/views/BovinoForm.vue')

// 🔹 Visita\ y Producción
const VisitaIndex     = () => import('@/modules/visita/views/VisitaIndex.vue')
const ProduccionIndex = () => import('@/modules/produccion/views/ProduccionIndex.vue')

// 🔹 Celo
const CeloIndex       = () => import('@/modules/celo/views/CeloIndex.vue')
const EmpleadoIndex   = () => import('@/modules/empleado/views/EmpleadoIndex.vue')
const OrdenioIndex    = () => import('@/modules/ordenio/views/OrdenioIndex.vue')

// 🔹 Inseminación
const InseminacionIndex      = () => import('@/modules/inseminacion/InseminacionIndex.vue')
const InseminacionForm       = () => import('@/modules/inseminacion/InseminacionForm.vue')
const NewInseminacionForm    = () => import('@/modules/inseminacion/NewInseminacionForm.vue')

const routes = [
  // Login
  { path: '/',      redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { publico: true } },

  // App
  { path: '/dashboard',  name: 'Dashboard',  component: Dashboard },
  { path: '/produccion', name: 'Produccion', component: ProduccionIndex },
  { path: '/visitas',    name: 'Visitas',    component: VisitaIndex },
  { path: '/celo',       name: 'Celo',       component: CeloIndex },
  { path: '/empleado',   name: 'Empleado',   component: EmpleadoIndex },
  { path: '/ordenio',    name: 'Ordenio',    component: OrdenioIndex },

  // Bovinos
  {
    path: '/bovinos',
    component: BovinoIndex,
    children: [
      { path: '', name: 'Bovinos', component: BovinoList },
      { path: 'nuevo', name: 'BovinoNuevo', component: BovinoForm },
      { path: 'editar/:id', name: 'BovinoEditar', component: BovinoForm }
    ]
  },

<<<<<<< HEAD
=======
  // Ciclos de celo
  {
    path: '/ciclos',
    component: CicloCeloIndex,
    children: [
      { path: '', name: 'Ciclos', component: CicloCeloForm }
    ]
  },

  // Inseminaciones
  {
    path: '/inseminaciones',
    component: InseminacionIndex,
    children: [
      { path: '', name: 'Inseminaciones', component: InseminacionForm },
      { path: 'nuevo', name: 'NewInseminacion', component: NewInseminacionForm }
    ]
  },

  // Embarazos
  {
    path: '/embarazos',
    component: () => import('@/modules/Embarazo/EmbarazoIndex.vue'),
    children: [
      { path: '', name: 'Embarazos', component: () => import('@/modules/Embarazo/EmbarazoForm.vue') },
      { path: 'nuevo', name: 'NewEmbarazo', component: () => import('@/modules/Embarazo/NewEmbarazoForm.vue') }
    ]
  },

  // Partos
  {
    path: '/partos',
    component: () => import('@/modules/Parto/PartoIndex.vue'),
    children: [
      { path: '', name: 'Partos', component: () => import('@/modules/Parto/PartoForm.vue') },
      { path: 'nuevo', name: 'NewParto', component: () => import('@/modules/Parto/NewPartoForm.vue') }
    ]
  },

  // Ruta por defecto (si no encuentra la ruta)
>>>>>>> 13f3351842f54bd554aa07b256739035351d0854
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const haySession = localStorage.getItem('usuario')
  if (!to.meta.publico && !haySession) return '/login'
  if (to.path === '/login' && haySession) return '/dashboard'
})

export default router