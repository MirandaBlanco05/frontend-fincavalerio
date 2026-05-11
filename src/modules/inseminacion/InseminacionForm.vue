<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Inseminación</span>
      </button>

      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <div class="h-6 w-px bg-gray-200 hidden sm:block mx-2"></div>

      <!-- Buscador -->
      <div class="relative flex-1 min-w-[200px]">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
        <input 
          v-model="filtros.busqueda" 
          type="text" 
          placeholder="Buscar inseminación..." 
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <button @click="modalFiltros = true" class="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary hover:bg-secondary/20 transition-all">
        <span class="material-symbols-outlined text-base">filter_list</span>
        Filtros
        <span v-if="filtrosActivos" class="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] text-white">
          {{ totalFiltrosActivos }}
        </span>
      </button>
    </div>

    <!-- Modal de Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="modalFiltros = false">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl overflow-hidden shadow-2xl">
          <!-- Handle mobile -->
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1.5 w-12 rounded-full bg-gray-200"></div>
          </div>

          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 class="text-xl font-extrabold text-gray-900">Filtrar Inseminaciones</h3>
              <p class="text-xs text-gray-500 font-medium">Filtre por resultado y fecha</p>
            </div>
            <button @click="modalFiltros = false" class="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <span class="material-symbols-outlined text-gray-400">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-6 p-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Resultado</label>
              <select v-model="filtros.resultado" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all bg-gray-50/50">
                <option value="">Cualquier resultado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Efectiva">Efectiva</option>
                <option value="Inefectiva">Inefectiva</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo Inseminación</label>
              <select v-model="filtros.tipo" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all bg-gray-50/50">
                <option value="">Cualquier tipo</option>
                <option value="Artificial">Artificial</option>
                <option value="Monta">Monta</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4 p-6 bg-gray-50">
            <button @click="limpiarFiltros" class="flex-1 rounded-xl bg-white border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-100 active:scale-95">
              Limpiar
            </button>
            <button @click="modalFiltros = false" class="flex-1 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
            <th class="px-6 py-4">Veterinario</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Estatus</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando inseminaciones...</p>
            </td>
          </tr>

          <tr v-else-if="inseminacionesFiltradas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No se encontraron resultados.</p>
            </td>
          </tr>

          <tr v-else v-for="i in inseminacionesFiltradas" :key="i.id_inseminacion" @click="seleccionarFila(i)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_inseminacion === i.id_inseminacion }">
            <td class="px-6 py-3 font-bold">#{{ i.id_inseminacion }}</td>
            <td class="px-6 py-3">{{ i.ciclo?.bovino?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">{{ i.veterinario?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(i.fecha) }}</td>
            <td class="px-6 py-3">{{ i.tipo_inseminacion }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="{
                'bg-yellow-100 text-yellow-700': i.resultado === 'Pendiente',
                'bg-green-100 text-green-700': i.resultado === 'Efectiva',
                'bg-red-100 text-red-700': i.resultado === 'Inefectiva'
              }">
                {{ i.resultado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInseminacionStore } from './store/Inseminacion.store.js'

const router = useRouter()
const store = useInseminacionStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)

const filtros = reactive({
  busqueda: '',
  resultado: '',
  tipo: ''
})

const filtrosActivos = computed(() => {
  return filtros.resultado || filtros.tipo
})

const totalFiltrosActivos = computed(() => {
  let total = 0
  if (filtros.resultado) total++
  if (filtros.tipo) total++
  return total
})

function limpiarFiltros() {
  filtros.busqueda = ''
  filtros.resultado = ''
  filtros.tipo = ''
}

onMounted(() => {
  store.cargarInseminaciones()
})

const inseminacionesFiltradas = computed(() => {
  return store.inseminaciones.filter(i => {
    const b = filtros.busqueda.toLowerCase()
    const matchBusqueda = !b || 
      i.id_inseminacion?.toString().includes(b) ||
      i.veterinario?.nombre?.toLowerCase().includes(b) ||
      i.ciclo?.bovino?.nombre?.toLowerCase().includes(b) ||
      i.resultado?.toLowerCase().includes(b)

    const matchResultado = !filtros.resultado || i.resultado === filtros.resultado
    const matchTipo = !filtros.tipo || i.tipo_inseminacion === filtros.tipo

    return matchBusqueda && matchResultado && matchTipo
  })
})

function seleccionarFila(inseminacion) {
  if (filaSeleccionada.value?.id_inseminacion === inseminacion.id_inseminacion) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = inseminacion
  }
}

function irAFormulario() {
  router.push({ name: 'InseminacionNueva' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  // Se navega a InseminacionNueva pero con parámetro id
  router.push({ name: 'InseminacionNueva', params: { id: filaSeleccionada.value.id_inseminacion } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Está seguro de eliminar la inseminación #${filaSeleccionada.value.id_inseminacion}?`)) {
    const exito = await store.eliminarInseminacion(filaSeleccionada.value.id_inseminacion)
    if (exito) {
      filaSeleccionada.value = null
    } else {
      alert(store.error || 'Error al eliminar')
    }
  }
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleDateString('es-DO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>