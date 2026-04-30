<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo -->
      <button
        @click="irAFormulario"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Inseminación</span>
      </button>

      <!-- Editar -->
      <button
        @click="irAEditar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar -->
      <button
        @click="confirmarEliminar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <!-- Búsqueda -->
      <div class="relative flex flex-1 items-center min-w-[200px] sm:flex-none">
        <span class="material-symbols-outlined absolute left-3 text-gray-400 text-base">search</span>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar..."
          class="w-full rounded-lg border border-border-color bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>

    <!-- Alertas -->
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
            <th class="px-6 py-4">Veterinario</th>
            <th class="px-6 py-4">Ciclo</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Resultado</th>
            <th class="px-6 py-4">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="inseminacionesFiltradas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay registros.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="i in inseminacionesFiltradas"
            :key="i.Id_inseminacion"
            @click="seleccionarFila(i)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.Id_inseminacion === i.Id_inseminacion }"
          >
            <td class="px-6 py-3 font-medium">{{ i.Id_inseminacion }}</td>
            <td class="px-6 py-3">{{ i.veterinario ? i.veterinario.nombre : 'N/A' }}</td>
            <td class="px-6 py-3">{{ i.ciclo ? i.ciclo.Id_ciclo : 'N/A' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {{ i.Tipo_inseminacion }}
              </span>
            </td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="estadoColor(i.resultado)">
                {{ i.resultado }}
              </span>
            </td>
            <td class="px-6 py-3">{{ i.fecha }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { useInseminacionStore } from "./store/Inseminacion.store.js"

const router = useRouter()
const store = useInseminacionStore()

const search = ref("")
const filaSeleccionada = ref(null)

const inseminacionesFiltradas = computed(() => {
  if (!search.value) return store.inseminaciones
  const query = search.value.toLowerCase()
  return store.inseminaciones.filter(i => 
    i.veterinario?.nombre?.toLowerCase().includes(query) ||
    i.ciclo?.Id_ciclo?.toString().includes(query) ||
    i.Id_inseminacion?.toString().includes(query) ||
    i.Tipo_inseminacion?.toLowerCase().includes(query) ||
    i.resultado?.toLowerCase().includes(query)
  )
})

function seleccionarFila(fila) {
  if (filaSeleccionada.value?.Id_inseminacion === fila.Id_inseminacion) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = fila
  }
}

function irAFormulario() {
  router.push('/inseminaciones/nuevo')
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'InseminacionNueva' }) 
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Eliminar la inseminación ${filaSeleccionada.value.Id_inseminacion}? Esta acción no se puede deshacer.`)) {
    if (store.eliminarInseminacion) {
      await store.eliminarInseminacion(filaSeleccionada.value.Id_inseminacion)
    }
    filaSeleccionada.value = null
  }
}

function estadoColor(estado) {
  if(estado === "Efectiva") return "bg-green-100 text-green-700"
  if(estado === "Pendiente") return "bg-yellow-100 text-yellow-700"
  if(estado === "Inefectiva") return "bg-red-100 text-red-700"
  return "bg-gray-100 text-gray-700"
}

onMounted(() => {
  store.cargarInseminaciones()
})
</script>