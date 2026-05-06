<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="abrirModal()" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo</span>
      </button>

      <button @click="editarCiclo()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>
    </div>

    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <div v-if="store.mensaje" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Fecha Inicio</th>
            <th class="px-6 py-4">Fecha Fin</th>
            <th class="px-6 py-4">Duración (días)</th>
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

          <tr v-else-if="store.ciclos.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">favorite</span>
              <p class="mt-2">No hay ciclos registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="ciclo in store.ciclos" :key="ciclo.id_ciclo_celo" @click="seleccionarFila(ciclo)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_ciclo_celo === ciclo.id_ciclo_celo }">
            <td class="px-6 py-3 font-bold">#{{ ciclo.id_ciclo_celo }}</td>
            <td class="px-6 py-3">{{ ciclo.bovino?.nombre || `Bovino #${ciclo.id_bovino}` }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ciclo.fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ ciclo.fecha_fin ? formatearFecha(ciclo.fecha_fin) : '—' }}</td>
            <td class="px-6 py-3">{{ calcularDuracion(ciclo.fecha_inicio, ciclo.fecha_fin) }}</td>
            <td class="px-6 py-3">{{ ciclo.observaciones || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Ciclo Celo</h3>
              <p class="modal-subtitle">Complete los datos del ciclo</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardar" class="modal-body">
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">pets</span>
                Bovino
              </label>
              <select v-model="form.id_bovino" required class="form-select">
                <option value="">Seleccione...</option>
                <option v-for="bovino in bovinos" :key="bovino.id_bovino" :value="bovino.id_bovino">
                  {{ bovino.nombre }}
                </option>
              </select>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">event</span>
                  Fecha Inicio
                </label>
                <input v-model="form.fecha_inicio" type="date" required class="form-input" @change="calcularDuracionAuto" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">event_available</span>
                  Fecha Fin
                </label>
                <input v-model="form.fecha_fin" type="date" class="form-input" @change="calcularDuracionAuto" />
              </div>
            </div>

            <div class="form-group" v-if="duracionCalculada !== null">
              <label class="form-label">
                <span class="material-symbols-outlined">schedule</span>
                Duración
              </label>
              <input :value="duracionCalculada + ' días'" type="text" class="form-input bg-gray-50" readonly />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">description</span>
                Observaciones
              </label>
              <textarea v-model="form.observaciones" class="form-input" rows="3"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn btn--secondary">Cancelar</button>
              <button type="submit" :disabled="guardando" class="btn btn--primary">
                <span class="material-symbols-outlined">save</span>
                {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
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
            <h3 class="modal-title">Eliminar Ciclo Celo</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este ciclo?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminar" class="btn btn--danger">
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
import { useBovinoStore } from '@/modules/bovino/store/bovino.store.js'

const store = useCeloStore()
const bovinoStore = useBovinoStore()
const filaSeleccionada = ref(null)
const modalAbierto = ref(false)
const modalEliminar = ref(false)
const guardando = ref(false)
const bovinos = ref([])
const duracionCalculada = ref(null)

const form = reactive({
  id_bovino: '',
  fecha_inicio: '',
  fecha_fin: '',
  observaciones: ''
})

const modoEdicion = computed(() => !!filaSeleccionada.value)

function seleccionarFila(ciclo) {
  if (filaSeleccionada.value?.id_ciclo_celo === ciclo.id_ciclo_celo) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = ciclo
    store.limpiarMensajes?.()
  }
}

function abrirModal() {
  resetForm()
  filaSeleccionada.value = null
  modalAbierto.value = true
}

function editarCiclo() {
  if (!filaSeleccionada.value) return
  const ciclo = filaSeleccionada.value
  form.id_bovino = ciclo.id_bovino
  form.fecha_inicio = ciclo.fecha_inicio ? ciclo.fecha_inicio.split('T')[0] : ''
  form.fecha_fin = ciclo.fecha_fin ? ciclo.fecha_fin.split('T')[0] : ''
  form.observaciones = ciclo.observaciones || ''
  calcularDuracionAuto()
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  resetForm()
  duracionCalculada.value = null
}

function resetForm() {
  form.id_bovino = ''
  form.fecha_inicio = ''
  form.fecha_fin = ''
  form.observaciones = ''
}

function calcularDuracionAuto() {
  if (form.fecha_inicio && form.fecha_fin) {
    const inicio = new Date(form.fecha_inicio)
    const fin = new Date(form.fecha_fin)
    const diff = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24))
    duracionCalculada.value = diff >= 0 ? diff : null
  } else {
    duracionCalculada.value = null
  }
}

async function guardar() {
  guardando.value = true
  let resultado

  if (modoEdicion.value) {
    resultado = await store.actualizarCiclo(filaSeleccionada.value.id_ciclo_celo, form)
  } else {
    resultado = await store.crearCiclo(form)
  }

  guardando.value = false

  if (resultado.success) {
    cerrarModal()
    filaSeleccionada.value = null
  }
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminar() {
  if (!filaSeleccionada.value) return
  const resultado = await store.eliminarCiclo(filaSeleccionada.value.id_ciclo_celo)
  if (resultado.success) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}

function calcularDuracion(inicio, fin) {
  if (!inicio || !fin) return '—'
  const diff = Math.floor((new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24))
  return `${diff} días`
}

onMounted(async () => {
  store.cargarCiclos()
  const result = await bovinoStore.cargarBovinos()
  if (result) bovinos.value = bovinoStore.bovinos
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>