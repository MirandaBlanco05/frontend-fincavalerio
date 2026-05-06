<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="router.push({ name: 'TratamientoNuevo' })" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Tratamiento</span>
      </button>

      <button @click="editarTratamiento()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
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

    <!-- Mensajes -->
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
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Enfermedad</th>
            <th class="px-6 py-4">Empleado</th>
            <th class="px-6 py-4">Fecha Inicio</th>
            <th class="px-6 py-4">Fecha Fin</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando tratamientos...</p>
            </td>
          </tr>

          <tr v-else-if="tratamientosFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">medication</span>
              <p class="mt-2">{{ store.tratamientos.length === 0 ? 'No hay tratamientos registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="trat in tratamientosFiltrados" :key="trat.id_tratamiento" @click="seleccionarFila(trat)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_tratamiento === trat.id_tratamiento }">
            <td class="px-6 py-3 font-bold">#{{ trat.id_tratamiento }}</td>
            <td class="px-6 py-3">{{ trat.nombre }}</td>
            <td class="px-6 py-3">{{ trat.tipo_tratamiento }}</td>
            <td class="px-6 py-3">{{ trat.enfermedad?.nombre || '—' }}</td>
            <td class="px-6 py-3">{{ trat.empleado?.nombre || '—' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(trat.fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(trat.fecha_fin) }}</td>
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Tratamientos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            
            <!-- Filtro por Tipo -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Tipo de Tratamiento</label>
              <select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los tipos</option>
                <option v-for="tipo in tiposTratamiento" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>
            </div>

            <!-- Filtro por Enfermedad -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Enfermedad</label>
              <select v-model="filtros.enfermedad" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todas las enfermedades</option>
                <option v-for="enf in enfermedades" :key="enf.id_enfermedad" :value="enf.id_enfermedad">
                  {{ enf.nombre }}
                </option>
              </select>
            </div>

            <!-- Filtro por Empleado -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Empleado</label>
              <select v-model="filtros.empleado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los empleados</option>
                <option v-for="emp in empleados" :key="emp.Id_empleado" :value="emp.Id_empleado">
                  {{ emp.nombre }}
                </option>
              </select>
            </div>

            <!-- Filtro por Estado -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Estado</label>
              <select v-model="filtros.estado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="activo">En curso</option>
                <option value="finalizado">Finalizados</option>
              </select>
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
            <h3 class="modal-title">Eliminar Tratamiento</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este tratamiento?</p>
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarTratamiento" class="btn btn--danger">
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
import { useTratamientoStore } from '@/modules/tratamientos/store/tratamiento.store.js'
import { empleadoService } from '@/modules/empleado/services/empleado.service.js'
import enfermedadService from '@/modules/enfermedad/services/enfermedad.service.js'

const router = useRouter()
const store = useTratamientoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const modalEliminar = ref(false)
const empleados = ref([])
const enfermedades = ref([])

const filtros = ref({
  tipo: '',
  enfermedad: '',
  empleado: '',
  estado: ''
})

const filtrosAplicados = ref({
  tipo: '',
  enfermedad: '',
  empleado: '',
  estado: ''
})

const tiposTratamiento = computed(() => {
  const tipos = [...new Set(store.tratamientos.map(t => t.tipo_tratamiento).filter(Boolean))]
  return tipos.sort()
})

const filtrosActivos = computed(() => {
  let count = 0
  if (filtrosAplicados.value.tipo) count++
  if (filtrosAplicados.value.enfermedad) count++
  if (filtrosAplicados.value.empleado) count++
  if (filtrosAplicados.value.estado) count++
  return count
})

const tratamientosFiltrados = computed(() => {
  return store.tratamientos.filter(trat => {
    const { tipo, enfermedad, empleado, estado } = filtrosAplicados.value

    if (tipo && trat.tipo_tratamiento !== tipo) return false
    if (enfermedad && trat.id_enfermedad !== parseInt(enfermedad)) return false
    if (empleado && trat.id_empleado !== parseInt(empleado)) return false
    
    if (estado === 'activo') {
      const hoy = new Date()
      const fin = trat.fecha_fin ? new Date(trat.fecha_fin) : null
      if (fin && fin < hoy) return false
    }
    
    if (estado === 'finalizado') {
      const hoy = new Date()
      const fin = trat.fecha_fin ? new Date(trat.fecha_fin) : null
      if (!fin || fin >= hoy) return false
    }

    return true
  })
})

function seleccionarFila(trat) {
  if (filaSeleccionada.value?.id_tratamiento === trat.id_tratamiento) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = trat
    store.limpiarMensajes?.()
  }
}

function editarTratamiento() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'TratamientoEditar', params: { id: filaSeleccionada.value.id_tratamiento } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarTratamiento() {
  if (!filaSeleccionada.value) return
  const exito = await store.eliminarTratamiento(filaSeleccionada.value.id_tratamiento)
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
  filtros.value = { tipo: '', enfermedad: '', empleado: '', estado: '' }
  filtrosAplicados.value = { tipo: '', enfermedad: '', empleado: '', estado: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}

async function cargarDatos() {
  try {
    const [empRes, enfRes] = await Promise.all([
      empleadoService.listar(),
      enfermedadService.listar()
    ])
    empleados.value = empRes.data
    enfermedades.value = enfRes.data
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
}

onMounted(() => {
  store.cargarTratamientos()
  cargarDatos()
})
</script>

<style scoped>
/* Mismo CSS que VacunasList */
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
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
}

.modal-content--small {
  max-width: 450px;
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-header--danger {
  display: flex;
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
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 1rem 2rem 2rem;
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

.text-center { text-align: center; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: #9ca3af; }
</style>