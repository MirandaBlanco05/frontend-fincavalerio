<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Insumo</span>
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
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Uso</th>
            <th class="px-6 py-4">Stock</th>
            <th class="px-6 py-4">Precio</th>
            <th class="px-6 py-4">Vencimiento</th>
            <th class="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando insumos...</p>
            </td>
          </tr>

          <tr v-else-if="insumosFiltrados.length === 0">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">inventory</span>
              <p class="mt-2">{{ store.insumos.length === 0 ? 'No hay insumos registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="i in insumosFiltrados" :key="i.id_insumo" @click="seleccionarFila(i)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_insumo === i.id_insumo }">
            <td class="px-6 py-3 font-bold">#{{ i.id_insumo }}</td>
            <td class="px-6 py-3 font-medium">{{ i.nombre }}</td>
            <td class="px-6 py-3">{{ i.tipo_insumo || '—' }}</td>
            <td class="px-6 py-3">{{ i.uso || '—' }}</td>
            <td class="px-6 py-3">{{ i.cantidad_stock }}</td>
            <td class="px-6 py-3">RD$ {{ formatearMonto(i.precio) }}</td>
            <td class="px-6 py-3">{{ formatearFecha(i.fecha_vencimiento) }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="i.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                {{ i.estado }}
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Insumos</h3>
            <button @click="modalFiltros = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Tipo</label>
              <select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos los tipos</option>
                <option v-for="tipo in tiposUnicos" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Estado</label>
              <select v-model="filtros.estado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="filtros.porVencer" id="porVencer" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label for="porVencer" class="text-sm font-medium cursor-pointer">Por vencer en 30 días</label>
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
import { useInsumoStore } from '../store/insumo.store.js'

const router = useRouter()
const store = useInsumoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ tipo: '', estado: '', porVencer: false })
const filtrosAplicados = ref({ tipo: '', estado: '', porVencer: false })

onMounted(() => {
  store.cargarInsumos()
})

function seleccionarFila(insumo) {
  if (filaSeleccionada.value?.id_insumo === insumo.id_insumo) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = insumo
    store.limpiarMensajes?.()
  }
}

function irAFormulario() {
  router.push({ name: 'InsumoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'InsumoEditar', params: { id: filaSeleccionada.value.id_insumo } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const nombre = filaSeleccionada.value.nombre
  if (confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
    store.eliminarInsumo(filaSeleccionada.value.id_insumo)
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { tipo: '', estado: '', porVencer: false }
  filtrosAplicados.value = { tipo: '', estado: '', porVencer: false }
  modalFiltros.value = false
}

const tiposUnicos = computed(() => {
  return [...new Set(store.insumos.map(i => i.tipo_insumo).filter(Boolean))].sort()
})

const insumosFiltrados = computed(() => {
  return store.insumos.filter(i => {
    const { tipo, estado, porVencer } = filtrosAplicados.value

    if (tipo && i.tipo_insumo !== tipo) return false
    if (estado && i.estado !== estado) return false

    if (porVencer && i.fecha_vencimiento) {
      const hoy = new Date()
      const vencimiento = new Date(i.fecha_vencimiento)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      if (diasRestantes > 30 || diasRestantes < 0) return false
    }

    return true
  })
})

function formatearMonto(monto) {
  if (!monto) return '0.00'
  return Number(monto).toFixed(2)
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>