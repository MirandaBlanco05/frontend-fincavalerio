<template>
  <div class="relative min-h-screen w-full">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="router.push({ name: 'TratamientoNuevo' })" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span><span>Nuevo</span>
      </button>
      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span><span>Editar</span>
      </button>
      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span><span>Eliminar</span>
      </button>
      <button @click="modalFiltros = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
        <span class="material-symbols-outlined text-base">filter_list</span><span>Filtrar</span>
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
            <th class="px-6 py-4">Animal</th>
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Enfermedad</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Inicio</th>
            <th class="px-6 py-4">Fin</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="tratamientosFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">medication</span>
              <p class="mt-2">{{ store.tratamientos?.length === 0 ? 'No hay tratamientos.' : 'No hay resultados.' }}</p>
            </td>
          </tr>
          <tr v-else v-for="t in tratamientosFiltrados" :key="t.id_tratamiento" @click="seleccionarFila(t)" class="cursor-pointer border-b transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_tratamiento === t.id_tratamiento }">
            <td class="px-6 py-3 font-bold">#{{ t.id_tratamiento }}</td>
            <td class="px-6 py-3 font-medium text-primary">{{ t.animal || '—' }}</td>
            <td class="px-6 py-3">{{ t.nombre }}</td>
            <td class="px-6 py-3">{{ t.enfermedad || '—' }}</td>
            <td class="px-6 py-3">{{ t.tipo_tratamiento || '—' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(t.fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(t.fecha_fin) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden"><div class="h-1 w-9 rounded-full bg-gray-300"></div></div>
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold">Filtrar Tratamientos</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"><span class="material-symbols-outlined text-base">close</span></button>
          </div>
          <div class="flex flex-col gap-4 p-4">
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <select v-model="filtros.nombre" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option v-for="nom in nombresUnicos" :key="nom" :value="nom">{{ nom }}</option>
              </select>
            </div>
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
              <select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option v-for="tipo in tiposUnicos" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>
            </div>
            <div><label class="mb-1 block text-sm font-medium text-gray-700">Fecha Inicio Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
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
import { useTratamientoStore } from '../store/tratamiento.store.js'

const router = useRouter(), store = useTratamientoStore()
const filaSeleccionada = ref(null), mensajeExito = ref(''), modalFiltros = ref(false)

const nombresUnicos = computed(() => {
  if (!store.tratamientos) return []
  return [...new Set(store.tratamientos.map(t => t.nombre).filter(Boolean))].sort()
})
const tiposUnicos = computed(() => {
  if (!store.tratamientos) return []
  return [...new Set(store.tratamientos.map(t => t.tipo_tratamiento).filter(Boolean))].sort()
})

const filtros = ref({ nombre: '', tipo: '', fechaDesde: '' })
const filtrosAplicados = ref({ nombre: '', tipo: '', fechaDesde: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.nombre) c++
  if (filtrosAplicados.value.tipo) c++
  if (filtrosAplicados.value.fechaDesde) c++
  return c
})

const tratamientosFiltrados = computed(() => {
  if (!store.tratamientos) return []
  return store.tratamientos.filter(t => {
    const { nombre, tipo, fechaDesde } = filtrosAplicados.value
    if (nombre && t.nombre !== nombre) return false
    if (tipo && t.tipo_tratamiento !== tipo) return false
    if (fechaDesde && t.fecha_inicio && t.fecha_inicio < fechaDesde) return false
    return true
  })
})

function seleccionarFila(t) { filaSeleccionada.value = filaSeleccionada.value?.id_tratamiento === t.id_tratamiento ? null : t; mensajeExito.value = '' }
function irAEditar() { if (!filaSeleccionada.value) return; router.push({ name: 'TratamientoEditar', params: { id: filaSeleccionada.value.id_tratamiento } }) }
async function confirmarEliminar() { if (!filaSeleccionada.value || !confirm('¿Eliminar?')) return; if (await store.eliminarTratamiento(filaSeleccionada.value.id_tratamiento)) { mensajeExito.value = 'Eliminado'; filaSeleccionada.value = null; setTimeout(() => mensajeExito.value = '', 3000) } }
function aplicarFiltros() { filtrosAplicados.value = { ...filtros.value }; modalFiltros.value = false }
function limpiarFiltros() { filtros.value = { nombre: '', tipo: '', fechaDesde: '' }; filtrosAplicados.value = { nombre: '', tipo: '', fechaDesde: '' }; modalFiltros.value = false }
function cerrarFiltros() { modalFiltros.value = false }

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const [year, month, day] = fecha.split('-')
  if (year && month && day) return `${day}/${month}/${year}`
  return new Date(fecha).toLocaleDateString('es-DO')
}

onMounted(() => store.cargarTratamientos())
</script>