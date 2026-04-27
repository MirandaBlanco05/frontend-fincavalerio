<template>
  <div class="ordenio-root">

    <!-- Header -->
    <div class="header-section">
      <div>
        <h2 class="title">Registro de Ordeño</h2>
        <p class="subtitle">Gestión de producción láctea individual</p>
      </div>
      <button @click="limpiarForm" class="btn-nuevo">
        <span class="material-symbols-outlined">add_circle</span>
        Nuevo Ordeño
      </button>
    </div>

    <!-- Form card -->
    <div class="form-card">
      <form @submit.prevent="guardarOrdenio" class="form">

        <!-- ID Ordeño (readonly) -->
        <div class="form-group">
          <label class="form-label">ID Ordeño</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">tag</span>
            <input 
              v-model="idOrdenioGenerado" 
              type="text" 
              class="form-input input-readonly" 
              readonly 
            />
          </div>
        </div>

        <!-- Vaca -->
        <div class="form-group">
          <label class="form-label">Vaca (ID o Nombre)</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">pets</span>
            <select v-model="form.Id_bovino" class="form-select" required>
              <option value="">Seleccione vaca (ej. 25 - Margarita)</option>
              <option v-for="bovino in bovinos" :key="bovino.id_bovino" :value="bovino.id_bovino">
                {{ bovino.id_bovino }} - {{ bovino.nombre }}
              </option>
            </select>
          </div>
        </div>

        <!-- Grid 2 columnas: Empleado y Fecha -->
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">ID Empleado</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">badge</span>
              <select v-model="form.Id_empleado" class="form-select" required>
                <option value="">Seleccione empleado</option>
                <option v-for="emp in empleados" :key="emp.Id_empleado" :value="emp.Id_empleado">
                  EMP-{{ emp.Id_empleado }} - {{ emp.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fecha</label>
            <div class="input-wrapper">
              <span class="material-symbols-outlined input-icon">calendar_today</span>
              <input v-model="form.fecha" type="date" class="form-input" required />
            </div>
          </div>
        </div>

        <!-- Momento del día (toggle buttons) -->
        <div class="form-group">
          <label class="form-label">Momento del Día</label>
          <div class="toggle-group">
            <button 
              type="button"
              @click="form.Momento_dia = 'Mañana'"
              :class="{ 'active': form.Momento_dia === 'Mañana' }"
              class="toggle-btn">
              <span class="material-symbols-outlined">light_mode</span>
              Mañana
            </button>
            <button 
              type="button"
              @click="form.Momento_dia = 'Tarde'"
              :class="{ 'active': form.Momento_dia === 'Tarde' }"
              class="toggle-btn">
              <span class="material-symbols-outlined">dark_mode</span>
              Tarde
            </button>
          </div>
        </div>

        <!-- Cantidad total -->
        <div class="form-group">
          <label class="form-label">Cantidad Total (Litros)</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">opacity</span>
            <input 
              v-model="form.Cantidad_total" 
              type="number" 
              step="0.1" 
              placeholder="0.00"
              class="form-input input-numero"
              required
            />
            <span class="input-suffix">LITROS</span>
          </div>
        </div>

        <!-- Botón submit -->
        <button type="submit" :disabled="store.cargando" class="btn-submit">
          <span class="material-symbols-outlined">water_drop</span>
          {{ store.cargando ? 'Guardando...' : 'Guardar Registro' }}
        </button>

      </form>
    </div>

    <!-- Tabla limpia -->
    <div class="table-card">
      <div v-if="store.cargando" class="loading">
        <div class="spinner"></div>
        <p>Cargando registros...</p>
      </div>

      <div v-else-if="store.ordenios.length === 0" class="empty">
        <span class="material-symbols-outlined">event_busy</span>
        <p>No hay ordeños registrados</p>
      </div>

      <table v-else class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>VACA</th>
            <th>EMPLEADO</th>
            <th>FECHA</th>
            <th>MOMENTO</th>
            <th>CANTIDAD (L)</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ord in store.ordenios" :key="ord.Id_ordenio">
            <td class="font-bold">#ORD-{{ ord.Id_ordenio }}</td>
            <td class="font-bold text-dark">{{ ord.BOVINO?.nombre || 'N/A' }}</td>
            <td>EMP-{{ ord.Id_empleado }}</td>
            <td>{{ formatearFecha(ord.fecha) }}</td>
            <td>
              <span class="badge" :class="badgeMomento(ord.Momento_dia)">
                {{ ord.Momento_dia || '—' }}
              </span>
            </td>
            <td class="text-right font-bold">{{ ord.Cantidad_total || '0' }} L</td>
            <td>
              <div class="acciones">
                <button @click="editarOrdenio(ord)" class="btn-icon btn-icon--edit">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="confirmarEliminar(ord)" class="btn-icon btn-icon--delete">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content">
          <div class="modal-header">
            <span class="material-symbols-outlined text-red-600">warning</span>
            <h3 class="modal-title">Eliminar Ordeño</h3>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar este registro de ordeño?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarOrdenio" class="btn btn--danger">
              <span class="material-symbols-outlined">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useOrdenioStore } from '@/modules/ordenio/store/ordenio.store.js'
import api from '@/core/api/axios.js'

const store = useOrdenioStore()
const bovinos = ref([])
const empleados = ref([])
const modalEliminar = ref(false)
const ordenioAEliminar = ref(null)
const esEdicion = ref(false)

const form = reactive({
  id: null,
  Id_bovino: '',
  Id_empleado: '',
  fecha: new Date().toISOString().split('T')[0],
  Momento_dia: 'Mañana',
  Cantidad_total: ''
})

const idOrdenioGenerado = computed(() => {
  if (esEdicion.value && form.id) {
    return `#ORD-${form.id}`
  }
  return '#ORD-NUEVO'
})

async function cargarBovinos() {
  try {
    const { data } = await api.get('/bovino/listar')
    bovinos.value = data
  } catch (error) {
    console.error('Error cargando bovinos:', error)
  }
}

async function cargarEmpleados() {
  try {
    const { data } = await api.get('/empleado')
    empleados.value = data
  } catch (error) {
    console.error('Error cargando empleados:', error)
  }
}

async function guardarOrdenio() {
  const datos = {
    Id_bovino: parseInt(form.Id_bovino),
    Id_empleado: parseInt(form.Id_empleado),
    fecha: form.fecha,
    Momento_dia: form.Momento_dia,
    Cantidad_total: form.Cantidad_total.toString()
  }

  let exito = false
  if (esEdicion.value) {
    exito = await store.actualizarOrdenio(form.id, datos)
  } else {
    exito = await store.crearOrdenio(datos)
  }

  if (exito) limpiarForm()
}

function limpiarForm() {
  form.id = null
  form.Id_bovino = ''
  form.Id_empleado = ''
  form.fecha = new Date().toISOString().split('T')[0]
  form.Momento_dia = 'Mañana'
  form.Cantidad_total = ''
  esEdicion.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function editarOrdenio(ordenio) {
  form.id = ordenio.Id_ordenio
  form.Id_bovino = ordenio.Id_bovino
  form.Id_empleado = ordenio.Id_empleado
  form.fecha = ordenio.fecha
  form.Momento_dia = ordenio.Momento_dia || 'Mañana'
  form.Cantidad_total = ordenio.Cantidad_total || ''
  esEdicion.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function confirmarEliminar(ordenio) {
  ordenioAEliminar.value = ordenio
  modalEliminar.value = true
}

async function eliminarOrdenio() {
  if (!ordenioAEliminar.value) return
  const exito = await store.eliminarOrdenio(ordenioAEliminar.value.Id_ordenio)
  if (exito) {
    modalEliminar.value = false
    ordenioAEliminar.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function badgeMomento(momento) {
  return momento === 'Mañana' ? 'badge--manana' : 'badge--tarde'
}

onMounted(() => {
  store.cargarOrdenios()
  cargarBovinos()
  cargarEmpleados()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.ordenio-root {
  font-family: 'DM Sans', sans-serif;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  background: #fafafa;
  min-height: 100vh;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
}

.btn-nuevo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  background: #6E420C;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nuevo:hover {
  background: #5a360a;
  transform: translateY(-1px);
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: rgba(110,66,12,0.5);
  font-size: 1.25rem;
  pointer-events: none;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: #1b150e;
  background: white;
  transition: all 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #6e420c;
}

.input-readonly {
  background: #f8f7f6;
  color: #97764e;
  font-weight: 500;
  cursor: not-allowed;
}

.input-numero {
  font-size: 1.125rem;
  font-weight: 700;
  padding-right: 5rem;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  color: #97764e;
  font-weight: 700;
  font-size: 0.875rem;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

/* Toggle buttons */
.toggle-group {
  display: flex;
  padding: 4px;
  background: #f8f7f6;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #97764e;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #6e420c;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Botón submit */
.btn-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #6e420c;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(110,66,12,0.2);
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #5a360a;
  transform: scale(0.98);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.loading, .empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0ede8;
  border-top-color: #6e420c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty .material-symbols-outlined {
  font-size: 4rem;
  color: #d1d5db;
}

/* Tabla limpia espaciada */
.tabla {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.tabla thead {
  background: #fafafa;
}

.tabla th {
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid #f0f0f0;
}

.tabla td {
  padding: 1.5rem 1.5rem;
  font-size: 0.95rem;
  color: #4b5563;
  border-bottom: 1px solid #f5f5f5;
  font-weight: 500;
}

.tabla tbody tr {
  transition: background 0.15s;
}

.tabla tbody tr:hover {
  background: #fafafa;
}

.font-bold { 
  font-weight: 700;
  color: #1a1a1a;
}

.text-dark {
  color: #1a1a1a;
}

.text-right { 
  text-align: right; 
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--manana {
  background: #fef3c7;
  color: #b45309;
}

.badge--tarde {
  background: #e0e7ff;
  color: #4338ca;
}

.acciones {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon .material-symbols-outlined {
  font-size: 1.2rem;
}

.btn-icon--edit { color: #6e420c; }
.btn-icon--edit:hover { background: #faf9f6; }

.btn-icon--delete { color: #dc2626; }
.btn-icon--delete:hover { background: #fef2f2; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-header .material-symbols-outlined {
  font-size: 3rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  text-align: center;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 1.5rem 2rem;
  border-top: 1.5px solid #f0f0ed;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--secondary {
  background: #f5f5f5;
  color: #374151;
}

.btn--secondary:hover {
  background: #e5e7eb;
}

.btn--danger {
  background: #dc2626;
  color: white;
}

.btn--danger:hover {
  background: #b91c1c;
}

/* Responsive */
@media (max-width: 640px) {
  .ordenio-root {
    padding: 1.5rem 1rem;
  }

  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>