<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="abrirModal()" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Parto</span>
      </button>

      <button @click="editarParto()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
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

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Fecha Parto</th>
            <th class="px-6 py-4">Tipo Parto</th>
            <th class="px-6 py-4">Sexo Cría</th>
            <th class="px-6 py-4">Peso Cría (kg)</th>
            <th class="px-6 py-4">Estado Cría</th>
            <th class="px-6 py-4">Obs.</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando partos...</p>
            </td>
          </tr>

          <tr v-else-if="store.partos.length === 0">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">child_friendly</span>
              <p class="mt-2">No hay partos registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="parto in store.partos" :key="parto.id_parto" @click="seleccionarFila(parto)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_parto === parto.id_parto }">
            <td class="px-6 py-3 font-bold">#{{ parto.id_parto }}</td>
            <td class="px-6 py-3">{{ parto.bovino?.nombre || '—' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(parto.fecha_parto) }}</td>
            <td class="px-6 py-3">{{ parto.tipo_parto || '—' }}</td>
            <td class="px-6 py-3">{{ parto.sexo_cria || '—' }}</td>
            <td class="px-6 py-3">{{ parto.peso_cria || '—' }}</td>
            <td class="px-6 py-3">
              <span v-if="parto.estado_cria" class="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                :class="{
                  'bg-green-100 text-green-700': parto.estado_cria === 'Vivo',
                  'bg-red-100 text-red-700': parto.estado_cria === 'Muerto',
                  'bg-yellow-100 text-yellow-700': parto.estado_cria === 'Débil'
                }">
                {{ parto.estado_cria }}
              </span>
              <span v-else>—</span>
            </td>
            <td class="px-6 py-3 max-w-[150px] truncate text-xs text-gray-500">{{ parto.observaciones || '—' }}</td>
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
              <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Parto</h3>
              <p class="modal-subtitle">Complete los datos del registro</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardar" class="modal-body">
            
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">pregnancy</span>
                Embarazo de Origen
              </label>
              <select v-model="form.id_embarazo" required class="form-select">
                <option value="">Seleccione Embarazo...</option>
                <option v-for="emb in embarazos" :key="emb.id_embarazo" :value="emb.id_embarazo">
                  ID: #{{ emb.id_embarazo }} | Fase: {{ emb.fase || 'N/A' }} | Previsto: {{ emb.fecha_prevista_parto }}
                </option>
              </select>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">event</span>
                  Fecha Parto
                </label>
                <input v-model="form.fecha_parto" type="date" required class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">counter_1</span>
                  N° Crías
                </label>
                <input v-model.number="form.numero_crias" type="number" min="1" max="5" class="form-input" 
                  onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">category</span>
                  Tipo de Parto
                </label>
                <select v-model="form.tipo_parto" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="Normal">Normal</option>
                  <option value="Distócico">Distócico (Complicado)</option>
                  <option value="Cesárea">Cesárea</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">wc</span>
                  Sexo Cría
                </label>
                <select v-model="form.sexo_cria" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                  <option value="Múltiple">Múltiple</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">weight</span>
                  Peso Cría (kg)
                </label>
                <input v-model.number="form.peso_cria" type="number" step="0.1" class="form-input" placeholder="Ej: 35.0" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">favorite</span>
                  Estado Cría
                </label>
                <select v-model="form.estado_cria" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="Vivo">Vivo</option>
                  <option value="Muerto">Muerto</option>
                  <option value="Débil">Débil</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">description</span>
                Observaciones
              </label>
              <textarea v-model="form.observaciones" class="form-input" rows="2" placeholder="Complicaciones, cuidados..."></textarea>
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
            <h3 class="modal-title">Eliminar Parto</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este registro?</p>
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
import { usePartoStore } from '@/modules/Parto/store/Parto.store.js'
import embarazoService from '@/modules/Embarazo/services/Embarazo.Service.js'

const store = usePartoStore()
const filaSeleccionada = ref(null)
const modalAbierto = ref(false)
const modalEliminar = ref(false)
const guardando = ref(false)
const embarazos = ref([])

const form = reactive({
  id_embarazo: '',
  fecha_parto: '',
  numero_crias: 1,
  tipo_parto: '',
  sexo_cria: '',
  peso_cria: '',
  estado_cria: '',
  observaciones: ''
})

const modoEdicion = computed(() => !!filaSeleccionada.value)

function seleccionarFila(parto) {
  filaSeleccionada.value = filaSeleccionada.value?.id_parto === parto.id_parto ? null : parto
}

async function abrirModal() {
  if (modoEdicion.value) {
    const p = filaSeleccionada.value
    form.id_embarazo = p.id_embarazo
    form.fecha_parto = p.fecha_parto ? p.fecha_parto.split('T')[0] : ''
    form.numero_crias = p.numero_crias || 1
    form.tipo_parto = p.tipo_parto || ''
    form.sexo_cria = p.sexo_cria || ''
    form.peso_cria = p.peso_cria || ''
    form.estado_cria = p.estado_cria || ''
    form.observaciones = p.observaciones || ''
  } else {
    resetForm()
  }
  modalAbierto.value = true
  
  // Cargar embarazos si no hay
  if (embarazos.value.length === 0) {
    try {
      const res = await embarazoService.listar()
      embarazos.value = res.data || res
    } catch (e) {
      console.error('Error cargando embarazos:', e)
    }
  }
}

function editarParto() {
  if (!filaSeleccionada.value) return
  abrirModal()
}

function cerrarModal() {
  modalAbierto.value = false
  resetForm()
}

function resetForm() {
  form.id_embarazo = ''
  form.fecha_parto = ''
  form.numero_crias = 1
  form.tipo_parto = ''
  form.sexo_cria = ''
  form.peso_cria = ''
  form.estado_cria = ''
  form.observaciones = ''
}

async function guardar() {
  guardando.value = true
  try {
    let exito
    if (modoEdicion.value) {
      exito = await store.actualizarParto?.(filaSeleccionada.value.id_parto, form)
    } else {
      exito = await store.crearParto(form)
    }

    if (exito) {
      cerrarModal()
      filaSeleccionada.value = null
    }
  } catch (err) {
    console.error('Error al guardar parto:', err)
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminar() {
  if (!filaSeleccionada.value) return
  const exito = await store.eliminarParto?.(filaSeleccionada.value.id_parto)
  if (exito) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const partes = fecha.split('T')[0].split('-')
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`
  return new Date(fecha).toLocaleDateString('es-DO')
}

onMounted(() => {
  store.cargarPartos()
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