<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Ciclo</span>
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

          <tr v-else-if="celosFiltrados.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay ciclos registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="c in celosFiltrados" :key="c.id_ciclo" @click="seleccionarFila(c)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_ciclo === c.id_ciclo }">
            <td class="px-6 py-3 font-bold">#{{ c.id_ciclo }}</td>
            <td class="px-6 py-3">Bovino {{ c.id_bovino }}</td>
            <td class="px-6 py-3">{{ formatearFecha(c.fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(c.fecha_fin) }}</td>
            <td class="px-6 py-3">{{ c.duracion || '—' }}</td>
            <td class="px-6 py-3">{{ c.observaciones || '—' }}</td>
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Ciclos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">ID Bovino</label>
              <input v-model="filtros.idBovino" type="number" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Ej: 5" />
            </div>
            
            <div>
              <label class="mb-1 block text-sm font-medium">Fecha Inicio Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Fecha Inicio Hasta</label>
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
import { useCeloStore } from '../store/celo.store.js'

const router = useRouter()
const store = useCeloStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ idBovino: '', fechaDesde: '', fechaHasta: '' })
const filtrosAplicados = ref({ idBovino: '', fechaDesde: '', fechaHasta: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.idBovino) c++
  if (filtrosAplicados.value.fechaDesde) c++
  if (filtrosAplicados.value.fechaHasta) c++
  return c
})

onMounted(async () => {
  await store.cargarCiclos()
})

function seleccionarFila(celo) {
  if (filaSeleccionada.value?.id_ciclo === celo.id_ciclo) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = celo
    store.limpiarMensajes()
  }
}

function irAFormulario() {
  router.push({ name: 'CeloNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'CeloEditar', params: { id: filaSeleccionada.value.id_ciclo } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Eliminar ciclo #${filaSeleccionada.value.id_ciclo}? Esta acción no se puede deshacer.`)) {
    await store.eliminarCiclo(filaSeleccionada.value.id_ciclo)
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { idBovino: '', fechaDesde: '', fechaHasta: '' }
  filtrosAplicados.value = { idBovino: '', fechaDesde: '', fechaHasta: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

const celosFiltrados = computed(() => {
  return store.ciclos.filter(c => {
    const { idBovino, fechaDesde, fechaHasta } = filtrosAplicados.value
    
    const okBovino = !idBovino || c.id_bovino == idBovino
    const okFechaDesde = !fechaDesde || (c.fecha_inicio && new Date(c.fecha_inicio) >= new Date(fechaDesde))
    const okFechaHasta = !fechaHasta || (c.fecha_inicio && new Date(c.fecha_inicio) <= new Date(fechaHasta))

    return okBovino && okFechaDesde && okFechaHasta
  })
})

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>