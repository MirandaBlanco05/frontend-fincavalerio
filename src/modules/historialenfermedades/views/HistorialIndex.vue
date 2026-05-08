<template>
  <div class="relative min-h-screen w-full font-display">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="router.push({ name: 'HistorialNuevo' })" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span><span>Nuevo Historial</span>
      </button>
      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span><span>Editar</span>
      </button>
      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span><span>Eliminar</span>
      </button>
      <button @click="modalFiltros = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
        <span class="material-symbols-outlined text-base">filter_list</span><span>Filtros</span>
        <span v-if="filtrosActivos > 0" class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">{{ filtrosActivos }}</span>
      </button>
    </div>

    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>{{ store.error }}
    </div>
    <div v-if="mensajeExito" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>{{ mensajeExito }}
    </div>

    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Enfermedad</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando || cargandoCatalogos">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando datos...</p>
            </td>
          </tr>
          <tr v-else-if="historialesFiltrados.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">history_edu</span>
              <p class="mt-2">{{ store.historiales?.length === 0 ? 'No hay historiales registrados.' : 'No hay resultados con los filtros.' }}</p>
            </td>
          </tr>
          <tr v-else v-for="h in historialesFiltrados" :key="h.id_historial" @click="seleccionarFila(h)" class="cursor-pointer border-b transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_historial === h.id_historial }">
            <td class="px-6 py-3 font-bold">#{{ h.id_historial }}</td>
            <td class="px-6 py-3 font-medium">{{ h.bovino ? (h.bovino.nombre || `Crotal: ${h.bovino.numero_crotal}`) : `ID ${h.id_bovino}` }}</td>
            <td class="px-6 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="e in h.enfermedades" :key="e.nombre" class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                  <span class="material-symbols-outlined text-[12px]">coronavirus</span>
                  {{ e.nombre }}
                </span>
                <span v-if="!h.enfermedades?.length" class="text-gray-400">Sin registros</span>
              </div>
            </td>
            <td class="px-6 py-3">{{ formatearFecha(h.fecha) }}</td>
            <td class="px-6 py-3 text-gray-500 max-w-xs truncate">{{ h.observaciones || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl shadow-2xl overflow-hidden font-display">
          <div class="flex items-center justify-between p-4 border-b border-border-color bg-gray-50">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">filter_list</span>
              <h3 class="text-lg font-bold text-text-primary">Filtros</h3>
            </div>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          
          <div class="flex flex-col gap-4 p-5 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-text-primary">Bovino</label>
              <select v-model="filtros.idBovino" class="w-full rounded-lg border border-border-color bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Todos los bovinos</option>
                <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">{{ b.nombre || `Crotal: ${b.numero_crotal}` }}</option>
              </select>
            </div>
            
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-text-primary">Enfermedad</label>
              <select v-model="filtros.idEnfermedad" class="w-full rounded-lg border border-border-color bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Todas las enfermedades</option>
                <option v-for="e in enfermedades" :key="e.id_enfermedad" :value="e.id_enfermedad">{{ e.nombre }}</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-3 bg-gray-50 p-4 border-t border-border-color">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">Limpiar</button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-sm">Aplicar Filtros</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistorialStore } from '../store/historial.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'
import enfermedadService from '@/modules/enfermedad/services/enfermedad.service.js'

const router = useRouter()
const store = useHistorialStore()
const filaSeleccionada = ref(null)
const mensajeExito = ref('')
const modalFiltros = ref(false)

const bovinos = ref([])
const enfermedades = ref([])
const cargandoCatalogos = ref(true)

const filtros = ref({ idBovino: '', idEnfermedad: '' })
const filtrosAplicados = ref({ idBovino: '', idEnfermedad: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.idBovino) c++
  if (filtrosAplicados.value.idEnfermedad) c++
  return c
})

const historialesFiltrados = computed(() => {
  if (!store.historiales) return []
  return store.historiales.filter(h => {
    const f = filtrosAplicados.value
    if (f.idBovino && h.id_bovino != f.idBovino) return false
    if (f.idEnfermedad) {
      const enfSeleccionada = enfermedades.value.find(e => e.id_enfermedad == f.idEnfermedad)
      if (!enfSeleccionada) return false
      const tieneEnfermedad = h.enfermedades?.some(e => e.nombre === enfSeleccionada.nombre)
      if (!tieneEnfermedad) return false
    }
    return true
  }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

function getNombreBovino(id) {
  const b = bovinos.value.find(x => x.id_bovino == id)
  return b ? (b.nombre || `Crotal: ${b.numero_crotal}`) : `ID ${id}`
}

function getNombreEnfermedad(id) {
  const e = enfermedades.value.find(x => x.id_enfermedad == id)
  return e ? e.nombre : `ID ${id}`
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '—'
  const date = new Date(fechaStr)
  return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short', day: '2-digit' }).format(date)
}

function seleccionarFila(h) { 
  filaSeleccionada.value = filaSeleccionada.value?.id_historial === h.id_historial ? null : h
  mensajeExito.value = '' 
}

function irAEditar() { 
  if (!filaSeleccionada.value) return
  router.push({ name: 'HistorialEditar', params: { id: filaSeleccionada.value.id_historial } }) 
}

async function confirmarEliminar() { 
  if (!filaSeleccionada.value || !confirm('¿Eliminar registro del historial?')) return
  if (await store.eliminarHistorial(filaSeleccionada.value.id_historial)) { 
    mensajeExito.value = 'Registro eliminado correctamente'
    filaSeleccionada.value = null
    setTimeout(() => mensajeExito.value = '', 3000) 
  } 
}

function aplicarFiltros() { 
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false 
}

function limpiarFiltros() { 
  filtros.value = { idBovino: '', idEnfermedad: '' }
  filtrosAplicados.value = { idBovino: '', idEnfermedad: '' }
  modalFiltros.value = false 
}

function cerrarFiltros() { 
  modalFiltros.value = false 
}

onMounted(async () => {
  store.cargarHistoriales()
  
  try {
    const [bovRes, enfRes] = await Promise.all([
      bovinoService.listar(),
      enfermedadService.listar()
    ])
    bovinos.value = bovRes.data || []
    enfermedades.value = enfRes.data || []
  } catch (error) {
    console.error('Error cargando catálogos:', error)
  } finally {
    cargandoCatalogos.value = false
  }
})
</script>