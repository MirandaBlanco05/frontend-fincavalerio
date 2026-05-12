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
        <span class="truncate">Nuevo Embarazo</span>
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


    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Bovino</th>
            <th class="px-6 py-4">Inseminación</th>
            <th class="px-6 py-4">Veterinario</th>
            <th class="px-6 py-4">Fase</th>
            <th class="px-6 py-4">Fecha Secado</th>
            <th class="px-6 py-4">Fecha Parto (Prevista)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="embarazosFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay registros.</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="e in embarazosFiltrados"
            :key="e.id_embarazo || e.Id_embarazo"
            @click="seleccionarFila(e)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_embarazo === (e.id_embarazo || e.Id_embarazo) }"
          >
            <td class="px-6 py-3 font-medium">#{{ e.id_embarazo || e.Id_embarazo }}</td>
            <td class="px-6 py-3 font-bold text-primary">{{ e.INSEMINACION?.ciclo?.bovino?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">#{{ e.INSEMINACION?.id_inseminacion || e.id_inseminacion || e.Id_inseminacion }}</td>
            <td class="px-6 py-3">{{ e.VETERINARIO?.nombre || e.veterinario?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {{ e.fase || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-3">{{ e.fecha_secado || e.Fecha_secado || 'N/A' }}</td>
            <td class="px-6 py-3">{{ e.fecha_prevista_parto || e.Fecha_prevista_parto }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="modalEliminar = false">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-200"></div>
          </div>

          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-red-600">warning</span>
              <h3 class="text-lg font-bold text-text-primary">Eliminar Embarazo</h3>
            </div>
            <button @click="modalEliminar = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-3 p-6 text-center">
            <p>¿Está seguro que desea eliminar el embarazo <strong>#{{ filaSeleccionada?.id_embarazo || filaSeleccionada?.Id_embarazo }}</strong>?</p>
            <p class="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="modalEliminar = false" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
              Cancelar
            </button>
            <button @click="eliminarEmbarazo" class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
              <span class="material-symbols-outlined text-base">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { useEmbarazoStore } from "./store/Embarazo.store.js"

const router = useRouter()
const store = useEmbarazoStore()

const search = ref("")
const filaSeleccionada = ref(null)
const modalEliminar = ref(false)

const embarazosFiltrados = computed(() => {
  if (!search.value) return store.embarazos
  const query = search.value.toLowerCase()
  return store.embarazos.filter(e => 
    e.VETERINARIO?.nombre?.toLowerCase().includes(query) ||
    e.INSEMINACION?.ciclo?.bovino?.nombre?.toLowerCase().includes(query) ||
    (e.INSEMINACION?.id_inseminacion || e.INSEMINACION?.Id_inseminacion)?.toString().includes(query) ||
    (e.id_embarazo || e.Id_embarazo)?.toString().includes(query) ||
    e.fase?.toLowerCase().includes(query)
  )
})

function seleccionarFila(fila) {
  const currentId = filaSeleccionada.value ? (filaSeleccionada.value.id_embarazo || filaSeleccionada.value.Id_embarazo) : null;
  const newId = fila.id_embarazo || fila.Id_embarazo;
  
  if (currentId === newId) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = fila
  }
}

function irAFormulario() {
  router.push('/embarazos/nuevo')
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'EmbarazoNuevo' }) 
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarEmbarazo() {
  if (!filaSeleccionada.value) return
  const id = filaSeleccionada.value.id_embarazo || filaSeleccionada.value.Id_embarazo;
  if (store.eliminarEmbarazo) {
    await store.eliminarEmbarazo(id)
  }
  modalEliminar.value = false
  filaSeleccionada.value = null
}

onMounted(() => {
  store.cargarEmbarazos()
})
</script>
