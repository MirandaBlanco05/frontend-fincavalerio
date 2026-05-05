<template>
  <div class="dashboard-root">

    <!-- Contenido -->
    <div class="dashboard-content">
      <div class="cards-wrapper">

        <!-- Card Bovinos -->
        <RouterLink to="/bovinos" class="card card--clickable">
          <div class="card-icon">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 18a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5m3 0a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5M10 11a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 7c0 2.21-2.69 4-6 4s-6-1.79-6-4c0-.9.45-1.73 1.2-2.4c-.75-1-1.2-2.25-1.2-3.6l.12-1.22c-.54.15-1.19.15-1.72 0c-1.02-.28-2.56-1.43-2.33-2.23s2.14-.95 3.16-.65c.59.17 1.22.6 1.59 1.06l.57-.81C6.79 7.05 7 4 10 3l-.09.14c-.28.44-1 1.83-.24 3.33a6.02 6.02 0 0 1 4.66 0c.76-1.5.04-2.89-.24-3.33L14 3c3 1 3.21 4.05 2.61 5.15l.57.81c.37-.46 1-.89 1.59-1.06c1.02-.3 2.93-.15 3.16.65s-1.31 1.95-2.33 2.23c-.53.15-1.18.15-1.72 0L18 12c0 1.35-.45 2.6-1.2 3.6c.75.67 1.2 1.5 1.2 2.4m-6-2c-2.21 0-4 .9-4 2s1.79 2 4 2s4-.9 4-2s-1.79-2-4-2m0-2c1.12 0 2.17.21 3.07.56c.58-.69.93-1.56.93-2.56a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1 .35 1.87.93 2.56c.9-.35 1.95-.56 3.07-.56m2.09-10.86"/></svg>
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

        <!-- Card Compras -->
        <RouterLink to="/compra" class="card card--clickable">
          <div class="card-icon card-icon--orange">
            <span class="material-symbols-outlined">inventory_2</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">Compras</h3>
            <p class="card-desc">Registro de compras y proveedores</p>
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

        <!-- Card Embarazo -->
        <RouterLink to="/embarazos" class="card card--clickable">
          <div class="card-icon card-icon--purple">
            <span class="material-symbols-outlined">monitor_heart</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">Embarazo</h3>
            <p class="card-desc">Seguimiento de gestaciones</p>
          </div>
          <span class="card-arrow material-symbols-outlined">chevron_right</span>
        </RouterLink>

        <!-- Card Parto -->
        <RouterLink to="/partos" class="card card--clickable">
          <div class="card-icon card-icon--orange">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 18a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5m3 0a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5M10 11a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 7c0 2.21-2.69 4-6 4s-6-1.79-6-4c0-.9.45-1.73 1.2-2.4c-.75-1-1.2-2.25-1.2-3.6l.12-1.22c-.54.15-1.19.15-1.72 0c-1.02-.28-2.56-1.43-2.33-2.23s2.14-.95 3.16-.65c.59.17 1.22.6 1.59 1.06l.57-.81C6.79 7.05 7 4 10 3l-.09.14c-.28.44-1 1.83-.24 3.33a6.02 6.02 0 0 1 4.66 0c.76-1.5.04-2.89-.24-3.33L14 3c3 1 3.21 4.05 2.61 5.15l.57.81c.37-.46 1-.89 1.59-1.06c1.02-.3 2.93-.15 3.16.65s-1.31 1.95-2.33 2.23c-.53.15-1.18.15-1.72 0L18 12c0 1.35-.45 2.6-1.2 3.6c.75.67 1.2 1.5 1.2 2.4m-6-2c-2.21 0-4 .9-4 2s1.79 2 4 2s4-.9 4-2s-1.79-2-4-2m0-2c1.12 0 2.17.21 3.07.56c.58-.69.93-1.56.93-2.56a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1 .35 1.87.93 2.56c.9-.35 1.95-.56 3.07-.56m2.09-10.86"/></svg>
          </div>
          <div class="card-body">
            <h3 class="card-title">Parto</h3>
            <p class="card-desc">Registro de nacimientos y crías</p>
          </div>
          <span class="card-arrow material-symbols-outlined">chevron_right</span>
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
  min-height: auto;
  background: #f8f8f6;
  font-family: 'DM Sans', sans-serif;
}

/* ── Content ─────────────────────────────── */
.dashboard-content {
  padding: 0.75rem 2rem 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  max-width: 1000px;
}

/* ── Cards ───────────────────────────────── */
.card {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
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
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #f3eee7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b6f47;
}

.card-icon .material-symbols-outlined {
  font-size: 1.5rem;
}

.card-icon--green {
  background: #e7f3e7;
  color: #4c9a4c;
}

.card-icon--pink {
  background: #fce7f3;
  color: #db2777;
}

.card-icon--blue {
  background: #e0f2fe;
  color: #0284c7;
}

.card-icon--purple {
  background: #f3e8ff;
  color: #9333ea;
}

.card-icon--orange {
  background: #ffedd5;
  color: #ea580c;
}

/* Card body */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0;
}

.card-desc {
  font-size: 0.8rem;
  line-height: 1.4;
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
