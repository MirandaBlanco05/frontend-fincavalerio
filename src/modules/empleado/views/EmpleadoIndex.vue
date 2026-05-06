<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Empleado</span>
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
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Nacionalidad</th>
            <th class="px-6 py-4">Cédula</th>
            <th class="px-6 py-4">Teléfono</th>
            <th class="px-6 py-4">Contrato</th>
            <th class="px-6 py-4">Puesto</th>
            <th class="px-6 py-4">Salario</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando empleados...</p>
            </td>
          </tr>

          <tr v-else-if="empleadosFiltrados.length === 0">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">badge</span>
              <p class="mt-2">{{ store.empleados.length === 0 ? 'No hay empleados registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="e in empleadosFiltrados" :key="e.id_empleado" @click="seleccionarFila(e)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_empleado === e.id_empleado }">
            <td class="px-6 py-3 font-bold">#{{ e.id_empleado }}</td>
            <td class="px-6 py-3 font-medium">{{ e.nombre }}</td>
            <td class="px-6 py-3">{{ e.nacionalidad || '—' }}</td>
            <td class="px-6 py-3">{{ e.cedula || '—' }}</td>
            <td class="px-6 py-3">{{ e.telefono || '—' }}</td>
            <td class="px-6 py-3">{{ e.tipo_contrato || '—' }}</td>
            <td class="px-6 py-3">{{ e.puesto || '—' }}</td>
            <td class="px-6 py-3">RD$ {{ formatearMonto(e.salario) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="modalFiltros = false">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>

          <div class="flex items-center justify-between p-4">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Empleados</h3>
            <button @click="modalFiltros = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Nacionalidad</label>
              <select v-model="filtros.nacionalidad" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todas</option>
                <option v-for="nac in nacionalidadesUnicas" :key="nac" :value="nac">{{ nac }}</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Puesto</label>
              <select v-model="filtros.puesto" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los puestos</option>
                <option v-for="puesto in puestosUnicos" :key="puesto" :value="puesto">{{ puesto }}</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 p-4">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30">
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
import { useEmpleadoStore } from '../store/empleado.store.js'

const router = useRouter()
const store = useEmpleadoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ nacionalidad: '', puesto: '' })
const filtrosAplicados = ref({ nacionalidad: '', puesto: '' })

onMounted(() => {
  store.cargarEmpleados()
})

function seleccionarFila(empleado) {
  if (filaSeleccionada.value?.id_empleado === empleado.id_empleado) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = empleado
    store.limpiarMensajes?.()
  }
}

function irAFormulario() {
  router.push({ name: 'EmpleadoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'EmpleadoEditar', params: { id: filaSeleccionada.value.id_empleado } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const nombre = filaSeleccionada.value.nombre
  if (confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) {
    store.eliminarEmpleado(filaSeleccionada.value.id_empleado)
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { nacionalidad: '', puesto: '' }
  filtrosAplicados.value = { nacionalidad: '', puesto: '' }
  modalFiltros.value = false
}

const nacionalidadesUnicas = computed(() => {
  return [...new Set(store.empleados.map(e => e.nacionalidad).filter(Boolean))].sort()
})

const puestosUnicos = computed(() => {
  return [...new Set(store.empleados.map(e => e.puesto).filter(Boolean))].sort()
})

const empleadosFiltrados = computed(() => {
  return store.empleados.filter(e => {
    const { nacionalidad, puesto } = filtrosAplicados.value

    if (nacionalidad && e.nacionalidad !== nacionalidad) return false
    if (puesto && e.puesto !== puesto) return false

    return true
  })
})

function formatearMonto(monto) {
  if (!monto) return '0.00'
  return Number(monto).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>