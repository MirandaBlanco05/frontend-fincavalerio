<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Tratamiento</span>
      </button>

      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
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
          <tr v-else-if="store.tratamientos.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay tratamientos registrados.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="t in store.tratamientos"
            :key="t.id_tratamiento"
            @click="seleccionarFila(t)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_tratamiento === t.id_tratamiento }"
          >
            <td class="px-6 py-3">{{ t.id_tratamiento }}</td>
            <td class="px-6 py-3 font-medium">{{ t.nombre }}</td>
            <td class="px-6 py-3">{{ t.tipo_tratamiento }}</td>
            <td class="px-6 py-3">{{ getNombreEnfermedad(t.id_enfermedad) }}</td>
            <td class="px-6 py-3">{{ getNombreEmpleado(t.id_empleado) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(t.fecha_inicio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(t.fecha_fin) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTratamientoStore } from '../store/tratamiento.store.js'
import enfermedadService from '@/modules/enfermedad/services/enfermedad.service.js'
import { empleadoService } from '@/modules/empleado/services/empleado.service.js'

const router = useRouter()
const store = useTratamientoStore()

const filaSeleccionada = ref(null)
const enfermedades = ref([])
const empleados = ref([])

onMounted(async () => {
  await store.cargarTratamientos()
  await cargarDatosAuxiliares()
})

async function cargarDatosAuxiliares() {
  try {
    const [enfermedadesRes, empleadosRes] = await Promise.all([
      enfermedadService.listar(),
      empleadoService.listar()
    ])
    enfermedades.value = enfermedadesRes.data
    empleados.value = empleadosRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

function seleccionarFila(tratamiento) {
  filaSeleccionada.value = filaSeleccionada.value?.id_tratamiento === tratamiento.id_tratamiento ? null : tratamiento
}

function irAFormulario() {
  router.push({ name: 'TratamientoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'TratamientoEditar', params: { id: filaSeleccionada.value.id_tratamiento } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm('¿Eliminar este registro de tratamiento?')) {
    await store.eliminarTratamiento(filaSeleccionada.value.id_tratamiento)
    filaSeleccionada.value = null
  }
}

function getNombreEnfermedad(id) {
  const enfermedad = enfermedades.value.find(e => e.id_enfermedad === id)
  return enfermedad ? enfermedad.nombre : 'N/A'
}

function getNombreEmpleado(id) {
  const empleado = empleados.value.find(e => e.id_empleado === id)
  return empleado ? empleado.nombre : 'N/A'
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>