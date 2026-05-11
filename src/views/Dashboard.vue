<template>
  <div class="dashboard-wrapper">
    
    <!-- Header -->
    <header class="dashboard-header">
      <div>
        <h2 class="header-title">¡Hola, {{ nombreUsuario }}!</h2>
        <p class="header-subtitle">Bienvenido de nuevo a Finca Valerio. Aquí tienes el resumen de hoy.</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="notification-btn">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
          <span class="notification-dot"></span>
        </button>
      </div>
    </header>

    <!-- Bento Grid Top Row -->
    <div class="bento-grid-top">
      
      <!-- Weather Card -->
      <section class="weather-section">
        <div class="weather-header">
          <div class="weather-icon-wrapper">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="today-label">HOY</span>
        </div>
        <div class="weather-body">
          <h3 class="weather-location">Clima de Santiago Rodríguez</h3>
          <div class="weather-temp-row">
            <span class="weather-temp">{{ clima.temperatura }}°C</span>
            <span class="weather-desc">{{ clima.descripcion }}</span>
          </div>
        </div>
        <div class="weather-footer">
          <span>Viento: {{ clima.viento }}km/h</span>
          <span class="weather-dot"></span>
          <span>Humedad: {{ clima.humedad }}%</span>
        </div>
      </section>

      <!-- Task Card -->
      <section class="task-section">
        <div class="task-bg-shape"></div>
        <div class="task-header">
          <div class="task-icon-wrapper">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <button class="task-arrow" @click="irACitas">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </button>
        </div>
        <div class="task-body">
          <h3 class="task-count">{{ estadisticas.citasPendientes }} citas pendientes</h3>
          <p class="task-next">
            Próxima: <span class="font-semibold text-white">{{ proximaCitaTitulo }}</span><br/>
            {{ proximaCitaHora }}
          </p>
        </div>
      </section>

      <!-- Herd Status Card -->
      <section class="herd-section">
        <div class="herd-banner">
          <div class="banner-stripe brown"></div>
          <div class="banner-stripe dark-green"></div>
          <div class="banner-stripe primary-green"></div>
          <div class="banner-stripe gray"></div>
          <div class="herd-badge-wrapper">
            <span class="herd-badge">GANADO ACTIVO</span>
          </div>
        </div>
        <div class="herd-body">
          <h3 class="herd-title">Cantidad de animales</h3>
          <div class="herd-progress-section">
            <div class="progress-header">
              <span>TOTAL DE BOVINOS</span>
              <span class="progress-value">{{ estadisticas.totalBovinos }}</span>
            </div>
            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill" :style="{ width: calcularProgreso() + '%' }"></div>
            </div>
          </div>
          <p class="herd-footer">{{ estadisticas.bovinosActivos }} bovinos en producción activa</p>
        </div>
      </section>

    </div>

    <!-- Middle Row: Births & Inventory -->
    <div class="middle-row">
      
      <!-- Upcoming Births -->
      <div class="births-section">
        <div class="section-header-row">
          <h3 class="section-title">Próximos Partos</h3>
          <span class="alert-badge">ALERTA</span>
        </div>
        <div v-if="cargandoPartos" class="loading-mini">
          <div class="spinner-mini"></div>
        </div>
        <div v-else-if="proximosPartos.length === 0" class="empty-mini">
          <p>No hay partos programados</p>
        </div>
        <div v-else class="births-list">
          <div v-for="parto in proximosPartos" :key="parto.id" class="birth-item">
            <div class="birth-avatar">{{ parto.codigo }}</div>
            <div class="birth-info">
              <p class="birth-name">{{ parto.nombre }}</p>
              <p class="birth-date">Estimado: {{ parto.fecha }}</p>
            </div>
            <div class="birth-days">
              <span>{{ parto.dias }} días</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Alerts -->
      <div class="inventory-section">
        <h3 class="section-title mb-6">Nivel de Inventario</h3>
        <div v-if="cargandoInventario" class="loading-mini">
          <div class="spinner-mini"></div>
        </div>
        <div v-else class="inventory-grid">
          <div v-for="item in inventarioDisplay" :key="item.id" class="inventory-item">
            <div class="inventory-row">
              <div>
                <p class="inventory-name">{{ item.nombre }}</p>
                <p class="inventory-stock">Stock actual: {{ item.cantidad }} {{ item.unidad }}</p>
              </div>
              <span :class="['inventory-status', item.statusClass]">{{ item.statusText }}</span>
            </div>
            <div class="inventory-bar-wrapper">
              <div :class="['inventory-bar-fill', item.barClass]" :style="{ width: item.porcentaje + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <h3 class="section-title mb-6">Accesos rápidos</h3>
      <div class="quick-grid">
        
        <button class="quick-btn" @click="router.push({ name: 'BovinosList' })">
          <div class="quick-icon-circle">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="quick-label">Bovinos</span>
        </button>

        <button class="quick-btn" @click="router.push({ name: 'Ordenio' })">
          <div class="quick-icon-circle">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="quick-label">Ordeño</span>
        </button>

        <button class="quick-btn" @click="router.push({ name: 'Insumos' })">
          <div class="quick-icon-circle">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="quick-label">Stock Fert.</span>
        </button>

        <button class="quick-btn" @click="router.push({ name: 'Dashboard' })">
          <div class="quick-icon-circle">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
          <span class="quick-label">Ver Mapa</span>
        </button>

        <!-- FAB -->
        <div class="fab-container">
          <button class="fab-btn">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path>
            </svg>
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const nombreUsuario = ref(localStorage.getItem('usuario') || 'Alex')

const clima = ref({
  temperatura: 0,
  descripcion: 'Cargando...',
  viento: 0,
  humedad: 0
})

const estadisticas = ref({
  totalBovinos: 0,
  bovinosActivos: 0,
  citasPendientes: 0
})

const proximosPartos = ref([])
const cargandoPartos = ref(true)
const cargandoInventario = ref(true)
const inventarioCritico = ref([])
const proximaCitaData = ref(null)

const proximaCitaTitulo = computed(() => {
  return proximaCitaData.value ? 'Chequeo veterinario' : 'Sin citas'
})

const proximaCitaHora = computed(() => {
  if (!proximaCitaData.value) return ''
  const fecha = new Date(proximaCitaData.value.fecha_visita)
  return `a las ${fecha.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`
})

const inventarioDisplay = computed(() => {
  return inventarioCritico.value.slice(0, 2).map(item => {
    const porcentaje = (item.cantidad / item.minimo) * 100
    const isBajo = porcentaje <= 30
    
    return {
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      unidad: item.unidad,
      porcentaje: Math.min(porcentaje, 100),
      statusText: isBajo ? `Bajo (${Math.round(porcentaje)}%)` : `Óptimo (${Math.round(porcentaje)}%)`,
      statusClass: isBajo ? 'status-low' : 'status-ok',
      barClass: isBajo ? 'bar-low' : 'bar-ok'
    }
  })
})

async function cargarClimaReal() {
  try {
    const API_KEY = '9f92b27e93078b9370dbd0116c87cc5e'
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=19.4667&lon=-71.1333&units=metric&lang=es&appid=${API_KEY}`
    )
    
    clima.value = {
      temperatura: Math.round(response.data.main.temp),
      descripcion: response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1),
      viento: Math.round(response.data.wind.speed * 3.6),
      humedad: response.data.main.humidity
    }
  } catch {
    clima.value = { temperatura: 28, descripcion: 'Soleado', viento: 14, humedad: 42 }
  }
}

async function cargarDatos() {
  try {
    const bovinosRes = await axios.get('/api/bovino/listar')
    estadisticas.value.totalBovinos = bovinosRes.data.length
    estadisticas.value.bovinosActivos = bovinosRes.data.filter(b => b.estado === 'Activo').length

    try {
      const visitasRes = await axios.get('/api/visita/listar')
      const hoy = new Date()
      const en7Dias = new Date()
      en7Dias.setDate(en7Dias.getDate() + 7)
      
      const citasFuturas = visitasRes.data.filter(v => {
        if (!v.fecha_visita) return false
        const fechaVisita = new Date(v.fecha_visita)
        return fechaVisita >= hoy && fechaVisita <= en7Dias
      })
      
      estadisticas.value.citasPendientes = citasFuturas.length
      proximaCitaData.value = citasFuturas[0] || null
    } catch {
      estadisticas.value.citasPendientes = 3
    }

    cargandoInventario.value = true
    const insumosRes = await axios.get('/api/insumo/listar')
    inventarioCritico.value = insumosRes.data
      .filter(i => i.cantidad_actual <= i.cantidad_minima)
      .map(i => ({
        id: i.id_insumo,
        nombre: i.nombre_insumo,
        cantidad: i.cantidad_actual,
        minimo: i.cantidad_minima,
        unidad: i.unidad_medida
      }))
    cargandoInventario.value = false

    cargandoPartos.value = true
    try {
      const partosRes = await axios.get('/api/parto/listar')
      const hoy = new Date()
      const en30Dias = new Date()
      en30Dias.setDate(en30Dias.getDate() + 30)
      
      proximosPartos.value = partosRes.data
        .filter(p => {
          if (!p.fecha_parto) return false
          const fechaParto = new Date(p.fecha_parto)
          return fechaParto >= hoy && fechaParto <= en30Dias
        })
        .map((p, idx) => {
          const dias = Math.ceil((new Date(p.fecha_parto) - hoy) / (1000 * 60 * 60 * 24))
          return {
            id: p.id_parto,
            codigo: `V${String(idx + 1).padStart(2, '0')}`,
            nombre: p.bovino?.nombre || 'Vaca',
            fecha: new Date(p.fecha_parto).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
            dias: dias
          }
        })
        .slice(0, 2)
    } catch {
      proximosPartos.value = []
    }
    cargandoPartos.value = false

  } catch (error) {
    console.error('Error:', error)
  }
}

function calcularProgreso() {
  return estadisticas.value.totalBovinos > 0 ? Math.min((estadisticas.value.totalBovinos / 100) * 100, 100) : 80
}

function irACitas() {
  router.push({ name: 'AgendaVeterinaria' })
}

onMounted(() => {
  cargarClimaReal()
  cargarDatos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.dashboard-wrapper {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 2rem;
  font-family: 'Manrope', sans-serif;
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #064e3b;
}

.header-subtitle {
  color: #6b7280;
  margin-top: 0.25rem;
}

.notification-btn {
  position: relative;
  padding: 0.5rem;
  background: white;
  border-radius: 9999px;
  border: 1px solid #f3f4f6;
  color: #6b7280;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: color 0.3s;
}

.notification-btn:hover {
  color: #10b981;
}

.notification-dot {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background: #ef4444;
  border-radius: 9999px;
  border: 2px solid white;
}

/* BENTO GRID */
.bento-grid-top {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* WEATHER CARD */
.weather-section {
  background: white;
  padding: 2rem;
  border-radius: 32px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f9fafb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.weather-icon-wrapper {
  padding: 0.75rem;
  background: #fff7ed;
  border-radius: 1rem;
  color: #fb923c;
}

.today-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d1d5db;
  letter-spacing: 0.1em;
}

.weather-body {
  margin-top: 1rem;
}

.weather-location {
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
}

.weather-temp-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.weather-temp {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f2937;
}

.weather-desc {
  font-size: 1.125rem;
  font-weight: 500;
  color: #9ca3af;
}

.weather-footer {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f9fafb;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.weather-dot {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 9999px;
  align-self: center;
}

/* TASK CARD */
.task-section {
  background: #3d7a3d;
  padding: 2rem;
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(6, 78, 59, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  min-height: 280px;
  position: relative;
  overflow: hidden;
}

.task-bg-shape {
  position: absolute;
  right: -2.5rem;
  top: -2.5rem;
  width: 10rem;
  height: 10rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  filter: blur(60px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.task-icon-wrapper {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

.task-arrow {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.3s;
}

.task-arrow:hover {
  background: rgba(255, 255, 255, 0.1);
}

.task-body {
  position: relative;
  z-index: 1;
}

.task-count {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.task-next {
  color: rgba(236, 253, 245, 0.7);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* HERD CARD */
.herd-section {
  background: white;
  border-radius: 32px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 280px;
}

.herd-banner {
  height: 6rem;
  display: flex;
  position: relative;
}

.banner-stripe {
  flex: 1;
  height: 100%;
}

.banner-stripe.brown {
  background: #6E420C;
}

.banner-stripe.dark-green {
  background: #064e3b;
}

.banner-stripe.primary-green {
  background: #10b981;
}

.banner-stripe.gray {
  background: #e5e7eb;
}

.herd-badge-wrapper {
  position: absolute;
  bottom: -0.75rem;
  left: 1rem;
}

.herd-badge {
  background: #064e3b;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 2px solid white;
  display: inline-block;
}

.herd-body {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.herd-title {
  color: #1f2937;
  font-weight: 700;
  font-size: 1.125rem;
}

.herd-progress-section {
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.progress-value {
  color: #064e3b;
}

.progress-bar-wrapper {
  width: 100%;
  background: #f3f4f6;
  height: 0.625rem;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  background: #064e3b;
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s;
}

.herd-footer {
  font-size: 0.6875rem;
  color: #9ca3af;
  margin-top: 1rem;
  font-style: italic;
  font-weight: 500;
}

/* MIDDLE ROW */
.middle-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.births-section,
.inventory-section {
  background: white;
  padding: 1.5rem;
  border-radius: 32px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f9fafb;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #064e3b;
}

.alert-badge {
  font-size: 0.75rem;
  background: #fff7ed;
  color: #c2410c;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 700;
}

.births-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.birth-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 1rem;
}

.birth-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #6E420C;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
}

.birth-info {
  flex: 1;
}

.birth-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

.birth-date {
  font-size: 0.625rem;
  color: #6b7280;
}

.birth-days span {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6E420C;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.inventory-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.inventory-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.inventory-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

.inventory-stock {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.inventory-status {
  font-size: 0.75rem;
  font-weight: 700;
}

.status-low {
  color: #ea580c;
}

.status-ok {
  color: #10b981;
}

.inventory-bar-wrapper {
  width: 100%;
  background: #f3f4f6;
  height: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
}

.inventory-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s;
}

.bar-low {
  background: #f97316;
}

.bar-ok {
  background: #10b981;
}

.loading-mini,
.empty-mini {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}

.spinner-mini {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top-color: #177556;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* QUICK ACTIONS */
.quick-actions {
  margin-top: 2rem;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
}

.quick-btn {
  background: white;
  padding: 1.5rem;
  border-radius: 32px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover {
  background: #ecfdf5;
}

.quick-icon-circle {
  width: 3rem;
  height: 3rem;
  background: #f9fafb;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #064e3b;
  transition: all 0.3s;
}

.quick-btn:hover .quick-icon-circle {
  background: #065b3f;
  color: white;
}

.quick-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}

.fab-container {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
}

.fab-btn {
  width: 4rem;
  height: 4rem;
  background: #6E420C;
  color: white;
  border-radius: 9999px;
  border: 4px solid white;
  box-shadow: 0 20px 40px rgba(110, 66, 12, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.fab-btn:hover {
  transform: scale(1.1);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .bento-grid-top {
    grid-template-columns: 1fr;
  }
  
  .middle-row {
    grid-template-columns: 1fr;
  }
  
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>