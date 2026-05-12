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
        <span class="truncate">Nuevo Veterinario</span>
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
    </div>


    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <!-- Encabezado -->
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Cédula</th>
            <th class="px-6 py-4">Teléfono</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando veterinarios...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="store.veterinarios.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay veterinarios registrados.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="v in store.veterinarios"
            :key="v.id_veterinario"
            @click="seleccionarFila(v)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_veterinario === v.id_veterinario }"
          >
            <td class="px-6 py-3">{{ v.id_veterinario }}</td>
            <td class="px-6 py-3 font-medium">{{ v.nombre }}</td>
            <td class="px-6 py-3">{{ v.cedula }}</td>
            <td class="px-6 py-3">{{ v.telefono || '—' }}</td>
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
              <h3 class="text-lg font-bold text-text-primary">Eliminar Veterinario</h3>
            </div>
            <button @click="modalEliminar = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-3 p-6 text-center">
            <p>¿Está seguro que desea eliminar a <strong>{{ filaSeleccionada?.nombre }}</strong>?</p>
            <p class="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="modalEliminar = false" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
              Cancelar
            </button>
            <button @click="eliminarVeterinario" class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVeterinarioStore } from '../store/veterinario.store.js'

const router = useRouter()
const store = useVeterinarioStore()

onMounted(() => store.cargarVeterinarios())

const filaSeleccionada = ref(null)
const modalEliminar = ref(false)

function seleccionarFila(veterinario) {
  if (filaSeleccionada.value?.id_veterinario === veterinario.id_veterinario) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = veterinario
  }
}

function irAFormulario() {
  router.push({ name: 'VeterinarioNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'VeterinarioEditar', params: { id: filaSeleccionada.value.id_veterinario } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarVeterinario() {
  if (!filaSeleccionada.value) return
  await store.eliminarVeterinario(filaSeleccionada.value.id_veterinario)
  modalEliminar.value = false
  filaSeleccionada.value = null
}
</script>