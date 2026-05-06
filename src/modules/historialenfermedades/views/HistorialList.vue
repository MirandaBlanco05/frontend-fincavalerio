<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button
        @click="irAFormulario"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Registro</span>
      </button>

      <button
        @click="irAEditar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button
        @click="confirmarEliminar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <!-- Filtro por Animal -->
      <button
        @click="modalFiltro = true"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">filter_list</span>
        <span class="truncate">Filtrar</span>
      </button>
    </div>

    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Animal</th>
            <th class="px-6 py-4">Enfermedad</th>
            <th class="px-6 py-4">Causa</th>
            <th class="px-6 py-4">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando historial...</p>
            </td>
          </tr>
          <tr v-else-if="store.historiales.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay registros de historial.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="h in store.historiales"
            :key="h.id_historial"
            @click="seleccionarFila(h)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_historial === h.id_historial }"
          >
            <td class="px-6 py-3">{{ h.id_historial }}</td>
            <td class="px-6 py-3 font-medium">{{ getNombreBovino(h.id_bovino) }}</td>
            <td class="px-6 py-3">{{ getNombreEnfermedad(h.id_enfermedad) }}</td>
            <td class="px-6 py-3">{{ getCausaEnfermedad(h.id_enfermedad) }}</td>
            <td class="px-6 py-3">{{ h.fecha ? formatearFecha(h.fecha) : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Filtro -->
    <Teleport to="body">
      <div
        v-if="modalFiltro"
        class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center"
        @click.self="modalFiltro = false"
      >
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex items-center justify-between p-4">
            <h3 class="text-lg font-bold text-text-primary">Filtrar por Animal</h3>
            <button @click="modalFiltro = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <div class="p-4">
            <label class="mb-1 block text-sm font-medium">Animal</label>
            <select v-model="filtroBovinoId" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
              <option value="">Todos los animales</option>
              <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">{{ b.nombre }}</option>
            </select>
          </div>
          <div class="flex gap-3 p-4">
            <button @click="limpiarFiltro" class="flex-1 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary">Limpiar</button>
            <button @click="aplicarFiltro" class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Aplicar</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistorialStore } from '../store/historial.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'
import enfermedadService from '@/modules/enfermedad/services/enfermedad.service.js'

const router = useRouter()
const store = useHistorialStore()

const filaSeleccionada = ref(null)
const modalFiltro = ref(false)
const filtroBovinoId = ref('')
const bovinos = ref([])
const enfermedades = ref([])

onMounted(async () => {
  await store.cargarHistoriales()
  await cargarDatosAuxiliares()
})

async function cargarDatosAuxiliares() {
  try {
    const [bovinosRes, enfermedadesRes] = await Promise.all([
      bovinoService.listar(),
      enfermedadService.listar()
    ])
    bovinos.value = bovinosRes.data
    enfermedades.value = enfermedadesRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

function seleccionarFila(historial) {
  filaSeleccionada.value = filaSeleccionada.value?.id_historial === historial.id_historial ? null : historial
}

function irAFormulario() {
  router.push({ name: 'HistorialNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'HistorialEditar', params: { id: filaSeleccionada.value.id_historial } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm('¿Eliminar este registro del historial?')) {
    await store.eliminarHistorial(filaSeleccionada.value.id_historial)
    filaSeleccionada.value = null
  }
}

function aplicarFiltro() {
  if (filtroBovinoId.value) {
    store.cargarHistorialesPorBovino(filtroBovinoId.value)
  } else {
    store.cargarHistoriales()
  }
  modalFiltro.value = false
}

function limpiarFiltro() {
  filtroBovinoId.value = ''
  store.cargarHistoriales()
  modalFiltro.value = false
}

function getNombreBovino(id) {
  const bovino = bovinos.value.find(b => b.id_bovino === id)
  return bovino ? bovino.nombre : 'N/A'
}

function getNombreEnfermedad(id) {
  const enfermedad = enfermedades.value.find(e => e.id_enfermedad === id)
  return enfermedad ? enfermedad.nombre : 'N/A'
}

function getCausaEnfermedad(id) {
  const enfermedad = enfermedades.value.find(e => e.id_enfermedad === id)
  return enfermedad ? enfermedad.causa : '—'
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>