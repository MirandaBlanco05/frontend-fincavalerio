<template>
  <div class="dashboard-premium">

    <!-- Stats Grid Premium -->
    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Prod. Diaria Leche</span>
          <span class="material-symbols-outlined stat-icon icon-green">water_drop</span>
        </div>
        <div class="stat-body">
          <div class="stat-value">{{ produccionHoy }} <span class="stat-unit">L</span></div>
          <div class="stat-trend trend-up">
            <span class="material-symbols-outlined">trending_up</span>
            <span>+4.2% vs ayer</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Ingreso Proyectado</span>
          <span class="material-symbols-outlined stat-icon icon-amber">monetization_on</span>
        </div>
        <div class="stat-body">
          <div class="stat-value">RD$ {{ formatearNumero(ventasMes * 850) }}</div>
          <div class="stat-trend trend-green">
            <span class="material-symbols-outlined">analytics</span>
            <span>Meta mensual: 82%</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Ganado Activo</span>
          <span class="material-symbols-outlined stat-icon icon-gray">cruelty_free</span>
        </div>
        <div class="stat-body">
          <div class="stat-value">{{ totalBovinos }}</div>
          <div class="stat-trend trend-neutral">
            <span class="material-symbols-outlined">inventory</span>
            <span>Estable</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Ordeños del Día</span>
          <span class="material-symbols-outlined stat-icon icon-green">health_and_safety</span>
        </div>
        <div class="stat-body">
          <div class="stat-value">{{ ordeniosHoy }}</div>
          <div class="stat-trend trend-neutral">
            <span class="material-symbols-outlined">check_circle</span>
            <span>Sin riesgos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Charts Section -->
    <section class="main-charts">
      <!-- Large Production Chart -->
      <div class="chart-card chart-large">
        <div class="chart-header-premium">
          <div>
            <h3 class="chart-title-premium">Producción de Leche</h3>
            <p class="chart-subtitle-premium">Tendencia de los últimos 7 días</p>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot bg-green"></span>
              <span class="legend-label">Litros</span>
            </div>
          </div>
        </div>
        <div class="chart-container-large">
          <canvas ref="produccionChart"></canvas>
        </div>
      </div>

      <!-- Herd Status Donut -->
      <div class="chart-card">
        <h3 class="chart-title-premium mb-6">Estado del Hato</h3>
        <div class="donut-wrapper">
          <canvas ref="hatoChart"></canvas>
        </div>
        <div class="donut-legend">
          <div class="legend-row" v-for="(grupo, idx) in distribucionGrupos" :key="idx">
            <div class="legend-item-inline">
              <span class="legend-dot-sm" :style="`background: ${coloresPremium[idx % 5]}`"></span>
              <span class="legend-text">{{ grupo.nombre }}</span>
            </div>
            <span class="legend-value">{{ grupo.cantidad }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Grid -->
    <section class="bottom-grid">
      <!-- Expense Breakdown -->
      <div class="chart-card">
        <h3 class="chart-title-premium mb-6">Ventas vs Compras</h3>
        <div class="chart-container-medium">
          <canvas ref="ventasComprasChart"></canvas>
        </div>
      </div>

      <!-- Performance Goals -->
      <div class="chart-card">
        <h3 class="chart-title-premium mb-6">Metas de Rendimiento</h3>
        <div class="goals-container">
          <div class="goal-item">
            <div class="goal-header">
              <div class="goal-label">
                <span class="material-symbols-outlined goal-icon icon-green">precision_manufacturing</span>
                <span>Eficiencia de Ordeño</span>
              </div>
              <span class="goal-percent green">92%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill bg-green" style="width: 92%"></div>
            </div>
          </div>

          <div class="goal-item">
            <div class="goal-header">
              <div class="goal-label">
                <span class="material-symbols-outlined goal-icon icon-amber">nutrition</span>
                <span>Balance Nutricional</span>
              </div>
              <span class="goal-percent amber">78%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill bg-amber" style="width: 78%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="chart-card">
        <h3 class="chart-title-premium mb-6">Resumen del Sistema</h3>
        <div class="summary-grid-premium">
          <div class="summary-item-premium">
            <span class="material-symbols-outlined summary-icon icon-green">pets</span>
            <div>
              <p class="summary-label">Bovinos</p>
              <p class="summary-value">{{ totalBovinos }}</p>
            </div>
          </div>
          <div class="summary-item-premium">
            <span class="material-symbols-outlined summary-icon icon-green">water_drop</span>
            <div>
              <p class="summary-label">Ordeños (7d)</p>
              <p class="summary-value">{{ totalOrdeniosSemana }}</p>
            </div>
          </div>
          <div class="summary-item-premium">
            <span class="material-symbols-outlined summary-icon icon-amber">receipt_long</span>
            <div>
              <p class="summary-label">Ventas</p>
              <p class="summary-value">{{ ventasMes }}</p>
            </div>
          </div>
          <div class="summary-item-premium">
            <span class="material-symbols-outlined summary-icon icon-gray">shopping_cart</span>
            <div>
              <p class="summary-label">Compras</p>
              <p class="summary-value">{{ comprasMes }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/core/api/axios.js'

const produccionChart = ref(null)
const hatoChart = ref(null)
const ventasComprasChart = ref(null)

const totalBovinos = ref(0)
const produccionHoy = ref(0)
const ordeniosHoy = ref(0)
const ventasMes = ref(0)
const comprasMes = ref(0)
const totalOrdeniosSemana = ref(0)
const distribucionGrupos = ref([])

const coloresPremium = ['#3b6934', '#6e9567', '#9ab995', '#c5ddc1', '#e8f3e6']

function formatearNumero(num) {
  return num.toLocaleString('es-DO')
}

async function cargarDatos() {
  try {
    const { data: bovinos } = await api.get('/bovino/listar')
    totalBovinos.value = bovinos.length

    const { data: ordenios } = await api.get('/ordenio/listar')
    const hoy = new Date().toISOString().split('T')[0]
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const ordeniosDeHoy = ordenios.filter(o => o.fecha === hoy)
    ordeniosHoy.value = ordeniosDeHoy.length
    produccionHoy.value = ordeniosDeHoy.reduce((sum, o) => sum + parseFloat(o.cantidad_total || 0), 0).toFixed(1)

    const ordeniosSemana = ordenios.filter(o => o.fecha >= hace7Dias)
    totalOrdeniosSemana.value = ordeniosSemana.length

    const { data: ventas } = await api.get('/venta/listar')
    const mesActual = new Date().getMonth()
    const añoActual = new Date().getFullYear()
    ventasMes.value = ventas.filter(v => {
      const fecha = new Date(v.fecha)
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    }).length

    const { data: compras } = await api.get('/compra/listar')
    comprasMes.value = compras.filter(c => {
      const fecha = new Date(c.fecha)
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    }).length

    const gruposCont = {}
    bovinos.forEach(b => {
      const grupoNombre = b.GRUPO?.nombre || 'Sin grupo'
      gruposCont[grupoNombre] = (gruposCont[grupoNombre] || 0) + 1
    })

    distribucionGrupos.value = Object.entries(gruposCont).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }))

    crearGraficos(bovinos, ordenios, ventas, compras)
  } catch (error) {
    console.error('Error:', error)
  }
}

function crearGraficos(bovinos, ordenios, ventas, compras) {
  // ═══════ GRÁFICO 1: Producción (Premium Line) ═══════
  if (produccionChart.value) {
    const ultimos7Dias = []
    const produccionPorDia = []

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const fechaStr = fecha.toISOString().split('T')[0]
      const nombreDia = fecha.toLocaleDateString('es-DO', { weekday: 'short' })
      
      ultimos7Dias.push(nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1))
      
      const ordeniosDia = ordenios.filter(o => o.fecha === fechaStr)
      const totalDia = ordeniosDia.reduce((sum, o) => sum + parseFloat(o.cantidad_total || 0), 0)
      produccionPorDia.push(totalDia.toFixed(1))
    }

    new Chart(produccionChart.value, {
      type: 'line',
      data: {
        labels: ultimos7Dias,
        datasets: [{
          label: 'Litros',
          data: produccionPorDia,
          borderColor: '#3b6934',
          backgroundColor: 'rgba(59, 105, 52, 0.05)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#3b6934',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            padding: 14,
            titleFont: { size: 13, weight: '700', family: 'Manrope' },
            bodyFont: { size: 12, family: 'Manrope' },
            borderColor: '#3b6934',
            borderWidth: 2,
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y}L`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { 
              color: '#f5f5f5',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              font: { size: 10, weight: '600', family: 'Manrope' },
              color: '#9ca3af',
              callback: (v) => v + 'L'
            },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10, weight: '600', family: 'Manrope' },
              color: '#9ca3af'
            },
            border: { display: false }
          }
        }
      }
    })
  }

  // ═══════ GRÁFICO 2: Dona Premium ═══════
  if (hatoChart.value) {
    const labels = distribucionGrupos.value.map(g => g.nombre)
    const datos = distribucionGrupos.value.map(g => g.cantidad)

    new Chart(hatoChart.value, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: datos,
          backgroundColor: coloresPremium,
          borderWidth: 0,
          spacing: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            padding: 12,
            bodyFont: { size: 12, weight: '600', family: 'Manrope' },
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    })
  }

  // ═══════ GRÁFICO 3: Barras Premium ═══════
  if (ventasComprasChart.value) {
    const mesesLabels = []
    const ventasPorMes = []
    const comprasPorMes = []

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - i)
      const mes = fecha.toLocaleDateString('es-DO', { month: 'short' })
      mesesLabels.push(mes.charAt(0).toUpperCase() + mes.slice(1))

      const mesNum = fecha.getMonth()
      const añoNum = fecha.getFullYear()

      ventasPorMes.push(ventas.filter(v => {
        const f = new Date(v.fecha)
        return f.getMonth() === mesNum && f.getFullYear() === añoNum
      }).length)

      comprasPorMes.push(compras.filter(c => {
        const f = new Date(c.fecha)
        return f.getMonth() === mesNum && f.getFullYear() === añoNum
      }).length)
    }

    new Chart(ventasComprasChart.value, {
      type: 'bar',
      data: {
        labels: mesesLabels,
        datasets: [
          {
            label: 'Ventas',
            data: ventasPorMes,
            backgroundColor: '#3b6934',
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 20
          },
          {
            label: 'Compras',
            data: comprasPorMes,
            backgroundColor: '#d5c3b5',
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 20
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              padding: 14,
              font: { size: 11, weight: '700', family: 'Manrope' },
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#6b7280'
            }
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            padding: 10,
            borderWidth: 2,
            borderColor: '#3b6934',
            bodyFont: { family: 'Manrope' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              stepSize: 1,
              font: { size: 10, weight: '600', family: 'Manrope' },
              color: '#9ca3af'
            },
            grid: { color: '#f5f5f5', drawBorder: false },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: { 
              font: { size: 10, weight: '600', family: 'Manrope' },
              color: '#9ca3af'
            },
            border: { display: false }
          }
        }
      }
    })
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.dashboard-premium {
  min-height: 100vh;
  background: #fcfbfb;
  font-family: 'Manrope', sans-serif;
  padding: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #ece0d9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: 128px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: #837468;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-icon {
  font-size: 1.125rem;
}

.icon-green { color: #3b6934; }
.icon-amber { color: #6e420c; }
.icon-gray { color: #9ca3af; }

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #201b16;
  letter-spacing: -0.025em;
  line-height: 1;
}

.stat-unit {
  font-size: 0.875rem;
  font-weight: 400;
  color: #9ca3af;
  margin-left: 0.25rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  font-weight: 500;
}

.stat-trend .material-symbols-outlined {
  font-size: 0.75rem;
}

.trend-up { color: #3b6934; }
.trend-green { color: #3b6934; }
.trend-neutral { color: #837468; }

/* Main Charts */
.main-charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border: 1px solid #ece0d9;
  border-radius: 0.75rem;
  padding: 2rem;
}

.chart-large {
  grid-column: span 1;
}

.chart-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.chart-title-premium {
  font-size: 0.875rem;
  font-weight: 700;
  color: #201b16;
  margin: 0;
}

.chart-subtitle-premium {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.bg-green { background: #3b6934; }
.bg-amber { background: #6e420c; }

.legend-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: #837468;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chart-container-large {
  height: 256px;
  width: 100%;
}

.chart-container-medium {
  height: 240px;
  width: 100%;
}

/* Donut Chart */
.donut-wrapper {
  max-width: 192px;
  margin: 0 auto 2rem;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.legend-item-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot-sm {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  color: #51453a;
  font-weight: 500;
}

.legend-value {
  font-weight: 700;
  color: #201b16;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Goals */
.goals-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}

.goal-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #51453a;
}

.goal-icon {
  font-size: 0.875rem;
}

.goal-percent {
  font-size: 1.125rem;
  font-weight: 800;
}

.goal-percent.green { color: #3b6934; }
.goal-percent.amber { color: #6e420c; }

.progress-bar {
  height: 4px;
  background: #f7ece4;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.4s ease;
}

/* Summary Grid */
.summary-grid-premium {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-item-premium {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fdf1ea;
  border-radius: 0.5rem;
}

.summary-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.summary-label {
  font-size: 0.625rem;
  color: #837468;
  font-weight: 500;
  margin: 0;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #201b16;
  margin: 0.25rem 0 0 0;
  line-height: 1;
}

.mb-6 { margin-bottom: 1.5rem; }

@media (max-width: 1024px) {
  .main-charts {
    grid-template-columns: 1fr;
  }
  
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-premium {
    padding: 1rem;
  }
}
</style>