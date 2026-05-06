<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="router.push({ name: 'PartoNuevo' })" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
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

      <button @click="modalFiltros = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
        <span class="material-symbols-outlined text-base">filter_list</span>
        <span class="truncate">Filtrar</span>
        <span v-if="filtrosActivos > 0" class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">{{ filtrosActivos }}</span>
      </button>
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
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando partos...</p>
            </td>
          </tr>

          <tr v-else-if="partosFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">child_care</span>
              <p class="mt-2">{{ store.partos.length === 0 ? 'No hay partos registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="parto in partosFiltrados" :key="parto.id_parto" @click="seleccionarFila(parto)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_parto === parto.id_parto }">
            <td class="px-6 py-3 font-bold">#{{ parto.id_parto }}</td>
            <td class="px-6 py-3">{{ parto.bovino?.nombre || '—' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(parto.fecha_parto) }}</td>
            <td class="px-6 py-3">{{ parto.tipo_parto || '—' }}</td>
            <td class="px-6 py-3">{{ parto.sexo_cria || '—' }}</td>
            <td class="px-6 py-3">{{ parto.peso_cria || '—' }}</td>
            <td class="px-6 py-3">{{ parto.estado_cria || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>

          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Partos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Bovino</label>
              <select v-model="filtros.bovino" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los animales</option>
                <option v-for="bovino in bovinos" :key="bovino.id_bovino" :value="bovino.id_bovino">
                  {{ bovino.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Tipo de Parto</label>
              <select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los tipos</option>
                <option value="Natural">Natural</option>
                <option value="Asistido">Asistido</option>
                <option value="Cesárea">Cesárea</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Sexo Cría</label>
              <select v-model="filtros.sexo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
              <input v-model="filtros.fechaHasta" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>

          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
              Limpiar
            </button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90">
              Aplicar Filtros
            </button>
          </div>
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
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarParto" class="btn btn--danger">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePartoStore } from '@/modules/parto/store/parto.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'

const router = useRouter()
const store = usePartoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const modalEliminar = ref(false)
const bovinos = ref([])

const filtros = ref({
  bovino: '',
  tipo: '',
  sexo: '',
  fechaDesde: '',
  fechaHasta: ''
})

const filtrosAplicados = ref({
  bovino: '',
  tipo: '',
  sexo: '',
  fechaDesde: '',
  fechaHasta: ''
})

const filtrosActivos = computed(() => {
  let count = 0
  if (filtrosAplicados.value.bovino) count++
  if (filtrosAplicados.value.tipo) count++
  if (filtrosAplicados.value.sexo) count++
  if (filtrosAplicados.value.fechaDesde) count++
  if (filtrosAplicados.value.fechaHasta) count++
  return count
})

const partosFiltrados = computed(() => {
  return store.partos.filter(parto => {
    const { bovino, tipo, sexo, fechaDesde, fechaHasta } = filtrosAplicados.value

    if (bovino && parto.id_bovino !== parseInt(bovino)) return false
    if (tipo && parto.tipo_parto !== tipo) return false
    if (sexo && parto.sexo_cria !== sexo) return false

    if (fechaDesde && parto.fecha_parto) {
      const fechaParto = new Date(parto.fecha_parto)
      const fechaMin = new Date(fechaDesde)
      if (fechaParto < fechaMin) return false
    }

    if (fechaHasta && parto.fecha_parto) {
      const fechaParto = new Date(parto.fecha_parto)
      const fechaMax = new Date(fechaHasta)
      if (fechaParto > fechaMax) return false
    }

    return true
  })
})

function seleccionarFila(parto) {
  filaSeleccionada.value = filaSeleccionada.value?.id_parto === parto.id_parto ? null : parto
}

function editarParto() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'PartoEditar', params: { id: filaSeleccionada.value.id_parto } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarParto() {
  if (!filaSeleccionada.value) return
  const exito = await store.eliminarParto(filaSeleccionada.value.id_parto)
  if (exito) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { bovino: '', tipo: '', sexo: '', fechaDesde: '', fechaHasta: '' }
  filtrosAplicados.value = { bovino: '', tipo: '', sexo: '', fechaDesde: '', fechaHasta: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}

async function cargarBovinos() {
  try {
    const response = await bovinoService.listar()
    bovinos.value = response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  store.cargarPartos()
  cargarBovinos()
})
</script>

<style scoped>
.material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; backdrop-filter: blur(4px); }
.modal-content { background: white; border-radius: 20px; width: 100%; max-width: 600px; }
.modal-content--small { max-width: 450px; }
.modal-header { padding: 2rem 2rem 1.5rem; border-bottom: 1.5px solid #f0f0ed; }
.modal-header--danger { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.modal-header--danger .material-symbols-outlined { font-size: 3rem; color: #dc2626; }
.modal-title { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; }
.modal-body { padding: 2rem; }
.modal-footer { display: flex; gap: 12px; padding: 1rem 2rem 2rem; }
.btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0.85rem; border: none; border-radius: 12px; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn--secondary { background: #f5f5f5; color: #374151; }
.btn--secondary:hover { background: #e5e7eb; }
.btn--danger { background: #dc2626; color: white; }
.btn--danger:hover { background: #b91c1c; }
.text-center { text-align: center; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: #9ca3af; }
</style>