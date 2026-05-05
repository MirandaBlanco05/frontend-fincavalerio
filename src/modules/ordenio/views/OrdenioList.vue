<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo Ordeño -->
      <button
        @click="irAFormulario"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Ordeño</span>
      </button>

      <!-- Editar (activo solo si hay fila seleccionada) -->
      <button
        @click="irAEditar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar (activo solo si hay fila seleccionada) -->
      <button
        @click="confirmarEliminar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>
    </div>

    <!-- Alerta de error -->
    <div
      v-if="store.error"
      class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <!-- Alerta de éxito -->
    <div
      v-if="store.mensaje"
      class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <!-- Encabezado -->
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Vaca</th>
            <th class="px-6 py-4">Empleado</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Momento</th>
            <th class="px-6 py-4">Cantidad (L)</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando registros...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="store.ordenios.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay ordeños registrados.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="ord in store.ordenios"
            :key="ord.Id_ordenio"
            @click="seleccionarFila(ord)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.Id_ordenio === ord.Id_ordenio }"
          >
            <td class="px-6 py-3 font-bold">#{{ ord.Id_ordenio }}</td>
            <td class="px-6 py-3 font-medium">{{ ord.BOVINO?.nombre || 'N/A' }}</td>
            <td class="px-6 py-3">{{ ord.EMPLEADO?.nombre || 'EMP-' + ord.Id_empleado }}</td>
            <td class="px-6 py-3">{{ formatearFecha(ord.fecha) }}</td>
            <td class="px-6 py-3">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                :class="ord.Momento_dia === 'Mañana' ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 text-indigo-700'"
              >
                {{ ord.Momento_dia || '—' }}
              </span>
            </td>
            <td class="px-6 py-3 text-right font-bold">{{ ord.Cantidad_total || '0' }} L</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdenioStore } from '../store/ordenio.store.js'

const router = useRouter()
const store  = useOrdenioStore()

// ── Cargar al montar ──────────────────────────────
onMounted(() => store.cargarOrdenios())

// ── Selección de fila ─────────────────────────────
const filaSeleccionada = ref(null)

function seleccionarFila(ordenio) {
  if (filaSeleccionada.value?.Id_ordenio === ordenio.Id_ordenio) {
    filaSeleccionada.value = null   // deseleccionar al hacer clic de nuevo
  } else {
    filaSeleccionada.value = ordenio
    store.limpiarMensajes()
  }
}

// ── Navegación ────────────────────────────────────
function irAFormulario() {
  router.push({ name: 'OrdenioNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'OrdenioEditar', params: { id: filaSeleccionada.value.Id_ordenio } })
}

// ── Eliminar ──────────────────────────────────────
async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const id = filaSeleccionada.value.Id_ordenio
  if (confirm(`¿Eliminar este registro de ordeño? Esta acción no se puede deshacer.`)) {
    await store.eliminarOrdenio(id)
    filaSeleccionada.value = null
  }
}

// ── Utilidades ────────────────────────────────────
function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>
