<template>
  <div class="relative min-h-screen w-full">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Embarazo</span>
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
            <th class="px-6 py-4">Fase</th>
            <th class="px-6 py-4">Fecha Secado</th>
            <th class="px-6 py-4">Fecha Prevista Parto</th>
            <th class="px-6 py-4">Veterinario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="embarazosFiltrados.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">pregnant_woman</span>
              <p class="mt-2">{{ store.embarazos?.length === 0 ? 'No hay embarazos.' : 'No hay resultados.' }}</p>
            </td>
          </tr>
          <tr v-else v-for="emb in embarazosFiltrados" :key="emb.id_embarazo" @click="seleccionarFila(emb)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_embarazo === emb.id_embarazo }">
            <td class="px-6 py-3 font-bold">#{{ emb.id_embarazo }}</td>
            <td class="px-6 py-3">{{ emb.fase || '—' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(emb.fecha_secado) }}</td>
            <td class="px-6 py-3 font-medium">{{ formatearFecha(emb.fecha_prevista_parto) }}</td>
            <td class="px-6 py-3">{{ emb.veterinario?.nombre || emb.id_veterinario || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden"><div class="h-1 w-9 rounded-full bg-gray-300"></div></div>
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold">Filtrar Embarazos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"><span class="material-symbols-outlined text-base">close</span></button>
          </div>
          <div class="flex flex-col gap-4 p-4">
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Fase</label>
              <input v-model="filtros.fase" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Ej: Primer trimestre" />
            </div>
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Parto Previsto Desde</label>
              <input v-model="filtros.partoDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Parto Previsto Hasta</label>
              <input v-model="filtros.partoHasta" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200">Limpiar</button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">Aplicar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmbarazoStore } from './store/Embarazo.store.js'

const router = useRouter()
const store = useEmbarazoStore()
const filaSeleccionada = ref(null)
const mensajeExito = ref('')
const modalFiltros = ref(false)

const filtros = ref({ fase: '', partoDesde: '', partoHasta: '' })
const filtrosAplicados = ref({ fase: '', partoDesde: '', partoHasta: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.fase) c++
  if (filtrosAplicados.value.partoDesde) c++
  if (filtrosAplicados.value.partoHasta) c++
  return c
})

const embarazosFiltrados = computed(() => {
  if (!store.embarazos) return []
  return store.embarazos.filter(emb => {
    const { fase, partoDesde, partoHasta } = filtrosAplicados.value
    if (fase && !emb.fase?.toLowerCase().includes(fase.toLowerCase())) return false
    if (partoDesde && emb.fecha_prevista_parto && new Date(emb.fecha_prevista_parto) < new Date(partoDesde)) return false
    if (partoHasta && emb.fecha_prevista_parto && new Date(emb.fecha_prevista_parto) > new Date(partoHasta)) return false
    return true
  })
})

function seleccionarFila(emb) {
  filaSeleccionada.value = filaSeleccionada.value?.id_embarazo === emb.id_embarazo ? null : emb
  mensajeExito.value = ''
}

function irAFormulario() {
  router.push({ name: 'EmbarazoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'EmbarazoEditar', params: { id: filaSeleccionada.value.id_embarazo } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm('¿Eliminar este embarazo?')) {
    const ok = await store.eliminarEmbarazo(filaSeleccionada.value.id_embarazo)
    if (ok) {
      mensajeExito.value = 'Embarazo eliminado'
      filaSeleccionada.value = null
      setTimeout(() => mensajeExito.value = '', 3000)
    }
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { fase: '', partoDesde: '', partoHasta: '' }
  filtrosAplicados.value = { fase: '', partoDesde: '', partoHasta: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}

onMounted(() => {
  store.cargarEmbarazos()
})
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>