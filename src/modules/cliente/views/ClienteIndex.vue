<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Cliente</span>
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
            <th class="px-6 py-4">RNC</th>
            <th class="px-6 py-4">Teléfono</th>
            <th class="px-6 py-4">Correo</th>
            <th class="px-6 py-4">Provincia</th>
            <th class="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando clientes...</p>
            </td>
          </tr>

          <tr v-else-if="clientesFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">groups</span>
              <p class="mt-2">{{ store.clientes.length === 0 ? 'No hay clientes registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="c in clientesFiltrados" :key="c.id_cliente" @click="seleccionarFila(c)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_cliente === c.id_cliente }">
            <td class="px-6 py-3 font-bold">#{{ c.id_cliente }}</td>
            <td class="px-6 py-3 font-medium">{{ c.nombre }}</td>
            <td class="px-6 py-3 font-mono text-xs">{{ c.rnc || '—' }}</td>
            <td class="px-6 py-3">{{ c.telefono || '—' }}</td>
            <td class="px-6 py-3">{{ c.correo || '—' }}</td>
            <td class="px-6 py-3">{{ c.provincia || '—' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="c.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                {{ c.estado }}
              </span>
            </td>
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Clientes</h3>
            <button @click="modalFiltros = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Estado</label>
              <select v-model="filtros.estado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option v-for="estado in estadosUnicos" :key="estado" :value="estado">{{ estado }}</option>
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
import { useClienteStore } from '../store/cliente.store.js'

const router = useRouter()
const store = useClienteStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ estado: '' })
const filtrosAplicados = ref({ estado: '' })

onMounted(() => {
  store.cargarClientes()
})

function seleccionarFila(cliente) {
  if (filaSeleccionada.value?.id_cliente === cliente.id_cliente) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = cliente
    store.limpiarMensajes?.()
  }
}

function irAFormulario() {
  router.push({ name: 'ClienteNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'ClienteEditar', params: { id: filaSeleccionada.value.id_cliente } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const nombre = filaSeleccionada.value.nombre
  if (confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) {
    store.eliminarCliente(filaSeleccionada.value.id_cliente)
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { estado: '' }
  filtrosAplicados.value = { estado: '' }
  modalFiltros.value = false
}

const estadosUnicos = computed(() => {
  return [...new Set(store.clientes.map(c => c.estado).filter(Boolean))].sort()
})

const clientesFiltrados = computed(() => {
  return store.clientes.filter(c => {
    const { estado } = filtrosAplicados.value

    if (estado && c.estado !== estado) return false

    return true
  })
})
</script>