<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irANuevo" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Ordeño</span>
      </button>

      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
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

    <div v-if="mensajeExito" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ mensajeExito }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Cantidad (L)</th>
            <th class="px-6 py-4">Turno</th>
            <th class="px-6 py-4">Empleado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando registros...</p>
            </td>
          </tr>

          <tr v-else-if="ordeniosFiltrados.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">water_drop</span>
              <p class="mt-2">{{ store.ordenios.length === 0 ? 'No hay registros de ordeño.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="ord in ordeniosFiltrados" :key="ord.id_ordenio" @click="seleccionarFila(ord)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_ordenio === ord.id_ordenio }">
            <td class="px-6 py-3 font-bold">#{{ ord.id_ordenio }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ord.fecha) }}</td>
            <td class="px-6 py-3">{{ ord.bovino?.nombre || ord.id_bovino || '—' }}</td>
            <td class="px-6 py-3">{{ ord.cantidad_total || '—' }} L</td>
            <td class="px-6 py-3">{{ ord.momento_dia || '—' }}</td>
            <td class="px-6 py-3">{{ ord.empleado?.nombre || ord.id_empleado || '—' }}</td>
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Ordeño</h3>
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
              <label class="mb-1 block text-sm font-medium text-gray-700">Turno</label>
              <select v-model="filtros.turno" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los turnos</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdenioStore } from '@/modules/ordenio/store/ordenio.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'

const router = useRouter()
const store = useOrdenioStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const bovinos = ref([])
const mensajeExito = ref('')

const filtros = ref({
  bovino: '',
  turno: '',
  fechaDesde: '',
  fechaHasta: ''
})

const filtrosAplicados = ref({
  bovino: '',
  turno: '',
  fechaDesde: '',
  fechaHasta: ''
})

const filtrosActivos = computed(() => {
  let count = 0
  if (filtrosAplicados.value.bovino) count++
  if (filtrosAplicados.value.turno) count++
  if (filtrosAplicados.value.fechaDesde) count++
  if (filtrosAplicados.value.fechaHasta) count++
  return count
})

const ordeniosFiltrados = computed(() => {
  if (!store.ordenios || store.ordenios.length === 0) return []
  
  return store.ordenios.filter(ord => {
    const { bovino, turno, fechaDesde, fechaHasta } = filtrosAplicados.value

    if (bovino && ord.id_bovino !== parseInt(bovino)) return false
    if (turno && ord.momento_dia !== turno) return false

    if (fechaDesde && ord.fecha) {
      const fechaOrd = new Date(ord.fecha)
      const fechaMin = new Date(fechaDesde)
      if (fechaOrd < fechaMin) return false
    }

    if (fechaHasta && ord.fecha) {
      const fechaOrd = new Date(ord.fecha)
      const fechaMax = new Date(fechaHasta)
      if (fechaOrd > fechaMax) return false
    }

    return true
  })
})

function seleccionarFila(ord) {
  if (filaSeleccionada.value?.id_ordenio === ord.id_ordenio) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = ord
    mensajeExito.value = ''
  }
}

function irANuevo() {
  console.log('🔥 Intentando ir a nuevo ordeño')
  router.push({ name: 'OrdenioNuevo' }).catch(err => {
    console.error('❌ Error navegando a nuevo:', err)
  })
}

function irAEditar() {
  if (!filaSeleccionada.value) {
    console.log('⚠️ No hay fila seleccionada')
    return
  }
  console.log('🔥 Editando ordeño:', filaSeleccionada.value.id_ordenio)
  router.push({ 
    name: 'OrdenioEditar', 
    params: { id: filaSeleccionada.value.id_ordenio } 
  }).catch(err => {
    console.error('❌ Error navegando a editar:', err)
  })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) {
    console.log('⚠️ No hay fila seleccionada')
    return
  }
  
  console.log('🗑️ Intentando eliminar:', filaSeleccionada.value.id_ordenio)
  
  if (confirm('¿Eliminar este registro de ordeño? Esta acción no se puede deshacer.')) {
    const exito = await store.eliminarOrdenio(filaSeleccionada.value.id_ordenio)
    if (exito) {
      mensajeExito.value = 'Ordeño eliminado correctamente'
      filaSeleccionada.value = null
      setTimeout(() => { mensajeExito.value = '' }, 3000)
    }
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { bovino: '', turno: '', fechaDesde: '', fechaHasta: '' }
  filtrosAplicados.value = { bovino: '', turno: '', fechaDesde: '', fechaHasta: '' }
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
    bovinos.value = response.data || []
  } catch (error) {
    console.error('Error al cargar bovinos:', error)
  }
}

onMounted(async () => {
  console.log('🚀 OrdenioIndex montado')
  await store.cargarOrdenios()
  await cargarBovinos()
  console.log('📊 Ordeños cargados:', store.ordenios.length)
})
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>