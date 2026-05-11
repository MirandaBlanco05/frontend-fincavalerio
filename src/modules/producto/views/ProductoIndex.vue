<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Producto</span>
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
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Descripción</th>
            <th class="px-6 py-4">Stock</th>
            <th class="px-6 py-4">Peso</th>
            <th class="px-6 py-4">Precio Costo</th>
            <th class="px-6 py-4">Precio Venta</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando productos...</p>
            </td>
          </tr>

          <tr v-else-if="productosFiltrados.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">inventory_2</span>
              <p class="mt-2">{{ store.productos.length === 0 ? 'No hay productos registrados.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="p in productosFiltrados" :key="p.id_producto" @click="seleccionarFila(p)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_producto === p.id_producto }">
            <td class="px-6 py-3 font-bold">#{{ p.id_producto }}</td>
            <td class="px-6 py-3">{{ p.tipo || '—' }}</td>
            <td class="px-6 py-3 font-medium">{{ p.descripcion }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                {{ p.stock }}
              </span>
            </td>
            <td class="px-6 py-3">{{ p.peso ? p.peso + ' kg' : '—' }}</td>
            <td class="px-6 py-3">RD$ {{ formatearMonto(p.precio_costo) }}</td>
            <td class="px-6 py-3">RD$ {{ formatearMonto(p.precio_venta) }}</td>
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Productos</h3>
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

            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="filtros.stockBajo" id="stockBajo" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label for="stockBajo" class="text-sm font-medium cursor-pointer">Solo productos con stock bajo (&lt; 10)</label>
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
import { useProductoStore } from '../store/producto.store.js'

const router = useRouter()
const store = useProductoStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const filtros = ref({ tipo: '', stockBajo: false })
const filtrosAplicados = ref({ tipo: '', stockBajo: false })

onMounted(() => {
  store.cargarProductos()
})

function seleccionarFila(producto) {
  if (filaSeleccionada.value?.id_producto === producto.id_producto) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = producto
    store.limpiarMensajes?.()
  }
}

function irAFormulario() {
  router.push({ name: 'ProductoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'ProductoEditar', params: { id: filaSeleccionada.value.id_producto } })
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const nombre = filaSeleccionada.value.descripcion
  if (confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
    store.eliminarProducto(filaSeleccionada.value.id_producto)
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { tipo: '', stockBajo: false }
  filtrosAplicados.value = { tipo: '', stockBajo: false }
  modalFiltros.value = false
}

const tiposUnicos = computed(() => {
  return [...new Set(store.productos.map(p => p.tipo).filter(Boolean))].sort()
})

const productosFiltrados = computed(() => {
  return store.productos.filter(p => {
    const { tipo, stockBajo } = filtrosAplicados.value

    if (tipo && p.tipo !== tipo) return false
    if (stockBajo && p.stock >= 10) return false

    return true
  })
})

function formatearMonto(monto) {
  if (!monto) return '0.00'
  return Number(monto).toFixed(2)
}
</script>