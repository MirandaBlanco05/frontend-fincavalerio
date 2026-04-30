<template>
  <div class="relative min-h-screen w-full p-0">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo -->
      <button
        @click="mostrarModal = true"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Ciclo</span>
      </button>

      <!-- Editar -->
      <button
        @click="editarCiclo(filaSeleccionada)"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar -->
      <button
        @click="confirmarEliminar(filaSeleccionada)"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <!-- Búsqueda -->
      <div class="relative flex flex-1 items-center min-w-[200px] sm:flex-none">
        <span class="material-symbols-outlined absolute left-3 text-gray-400 text-base">search</span>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar..."
          class="w-full rounded-lg border border-border-color bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <!-- Tabla de ciclos -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID Ciclo</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Fecha Inicio</th>
            <th class="px-6 py-4">Fecha Fin</th>
            <th class="px-6 py-4">Duración</th>
            <th class="px-6 py-4">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando ciclos...</p>
            </td>
          </tr>
          <tr v-else-if="ciclosFiltrados.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay ciclos registrados.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="ciclo in ciclosFiltrados"
            :key="ciclo.Id_ciclo"
            @click="seleccionarFila(ciclo)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.Id_ciclo === ciclo.Id_ciclo }"
          >
            <td class="px-6 py-3 font-medium">{{ ciclo.Id_ciclo }}</td>
            <td class="px-6 py-3 font-bold">{{ ciclo.bovino?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ciclo.Fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ciclo.Fecha_fin) }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {{ ciclo.duracion || calcularDuracion(ciclo.Fecha_inicio, ciclo.Fecha_fin) }} días
              </span>
            </td>
            <td class="px-6 py-3 text-gray-500 italic">{{ ciclo.observaciones || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ esEdicion ? 'Editar' : 'Nuevo' }} Ciclo Celo</h3>
              <p class="modal-subtitle">Complete los datos del ciclo reproductivo</p>
            </div>
            <button @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardarCiclo" class="modal-body">

            <!-- ID Ciclo (solo lectura si es edición) -->
            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">tag</span>
                ID Ciclo
              </label>
              <input v-model="form.idCiclo" type="text" class="form-input" placeholder="C-2023-089" 
                :disabled="esEdicion" :class="{ 'input-disabled': esEdicion }" />
            </div>

            <!-- Bovino -->
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">pets</span>
                Bovino
              </label>
              <select v-model="form.Id_bovino" class="form-select" required>
                <option value="">Seleccione el ejemplar</option>
                <option v-for="bovino in bovinos" :key="bovino.id_bovino" :value="bovino.id_bovino">
                  {{ bovino.nombre }} ({{ bovino.id_bovino }})
                </option>
              </select>
            </div>

            <!-- Fechas en grid 2 columnas -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">event</span>
                  Fecha Inicio
                </label>
                <input v-model="form.Fecha_inicio" type="date" class="form-input" required />
              </div>

              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">event</span>
                  Fecha Fin
                </label>
                <input v-model="form.Fecha_fin" type="date" class="form-input" required />
              </div>
            </div>

            <!-- Duración (calculada automáticamente) -->
            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">schedule</span>
                Duración (Días)
              </label>
              <div class="duracion-display">
                <span class="duracion-value">{{ duracionCalculada }}</span>
                <span class="duracion-label">días</span>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">notes</span>
                Observaciones
              </label>
              <textarea v-model="form.observaciones" rows="3" class="form-textarea"
                placeholder="Detalles sobre el comportamiento..."></textarea>
            </div>

            <!-- Botones -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn btn--secondary">Cancelar</button>
              <button type="submit" :disabled="store.cargando" class="btn btn--primary">
                <span class="material-symbols-outlined">save</span>
                {{ store.cargando ? 'Guardando...' : 'Guardar Registro' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal confirmación eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined text-red-600">warning</span>
            <h3 class="modal-title">Eliminar Ciclo</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este ciclo de celo?</p>
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarCiclo" class="btn btn--danger">
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
import { useCeloStore } from '@/modules/celo/store/celo.store.js'
import api from '@/core/api/axios.js'

const store = useCeloStore()
const mostrarModal = ref(false)
const modalEliminar = ref(false)
const esEdicion = ref(false)
const cicloAEliminar = ref(null)
const bovinos = ref([])

const search = ref("")
const filaSeleccionada = ref(null)

const ciclosFiltrados = computed(() => {
  if (!search.value) return store.ciclos
  const query = search.value.toLowerCase()
  return store.ciclos.filter(c => 
    c.Id_ciclo?.toString().includes(query) ||
    c.bovino?.nombre?.toLowerCase().includes(query) ||
    c.observaciones?.toLowerCase().includes(query)
  )
})

function seleccionarFila(fila) {
  if (filaSeleccionada.value?.Id_ciclo === fila.Id_ciclo) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = fila
  }
}

const form = reactive({
  idCiclo: '',
  Id_bovino: '',
  Fecha_inicio: '',
  Fecha_fin: '',
  observaciones: ''
})

const duracionCalculada = computed(() => {
  if (!form.Fecha_inicio || !form.Fecha_fin) return 0
  const inicio = new Date(form.Fecha_inicio)
  const fin = new Date(form.Fecha_fin)
  const diff = fin - inicio
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function calcularDuracion(inicio, fin) {
  if (!inicio || !fin) return '—'
  const diff = new Date(fin) - new Date(inicio)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function limpiarForm() {
  form.idCiclo = ''
  form.Id_bovino = ''
  form.Fecha_inicio = ''
  form.Fecha_fin = ''
  form.observaciones = ''
  esEdicion.value = false
}

function cerrarModal() {
  mostrarModal.value = false
  limpiarForm()
}

async function guardarCiclo() {
  const datos = {
    Id_bovino: parseInt(form.Id_bovino),
    Fecha_inicio: form.Fecha_inicio,
    Fecha_fin: form.Fecha_fin,
    duracion: duracionCalculada.value.toString(),
    observaciones: form.observaciones || null
  }

  let exito = false
  if (esEdicion.value) {
    exito = await store.actualizarCiclo(form.idCiclo, datos)
  } else {
    exito = await store.crearCiclo(datos)
  }

  if (exito) cerrarModal()
}

function editarCiclo(ciclo) {
  form.idCiclo = ciclo.Id_ciclo
  form.Id_bovino = ciclo.Id_bovino || ciclo.bovino?.id_bovino
  form.Fecha_inicio = ciclo.Fecha_inicio
  form.Fecha_fin = ciclo.Fecha_fin
  form.observaciones = ciclo.observaciones || ''
  esEdicion.value = true
  mostrarModal.value = true
}

function confirmarEliminar(ciclo) {
  cicloAEliminar.value = ciclo
  modalEliminar.value = true
}

async function eliminarCiclo() {
  if (!cicloAEliminar.value) return
  const exito = await store.eliminarCiclo(cicloAEliminar.value.Id_ciclo)
  if (exito) {
    modalEliminar.value = false
    cicloAEliminar.value = null
  }
}

async function cargarBovinos() {
  try {
    const { data } = await api.get('/bovino/listar')
    bovinos.value = data
  } catch (error) {
    console.error('Error cargando bovinos:', error)
  }
}

onMounted(() => {
  store.cargarCiclos()
  cargarBovinos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.celo-root {
  font-family: 'DM Sans', sans-serif;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  font-size: 0.9rem;
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

.btn-nuevo .material-symbols-outlined {
  font-size: 1.2rem;
}

/* Alertas */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Table Card */
.table-card {
  background: white;
  border: 1.5px solid #f0f0ed;
  border-radius: 16px;
  overflow: hidden;
}

.loading, .empty-state {
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
  border: 3px solid #f0f0ed;
  border-top-color: #6E420C;
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

.btn-empty {
  margin-top: 1rem;
  padding: 0.65rem 1.25rem;
  background: #6E420C;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

/* Tabla */
.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  background: #fafaf8;
  border-bottom: 2px solid #f0f0ed;
}

.tabla th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tabla td {
  padding: 1rem;
  font-size: 0.9rem;
  color: #1a1a1a;
  border-bottom: 1px solid #f5f5f5;
}

.tabla tr:hover {
  background: #fafaf8;
}

.font-mono { font-family: 'Courier New', monospace; font-weight: 600; }
.font-bold { font-weight: 700; }
.text-muted { color: #9ca3af; font-style: italic; }

.acciones {
  display: flex;
  gap: 8px;
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

.btn-icon--edit { color: #6E420C; }
.btn-icon--edit:hover { background: #f3eee7; }

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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content--small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-header--danger {
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.modal-header--danger .material-symbols-outlined {
  font-size: 3rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.btn-close {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}

.form-label .material-symbols-outlined {
  font-size: 1rem;
  color: #6E420C;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input, .form-select, .form-textarea {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #6E420C;
}

.input-disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.duracion-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0.75rem;
  background: #f3eee7;
  border-radius: 10px;
}

.duracion-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #6E420C;
}

.duracion-label {
  font-size: 0.9rem;
  color: #8b6f47;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 1rem;
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

.btn--primary {
  background: #6E420C;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #5a360a;
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.text-center { text-align: center; }
.text-sm { font-size: 0.85rem; }

@media (max-width: 640px) {
  .celo-root {
    padding: 1.5rem 1rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>