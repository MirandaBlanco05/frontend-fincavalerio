// src/core/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const CicloCeloIndex = () => import('@/modules/cicloCelo/views/CicloCeloIndex.vue')
const CicloCeloForm  = () => import('@/modules/cicloCelo/views/CicloCeloForm.vue')
const Login           = () => import('@/modules/login/views/Login.vue')
const Dashboard       = () => import('@/views/Dashboard.vue')
const BovinoIndex     = () => import('@/modules/bovino/views/BovinoIndex.vue')
const BovinoList      = () => import('@/modules/bovino/views/BovinoList.vue')
const BovinoForm      = () => import('@/modules/bovino/views/BovinoForm.vue')
const VisitaIndex     = () => import('@/modules/visita/views/VisitaIndex.vue')
const ProduccionIndex = () => import('@/modules/produccion/views/ProduccionIndex.vue')
const CeloIndex       = () => import('@/modules/celo/views/CeloIndex.vue')

const routes = [
  // Login = entrada principal
  { path: '/',      redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { publico: true } },

  // App (requiere sesión)
  { path: '/dashboard',  name: 'Dashboard',  component: Dashboard },
  { path: '/produccion', name: 'Produccion', component: ProduccionIndex },
  { path: '/visitas',    name: 'Visitas',    component: VisitaIndex },
  { path: '/celo',       name: 'Celo',       component: CeloIndex },

  {
    path: '/bovinos',
    component: BovinoIndex,
    children: [
      { path: '',           name: 'Bovinos',      component: BovinoList },
      { path: 'nuevo',      name: 'BovinoNuevo',  component: BovinoForm },
      { path: 'editar/:id', name: 'BovinoEditar', component: BovinoForm }
    ]
  },

 {
  path: '/ciclos',
  component: CicloCeloIndex,
  children: [
    { path: '', name: 'Ciclos', component: CicloCeloForm }
  ]
},
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({ history: createWebHistory(), routes })

// Guard: si no hay sesión redirige al login; si ya hay sesión no puede volver al login
router.beforeEach((to) => {
  const haySession = localStorage.getItem('usuario')
  if (!to.meta.publico && !haySession) return '/login'
  if (to.path === '/login' && haySession) return '/dashboard'
})

export default router
