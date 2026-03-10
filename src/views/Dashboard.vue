<template>
  <div class="dashboard-root">

    <!-- Contenido -->
    <div class="dashboard-content">
      <div class="cards-wrapper">

        <!-- Card Bovinos -->
        <RouterLink to="/bovinos" class="card card--clickable">
          <div class="card-icon">
            <span class="material-symbols-outlined">pets</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">Bovinos</h3>
            <p class="card-desc">Registro y gestión del ganado</p>
            <div class="card-metric">
              <div class="metric-bar">
                <div class="metric-bar__fill" :style="`width: ${porcentajeBovinos}%`"></div>
              </div>
              <span class="metric-label">{{ totalBovinos }} Cabezas</span>
            </div>
          </div>
          <span class="card-arrow material-symbols-outlined">chevron_right</span>
        </RouterLink>

        <!-- Card Visitas -->
        <RouterLink to="/visitas" class="card card--clickable">
          <div class="card-icon card-icon--green">
            <span class="material-symbols-outlined">medical_services</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">Visitas Veterinarias</h3>
            <p class="card-desc">Control de visitas y tratamientos</p>
          </div>
          <span class="card-arrow material-symbols-outlined">chevron_right</span>
        </RouterLink>

        <!-- Card Ciclo Celo -->
        <RouterLink to="/celo" class="card card--clickable">
          <div class="card-icon card-icon--pink">
            <span class="material-symbols-outlined">favorite</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">Ciclo Celo</h3>
            <p class="card-desc">Registro de ciclos reproductivos</p>
          </div>
          <span class="card-arrow material-symbols-outlined">chevron_right</span>
        </RouterLink>
        <!-- Card Inseminación -->
<RouterLink to="/inseminaciones" class="card card--clickable">
  <div class="card-icon card-icon--blue">
    <span class="material-symbols-outlined">biotech</span>
  </div>

  <div class="card-body">
    <h3 class="card-title">Inseminación</h3>
    <p class="card-desc">Registro de inseminaciones realizadas</p>
  </div>

  <span class="card-arrow material-symbols-outlined">
    chevron_right
  </span>
</RouterLink>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/core/api/axios.js'

const totalBovinos = ref(0)

const porcentajeBovinos = computed(() => {
  const max = 300
  return Math.min((totalBovinos.value / max) * 100, 100)
})

async function cargarDatos() {
  try {
    const { data } = await api.get('/bovino/listar')
    totalBovinos.value = data.length
  } catch (error) {
    console.error('Error cargando bovinos:', error)
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.dashboard-root {
  min-height: calc(100vh - 64px);
  background: #f8f8f6;
  font-family: 'DM Sans', sans-serif;
}

/* ── Content ─────────────────────────────── */
.dashboard-content {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
}

/* ── Cards ───────────────────────────────── */
.card {
  position: relative;
  display: flex;
  gap: 1.25rem;
  padding: 1.75rem;
  background: white;
  border-radius: 20px;
  text-decoration: none;
  border: 1.5px solid #f0f0ed;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.04),
    0 1px 3px rgba(0,0,0,0.03);
  border-color: #e0e0dd;
}

/* Card icon */
.card-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #f3eee7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b6f47;
}

.card-icon .material-symbols-outlined {
  font-size: 1.7rem;
}

.card-icon--green {
  background: #e7f3e7;
  color: #4c9a4c;
}

.card-icon--pink {
  background: #fce7f3;
  color: #db2777;
}

/* Card body */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.15rem;
}

.card-desc {
  font-size: 0.85rem;
  line-height: 1.55;
  color: #7a7a7a;
  font-weight: 500;
}

/* Card arrow */
.card-arrow {
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #d4d4d0;
  transition: transform 0.25s, color 0.25s;
}

.card--clickable:hover .card-arrow {
  transform: translateY(-50%) translateX(3px);
  color: #8b6f47;
}

/* Card metric bar */
.card-metric {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #f0f0ed;
  border-radius: 10px;
  overflow: hidden;
}

.metric-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #8b6f47 0%, #a68964 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.metric-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #5a5a5a;
  white-space: nowrap;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 768px) {
  .cards-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-content {
    padding: 2rem 1.25rem;
  }

  .card {
    padding: 1.5rem;
  }
}
</style>
