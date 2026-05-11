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

      <div class="relative flex flex-1 items-center min-w-[200px] sm:flex-none">
        <span class="material-symbols-outlined absolute left-3 text-gray-400 text-base">search</span>
        <input v-model="busqueda" type="text" placeholder="Buscar inseminación..." class="w-full rounded-lg border border-border-color bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInseminacionStore } from './store/inseminacion.store.js'

const router = useRouter()
const store = useInseminacionStore()

const filaSeleccionada = ref(null)
const busqueda = ref('')

onMounted(() => {
  store.cargarInseminaciones()
})

const inseminacionesFiltradas = computed(() => {
  if (!busqueda.value) return store.inseminaciones
  const b = busqueda.value.toLowerCase()
  return store.inseminaciones.filter(i => {
    return (
      i.id_inseminacion?.toString().includes(b) ||
      i.veterinario?.nombre?.toLowerCase().includes(b) ||
      i.ciclo?.bovino?.nombre?.toLowerCase().includes(b) ||
      i.resultado?.toLowerCase().includes(b)
    )
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