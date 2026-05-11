<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="abrirModal()" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo</span>
      </button>

      <button @click="abrirModal(filaSeleccionada)" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
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
            <th class="px-6 py-4">Inseminación</th>
            <th class="px-6 py-4">Veterinario</th>
            <th class="px-6 py-4">Fase</th>
            <th class="px-6 py-4">Fecha Secado</th>
            <th class="px-6 py-4">Fecha Prevista Parto</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando embarazos...</p>
            </td>
          </tr>

          <tr v-else-if="store.embarazos.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">pregnancy</span>
              <p class="mt-2">No hay embarazos registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="embarazo in store.embarazos" :key="embarazo.id_embarazo" @click="seleccionarFila(embarazo)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_embarazo === embarazo.id_embarazo }">
            <td class="px-6 py-3 font-bold">#{{ embarazo.id_embarazo }}</td>
            <td class="px-6 py-3">#{{ embarazo.id_inseminacion }}</td>
            <td class="px-6 py-3">{{ embarazo.VETERINARIO?.nombre || '—' }}</td>
            <td class="px-6 py-3">{{ embarazo.fase || '—' }}</td>
            <td class="px-6 py-3">{{ embarazo.fecha_secado || '—' }}</td>
            <td class="px-6 py-3">{{ embarazo.fecha_prevista_parto }}</td>
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
              <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Embarazo</h3>
              <p class="modal-subtitle">Complete los datos del embarazo</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardar" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">science</span>
                  Inseminación
                </label>
                <select v-model="form.id_inseminacion" required class="form-select">
                  <option value="">Seleccione...</option>
                  <option v-for="ins in inseminaciones" :key="ins.id_inseminacion" :value="ins.id_inseminacion">
                    #{{ ins.id_inseminacion }} - {{ ins.fecha }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">medical_services</span>
                  Veterinario
                </label>
                <select v-model="form.id_veterinario" required class="form-select">
                  <option value="">Seleccione...</option>
                  <option v-for="vet in veterinarios" :key="vet.id_veterinario" :value="vet.id_veterinario">
                    {{ vet.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">category</span>
                Fase
              </label>
              <select v-model="form.fase" class="form-select">
                <option value="">Seleccione...</option>
                <option value="Gestación temprana">Gestación temprana</option>
                <option value="Gestación media">Gestación media</option>
                <option value="Gestación tardía">Gestación tardía</option>
                <option value="Preparto">Preparto</option>
              </select>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">event</span>
                  Fecha Secado
                </label>
                <input v-model="form.fecha_secado" type="date" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">event_available</span>
                  Fecha Prevista Parto
                </label>
                <input v-model="form.fecha_prevista_parto" type="date" required class="form-input" />
              </div>
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
            <h3 class="modal-title">Eliminar Embarazo</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este embarazo?</p>
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
import { useEmbarazoStore } from '@/modules/embarazo/store/embarazo.store.js'

const store = useEmbarazoStore()
const filaSeleccionada = ref(null)
const modalAbierto = ref(false)
const modalEliminar = ref(false)
const guardando = ref(false)

// Mock data - TODO: Cargar desde stores
const inseminaciones = ref([])
const veterinarios = ref([])

const form = reactive({
  id_inseminacion: '',
  id_veterinario: '',
  fase: '',
  fecha_secado: '',
  fecha_prevista_parto: ''
})

const modoEdicion = computed(() => !!filaSeleccionada.value)

function seleccionarFila(embarazo) {
  if (filaSeleccionada.value?.id_embarazo === embarazo.id_embarazo) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = embarazo
    store.limpiarMensajes?.()
  }
}

function abrirModal(embarazo = null) {
  if (embarazo) {
    form.id_inseminacion = embarazo.id_inseminacion
    form.id_veterinario = embarazo.id_veterinario
    form.fase = embarazo.fase || ''
    form.fecha_secado = embarazo.fecha_secado || ''
    form.fecha_prevista_parto = embarazo.fecha_prevista_parto
  } else {
    resetForm()
    filaSeleccionada.value = null
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  resetForm()
}

function resetForm() {
  form.id_inseminacion = ''
  form.id_veterinario = ''
  form.fase = ''
  form.fecha_secado = ''
  form.fecha_prevista_parto = ''
}

async function guardar() {
  guardando.value = true
  let resultado

  if (modoEdicion.value) {
    resultado = await store.actualizarEmbarazo(filaSeleccionada.value.id_embarazo, form)
  } else {
    resultado = await store.crearEmbarazo(form)
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
  const resultado = await store.eliminarEmbarazo(filaSeleccionada.value.id_embarazo)
  if (resultado.success) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

onMounted(() => {
  store.cargarEmbarazos()
  // TODO: Cargar inseminaciones y veterinarios
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