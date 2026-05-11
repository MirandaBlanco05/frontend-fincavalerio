<template>
  <div class="relative min-h-screen w-full font-display">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Parto</span>
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
            <th class="px-6 py-4">Vaca</th>
            <th class="px-6 py-4">Fecha Parto</th>
            <th class="px-6 py-4">N° Crías</th>
            <th class="px-6 py-4">Embarazo</th>
            <th class="px-6 py-4 text-center">Observaciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando partos...</p>
            </td>
          </tr>

          <tr v-else-if="partosFiltrados.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay partos registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="parto in partosFiltrados" :key="parto.id_parto" @click="seleccionarFila(parto)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_parto === parto.id_parto }">
            <td class="px-6 py-3 font-bold">#{{ parto.id_parto }}</td>
            <td class="px-6 py-3 font-semibold">{{ parto.embarazo?.inseminacion?.ciclo?.bovino?.nombre || '—' }}</td>
            <td class="px-6 py-3 font-medium text-primary">{{ formatearFecha(parto.fecha_parto) }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                {{ parto.numero_crias || 0 }} {{ parto.numero_crias === 1 ? 'cría' : 'crías' }}
              </span>
            </td>
            <td class="px-6 py-3 text-gray-400 text-xs">Emb. #{{ parto.id_embarazo }}</td>
            <td class="px-6 py-3 text-gray-500 max-w-xs truncate">{{ parto.observaciones || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Partos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-5">
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">Fecha Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">Fecha Hasta</label>
              <input v-model="filtros.fechaHasta" type="date" class="w-full rounded-lg border border-border-color px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">Número de Crías</label>
              <input v-model="filtros.numeroCrias" type="number" min="0" class="w-full rounded-lg border border-border-color px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Ej: 1" />
            </div>
          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100">
              Limpiar
            </button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 shadow-sm">
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
import { usePartoStore } from './store/Parto.store.js'

const router = useRouter()
const store = usePartoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ fechaDesde: '', fechaHasta: '', numeroCrias: '' })
const filtrosAplicados = ref({ fechaDesde: '', fechaHasta: '', numeroCrias: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.fechaDesde) c++
  if (filtrosAplicados.value.fechaHasta) c++
  if (filtrosAplicados.value.numeroCrias) c++
  return c
})

onMounted(async () => {
  await store.cargarPartos()
})

function seleccionarFila(parto) {
  if (filaSeleccionada.value?.id_parto === parto.id_parto) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = parto
  }
}

function irAFormulario() {
  router.push({ name: 'PartoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'PartoEditar', params: { id: filaSeleccionada.value.id_parto } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Eliminar parto #${filaSeleccionada.value.id_parto}? Esta acción no se puede deshacer.`)) {
    const resultado = await store.eliminarParto(filaSeleccionada.value.id_parto)
    if (resultado) filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { fechaDesde: '', fechaHasta: '', numeroCrias: '' }
  filtrosAplicados.value = { fechaDesde: '', fechaHasta: '', numeroCrias: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

const partosFiltrados = computed(() => {
  if (!store.partos) return []
  return store.partos
    .filter(parto => {
      const { fechaDesde, fechaHasta, numeroCrias } = filtrosAplicados.value
      
      const okFechaDesde = !fechaDesde || (parto.fecha_parto && new Date(parto.fecha_parto) >= new Date(fechaDesde))
      const okFechaHasta = !fechaHasta || (parto.fecha_parto && new Date(parto.fecha_parto) <= new Date(fechaHasta))
      const okCrias = !numeroCrias || parto.numero_crias == numeroCrias

      return okFechaDesde && okFechaHasta && okCrias
    })
    .sort((a, b) => b.id_parto - a.id_parto)
})

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const [year, month, day] = fecha.split('T')[0].split('-')
  if (year && month && day) return `${day}/${month}/${year}`
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
.font-display {
  font-family: 'DM Sans', sans-serif;
}
</style>