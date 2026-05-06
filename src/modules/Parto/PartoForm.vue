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
        <span class="truncate">Nuevo Parto</span>
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
            <th class="px-6 py-4">ID Parto</th>
            <th class="px-6 py-4">ID Embarazo</th>
            <th class="px-6 py-4">Fecha del Parto</th>
            <th class="px-6 py-4">Crías</th>
            <th class="px-6 py-4">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="partosFiltrados.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay registros.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="p in partosFiltrados"
            :key="p.Id_parto"
            @click="seleccionarFila(p)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.Id_parto === p.Id_parto }"
          >
            <td class="px-6 py-3 font-medium">{{ p.Id_parto }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {{ p.EMBARAZO ? p.EMBARAZO.Id_embarazo : p.Id_embarazo }}
              </span>
            </td>
            <td class="px-6 py-3">{{ p.fecha_parto }}</td>
            <td class="px-6 py-3">{{ p.Numero_crias || '0' }}</td>
            <td class="px-6 py-3">{{ p.observaciones || 'Ninguna' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { usePartoStore } from "./store/Parto.store.js"

const router = useRouter()
const store = usePartoStore()

const search = ref("")
const filaSeleccionada = ref(null)

const partosFiltrados = computed(() => {
  if (!search.value) return store.partos
  const query = search.value.toLowerCase()
  return store.partos.filter(p => 
    p.Id_parto?.toString().includes(query) ||
    p.Id_embarazo?.toString().includes(query) ||
    p.observaciones?.toLowerCase().includes(query)
  )
})

function seleccionarFila(fila) {
  if (filaSeleccionada.value?.Id_parto === fila.Id_parto) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = fila
  }
}

function irAFormulario() {
  router.push('/partos/nuevo')
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'PartoNuevo' })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Eliminar el parto ${filaSeleccionada.value.Id_parto}? Esta acción no se puede deshacer.`)) {
    if (store.eliminarParto) {
      await store.eliminarParto(filaSeleccionada.value.Id_parto)
    } else {
      console.warn('eliminarParto no implementado en store')
    }
    filaSeleccionada.value = null
  }
}

onMounted(() => {
  store.cargarPartos()
})
</script>