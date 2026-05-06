<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Vacuna</span>
      </button>

      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <button @click="modalFiltro = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
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
            <th class="px-6 py-4">Tipo de Vacuna</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Animal</th>
            <th class="px-6 py-4">Insumo</th>
            <th class="px-6 py-4">Empleado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando vacunas...</p>
            </td>
          </tr>
          <tr v-else-if="store.vacunas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay vacunas registradas.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="v in store.vacunas"
            :key="v.id_vacuna"
            @click="seleccionarFila(v)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_vacuna === v.id_vacuna }"
          >
            <td class="px-6 py-3">{{ v.id_vacuna }}</td>
            <td class="px-6 py-3 font-medium">{{ v.tipo_vacuna }}</td>
            <td class="px-6 py-3">{{ formatearFecha(v.fecha) }}</td>
            <td class="px-6 py-3">{{ getNombreBovino(v.id_bovino) }}</td>
            <td class="px-6 py-3">{{ getNombreInsumo(v.id_insumo) }}</td>
            <td class="px-6 py-3">{{ getNombreEmpleado(v.id_empleado) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Filtro -->
    <Teleport to="body">
      <div v-if="modalFiltro" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="modalFiltro = false">
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
import { useVacunaStore } from '../store/vacuna.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'
import insumoService from '@/modules/insumo/services/insumo.service.js'
import { empleadoService } from '@/modules/empleado/services/empleado.service.js'

const router = useRouter()
const store = useVacunaStore()

const filaSeleccionada = ref(null)
const modalFiltro = ref(false)
const filtroBovinoId = ref('')
const bovinos = ref([])
const insumos = ref([])
const empleados = ref([])

onMounted(async () => {
  await store.cargarVacunas()
  await cargarDatosAuxiliares()
})

async function cargarDatosAuxiliares() {
  try {
    const [bovinosRes, insumosRes, empleadosRes] = await Promise.all([
      bovinoService.listar(),
      insumoService.listar(),
      empleadoService.listar()
    ])
    bovinos.value = bovinosRes.data
    insumos.value = insumosRes.data
    empleados.value = empleadosRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

function seleccionarFila(vacuna) {
  filaSeleccionada.value = filaSeleccionada.value?.id_vacuna === vacuna.id_vacuna ? null : vacuna
}

function irAFormulario() {
  router.push({ name: 'VacunaNueva' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'VacunaEditar', params: { id: filaSeleccionada.value.id_vacuna } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm('¿Eliminar este registro de vacuna?')) {
    await store.eliminarVacuna(filaSeleccionada.value.id_vacuna)
    filaSeleccionada.value = null
  }
}

function aplicarFiltro() {
  if (filtroBovinoId.value) {
    store.cargarVacunasPorBovino(filtroBovinoId.value)
  } else {
    store.cargarVacunas()
  }
  modalFiltro.value = false
}

function limpiarFiltro() {
  filtroBovinoId.value = ''
  store.cargarVacunas()
  modalFiltro.value = false
}

function getNombreBovino(id) {
  const bovino = bovinos.value.find(b => b.id_bovino === id)
  return bovino ? bovino.nombre : 'N/A'
}

function getNombreInsumo(id) {
  const insumo = insumos.value.find(i => i.id_insumo === id)
  return insumo ? insumo.nombre : 'N/A'
}

function getNombreEmpleado(id) {
  const empleado = empleados.value.find(e => e.id_empleado === id)
  return empleado ? empleado.nombre : 'N/A'
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>