<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo Ordeño -->
      <button
        @click="abrirModal()"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Ordeño</span>
      </button>

      <!-- Editar (activo solo si hay fila seleccionada) -->
      <button
        @click="editarOrdenio()"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar (activo solo si hay fila seleccionada) -->
      <button
        @click="confirmarEliminar()"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>
    </div>

    <!-- Alerta de error -->
    <div
      v-if="store.error"
      class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <!-- Alerta de éxito -->
    <div
      v-if="store.mensaje"
      class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <!-- Encabezado -->
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Vaca</th>
            <th class="px-6 py-4">Empleado</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Momento</th>
            <th class="px-6 py-4">Cantidad (L)</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando registros...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="store.ordenios.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">event_busy</span>
              <p class="mt-2">No hay ordeños registrados.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="ord in store.ordenios"
            :key="ord.Id_ordenio"
            @click="seleccionarFila(ord)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.Id_ordenio === ord.Id_ordenio }"
          >
            <td class="px-6 py-3 font-bold">#{{ ord.Id_ordenio }}</td>
            <td class="px-6 py-3 font-medium">{{ ord.BOVINO?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">EMP-{{ ord.Id_empleado }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ord.fecha) }}</td>
            <td class="px-6 py-3">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                :class="ord.Momento_dia === 'Mañana' ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 text-indigo-700'"
              >
                {{ ord.Momento_dia || '—' }}
              </span>
            </td>
            <td class="px-6 py-3 text-right font-bold">{{ ord.Cantidad_total || '0' }} L</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-content">
          
          <!-- Encabezado -->
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ esEdicion ? 'Editar' : 'Nuevo' }} Ordeño</h3>
              <p class="modal-subtitle">Registre la producción láctea</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="guardarOrdenio" class="modal-body">
            
            <!-- Vaca -->
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">pets</span>
                Vaca
              </label>
              <select v-model="form.Id_bovino" class="form-select" required>
                <option value="">Seleccione vaca...</option>
                <option v-for="bovino in bovinos" :key="bovino.id_bovino" :value="bovino.id_bovino">
                  {{ bovino.id_bovino }} - {{ bovino.nombre }}
                </option>
              </select>
            </div>

            <div class="form-grid">
              <!-- Empleado -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">badge</span>
                  Empleado
                </label>
                <select v-model="form.Id_empleado" class="form-select" required>
                  <option value="">Seleccione...</option>
                  <option v-for="emp in empleados" :key="emp.Id_empleado" :value="emp.Id_empleado">
                    EMP-{{ emp.Id_empleado }} - {{ emp.nombre }}
                  </option>
                </select>
              </div>

              <!-- Fecha -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">calendar_today</span>
                  Fecha
                </label>
                <input v-model="form.fecha" type="date" class="form-input" required />
              </div>
            </div>

            <!-- Momento del día -->
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">schedule</span>
                Momento del Día
              </label>
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
              <label class="form-label required">
                <span class="material-symbols-outlined">opacity</span>
                Cantidad Total (Litros)
              </label>
              <div class="input-wrapper">
                <input 
                  v-model="form.Cantidad_total" 
                  type="number" 
                  step="0.1" 
                  placeholder="0.00"
                  class="form-input text-right text-lg font-bold"
                  required
                />
                <span class="input-suffix">LITROS</span>
              </div>
            </div>

            <!-- Botones -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn btn--secondary">Cancelar</button>
              <button type="submit" :disabled="store.cargando" class="btn btn--primary">
                <span class="material-symbols-outlined">save</span>
                {{ store.cargando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Ordeño</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este registro de ordeño?</p>
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
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
import { ref, reactive, onMounted } from 'vue'
import { useOrdenioStore } from '@/modules/ordenio/store/ordenio.store.js'
import api from '@/core/api/axios.js'

const store = useOrdenioStore()
const filaSeleccionada = ref(null)
const mostrarModal = ref(false)
const modalEliminar = ref(false)
const esEdicion = ref(false)
const bovinos = ref([])
const empleados = ref([])

const form = reactive({
  id: null,
  Id_bovino: '',
  Id_empleado: '',
  fecha: new Date().toISOString().split('T')[0],
  Momento_dia: 'Mañana',
  Cantidad_total: ''
})

function seleccionarFila(ordenio) {
  if (filaSeleccionada.value?.Id_ordenio === ordenio.Id_ordenio) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = ordenio
    store.limpiarMensajes?.()
  }
}

function abrirModal() {
  limpiarForm()
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  limpiarForm()
}

function limpiarForm() {
  form.id = null
  form.Id_bovino = ''
  form.Id_empleado = ''
  form.fecha = new Date().toISOString().split('T')[0]
  form.Momento_dia = 'Mañana'
  form.Cantidad_total = ''
  esEdicion.value = false
}

function editarOrdenio() {
  if (!filaSeleccionada.value) return
  const ord = filaSeleccionada.value
  form.id = ord.Id_ordenio
  form.Id_bovino = ord.Id_bovino
  form.Id_empleado = ord.Id_empleado
  form.fecha = ord.fecha
  form.Momento_dia = ord.Momento_dia || 'Mañana'
  form.Cantidad_total = ord.Cantidad_total || ''
  esEdicion.value = true
  mostrarModal.value = true
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

  if (exito) {
    cerrarModal()
    filaSeleccionada.value = null
  }
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarOrdenio() {
  if (!filaSeleccionada.value) return
  const exito = await store.eliminarOrdenio(filaSeleccionada.value.Id_ordenio)
  if (exito) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}

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
  font-family: 'DM Sans', sans-serif;
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
  align-items: center;
  gap: 1rem;
}

.modal-header--danger .material-symbols-outlined {
  font-size: 3rem;
  color: #dc2626;
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
  color: #4c9a4c;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input, .form-select {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
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

.input-wrapper {
  position: relative;
}

.input-suffix {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 700;
  font-size: 0.75rem;
  pointer-events: none;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Toggle buttons */
.toggle-group {
  display: flex;
  padding: 4px;
  background: #f5f5f5;
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
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: #4c9a4c;
  color: white;
  box-shadow: 0 2px 4px rgba(76, 154, 76, 0.2);
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
  background: #4c9a4c;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #3d7a3d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 154, 76, 0.3);
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
.text-muted { color: #9ca3af; }

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .modal-body {
    padding: 1.5rem;
  }
}
</style>