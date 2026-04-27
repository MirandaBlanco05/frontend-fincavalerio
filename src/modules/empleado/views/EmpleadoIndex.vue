<template>
  <div class="empleado-root">

    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="checkbox-menu">
          <input type="checkbox" class="checkbox-toggle" />
        </div>
        <h1 class="page-title">Gestión de Empleados</h1>
      </div>
      <div class="header-search">
        <input 
          v-model="busqueda" 
          type="text" 
          placeholder="Buscar por nombre o cédula..." 
          class="search-input"
        />
        <button class="btn-icon-search">
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>

    <!-- Card Formulario -->
    <div class="form-card">
      <div class="form-header">
        <div class="checkbox-toggle-wrap">
          <input type="checkbox" class="checkbox-toggle" />
        </div>
        <h2 class="form-title">Nuevo Empleado</h2>
        <button @click="limpiarForm" class="btn-limpiar">
          <span class="material-symbols-outlined">restart_alt</span>
          Limpiar
        </button>
      </div>

      <form @submit.prevent="guardarEmpleado" class="form-grid">
        
        <!-- Nombre completo -->
        <div class="form-group span-full">
          <label class="form-label required">
            <span class="material-symbols-outlined">person</span>
            Nombre completo
          </label>
          <input 
            v-model="form.nombre" 
            type="text" 
            placeholder="Ej: Juan Antonio Pérez"
            class="form-input"
            required
          />
        </div>

        <!-- Nacionalidad y Cédula -->
        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">flag</span>
            Nacionalidad
          </label>
          <select v-model="form.nacionalidad" class="form-select" required>
            <option value="">-- Seleccionar --</option>
            <option value="Dominicana">Dominicana</option>
            <option value="Haitiana">Haitiana</option>
            <option value="Venezolana">Venezolana</option>
            <option value="Otra">Otra</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">badge</span>
            Cédula
          </label>
          <input 
            v-model="form.cedula" 
            type="text" 
            placeholder="Ej: 001-0000000-0"
            class="form-input"
          />
        </div>

        <!-- Teléfono y Salario -->
        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">phone</span>
            Teléfono
          </label>
          <input 
            v-model="form.telefono" 
            type="tel" 
            placeholder="Ej: 809-000-0000"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">payments</span>
            Salario (RD$)
          </label>
          <input 
            v-model="form.salario" 
            type="number" 
            step="0.01"
            placeholder="Ej: 15000"
            class="form-input"
          />
        </div>

        <!-- Botón submit -->
        <div class="span-full">
          <button type="submit" :disabled="store.cargando" class="btn-submit">
            <span class="material-symbols-outlined">save</span>
            {{ store.cargando ? 'Guardando...' : 'Guardar Empleado' }}
          </button>
        </div>

      </form>
    </div>

    <!-- Card Tabla -->
    <div class="table-card">
      <div class="table-header">
        <div class="checkbox-toggle-wrap">
          <input type="checkbox" class="checkbox-toggle" />
        </div>
        <h2 class="table-title">Empleados Registrados</h2>
        <button @click="store.cargarEmpleados()" class="btn-actualizar">
          <span class="material-symbols-outlined">refresh</span>
          Actualizar
        </button>
      </div>

      <!-- Loading / Empty -->
      <div v-if="store.cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando empleados...</p>
      </div>

      <div v-else-if="empleadosFiltrados.length === 0" class="empty-state">
        <span class="material-symbols-outlined">group_off</span>
        <p>No hay empleados registrados</p>
      </div>

      <!-- Tabla -->
      <div v-else class="table-wrapper">
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>EMPLEADO</th>
              <th>NACIONALIDAD</th>
              <th>CÉDULA</th>
              <th>TELÉFONO</th>
              <th>SALARIO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(empleado, index) in empleadosFiltrados" :key="empleado.Id_empleado">
              <td class="text-center font-bold">{{ index + 1 }}</td>
              <td class="font-bold">{{ empleado.nombre }}</td>
              <td>{{ empleado.nacionalidad }}</td>
              <td class="font-mono">{{ empleado.cedula || '—' }}</td>
              <td class="font-mono">{{ empleado.telefono }}</td>
              <td class="text-right font-bold">{{ formatearSalario(empleado.salario) }}</td>
              <td>
                <div class="acciones">
                  <button @click="editarEmpleado(empleado)" class="btn-icon btn-icon--edit" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button @click="confirmarEliminar(empleado)" class="btn-icon btn-icon--delete" title="Eliminar">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal confirmación eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Empleado</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar a <strong>{{ empleadoAEliminar?.nombre }}</strong>?</p>
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarEmpleado" class="btn btn--danger">
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
import { useEmpleadoStore } from '@/modules/empleado/store/empleado.store.js'

const store = useEmpleadoStore()
const busqueda = ref('')
const modalEliminar = ref(false)
const empleadoAEliminar = ref(null)
const esEdicion = ref(false)

const form = reactive({
  id: null,
  nombre: '',
  nacionalidad: '',
  cedula: '',
  telefono: '',
  salario: ''
})

const empleadosFiltrados = computed(() => {
  if (!busqueda.value) return store.empleados
  const query = busqueda.value.toLowerCase()
  return store.empleados.filter(emp => 
    emp.nombre?.toLowerCase().includes(query) ||
    emp.cedula?.toLowerCase().includes(query)
  )
})

function limpiarForm() {
  form.id = null
  form.nombre = ''
  form.nacionalidad = ''
  form.cedula = ''
  form.telefono = ''
  form.salario = ''
  esEdicion.value = false
}

async function guardarEmpleado() {
  const datos = {
    nombre: form.nombre,
    nacionalidad: form.nacionalidad,
    cedula: form.cedula || null,
    telefono: form.telefono,
    salario: form.salario ? parseFloat(form.salario) : null
  }

  let exito = false
  if (esEdicion.value) {
    exito = await store.actualizarEmpleado(form.id, datos)
  } else {
    exito = await store.crearEmpleado(datos)
  }

  if (exito) limpiarForm()
}

function editarEmpleado(empleado) {
  form.id = empleado.Id_empleado
  form.nombre = empleado.nombre
  form.nacionalidad = empleado.nacionalidad
  form.cedula = empleado.cedula || ''
  form.telefono = empleado.telefono
  form.salario = empleado.salario || ''
  esEdicion.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function confirmarEliminar(empleado) {
  empleadoAEliminar.value = empleado
  modalEliminar.value = true
}

async function eliminarEmpleado() {
  if (!empleadoAEliminar.value) return
  const exito = await store.eliminarEmpleado(empleadoAEliminar.value.Id_empleado)
  if (exito) {
    modalEliminar.value = false
    empleadoAEliminar.value = null
  }
}

function formatearSalario(salario) {
  if (!salario) return '—'
  return `RD$ ${parseFloat(salario).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`
}

onMounted(() => {
  store.cargarEmpleados()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.empleado-root {
  font-family: 'DM Sans', sans-serif;
  background: #f5f7f5;
  min-height: 100vh;
  padding: 2rem;
}

/* ── Page Header ──────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkbox-menu {
  display: flex;
  align-items: center;
}

.checkbox-toggle {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #2d5a2d;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2d5a2d;
  margin: 0;
}

.header-search {
  position: relative;
  flex: 1;
  max-width: 450px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1.25rem;
  border: 2px solid #d4e4d4;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1b1b1b;
  background: white;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4c9a4c;
}

.btn-icon-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-icon-search:hover {
  background: #f3f4f6;
  color: #4c9a4c;
}

/* ── Cards ────────────────────────────────── */
.form-card, .table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border: 2px solid #e8f3e8;
  margin-bottom: 2rem;
}

.form-header, .table-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f0f8f0;
}

.checkbox-toggle-wrap {
  display: flex;
  align-items: center;
}

.form-title, .table-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 800;
  color: #2d5a2d;
  margin: 0;
}

.btn-limpiar, .btn-actualizar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.65rem 1.25rem;
  background: #f0f8f0;
  border: 2px solid #d4e4d4;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2d5a2d;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-limpiar:hover, .btn-actualizar:hover {
  background: #e8f3e8;
  border-color: #4c9a4c;
}

/* ── Form ─────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.span-full {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.form-label .material-symbols-outlined {
  font-size: 1rem;
  color: #4c9a4c;
}

.form-label.required::after {
  content: ' *';
  color: #dc2626;
}

.form-input, .form-select {
  padding: 0.85rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: border-color 0.2s;
  background: #fafafa;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4c9a4c;
  background: white;
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

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1rem;
  background: #2d5a2d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #1f4a1f;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Table ────────────────────────────────── */
.loading-state, .empty-state {
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
  border: 3px solid #f0f8f0;
  border-top-color: #4c9a4c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state .material-symbols-outlined {
  font-size: 4rem;
  color: #d1d5db;
}

.empty-state p {
  color: #6b7280;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  background: #f0f8f0;
}

.tabla th {
  padding: 1rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 800;
  color: #2d5a2d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e8f3e8;
}

.tabla td {
  padding: 1rem;
  font-size: 0.9rem;
  color: #1a1a1a;
  border-bottom: 1px solid #f5f5f5;
}

.tabla tr:hover {
  background: #fafafa;
}

.font-mono { font-family: 'Courier New', monospace; }
.font-bold { font-weight: 700; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: #9ca3af; font-style: italic; }

.acciones {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-icon {
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-icon .material-symbols-outlined {
  font-size: 1.1rem;
}

.btn-icon--edit { color: #4c9a4c; }
.btn-icon--edit:hover { background: #e8f3e8; }

.btn-icon--delete { color: #dc2626; }
.btn-icon--delete:hover { background: #fef2f2; }

/* ── Modal ────────────────────────────────── */
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

.modal-header--danger .material-symbols-outlined {
  font-size: 3rem;
  color: #dc2626;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  text-align: center;
}

.modal-body {
  padding: 2rem;
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

.text-sm { font-size: 0.85rem; }

/* ── Responsive ───────────────────────────── */
@media (max-width: 968px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-search {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .empleado-root {
    padding: 1.5rem 1rem;
  }

  .form-grid {
    padding: 1.5rem;
  }

  .table-wrapper {
    font-size: 0.85rem;
  }
}
</style>