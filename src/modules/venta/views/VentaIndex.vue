<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irANuevaFactura" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Factura</span>
      </button>

      <button @click="editarVenta()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
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
            <th class="px-6 py-4">Cliente</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">NCF</th>
            <th class="px-6 py-4">Concepto</th>
            <th class="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando facturas...</p>
            </td>
          </tr>

          <tr v-else-if="ventasFiltradas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">receipt_long</span>
              <p class="mt-2">{{ store.ventas.length === 0 ? 'No hay facturas registradas.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="venta in ventasFiltradas" :key="venta.id_venta" @click="seleccionarFila(venta)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_venta === venta.id_venta }">
            <td class="px-6 py-3 font-bold">#{{ venta.id_venta }}</td>
            <td class="px-6 py-3">
              <p class="font-medium">{{ venta.cliente?.nombre || 'N/A' }}</p>
              <p class="text-xs text-gray-500">RNC: {{ venta.cliente?.rnc || 'N/A' }}</p>
            </td>
            <td class="px-6 py-3">{{ formatearFecha(venta.fecha) }}</td>
            <td class="px-6 py-3 font-mono text-xs">{{ venta.ncf_completo || 'N/A' }}</td>
            <td class="px-6 py-3">{{ venta.concepto || '—' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="venta.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ venta.estado }}
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
            <h3 class="text-lg font-bold text-text-primary">Filtrar Facturas</h3>
            <button @click="modalFiltros = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Estado</label>
              <select v-model="filtros.estado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Fecha Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Fecha Hasta</label>
              <input v-model="filtros.fechaHasta" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
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

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="modalEliminar = false">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>

          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-red-600">warning</span>
              <h3 class="text-lg font-bold text-text-primary">Eliminar Factura</h3>
            </div>
            <button @click="modalEliminar = false" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-3 p-6 text-center">
            <p>¿Está seguro que desea eliminar esta factura?</p>
            <p class="text-sm text-gray-500">El NCF será restaurado como disponible.</p>
          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="modalEliminar = false" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
              Cancelar
            </button>
            <button @click="eliminarVenta" class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVentaStore } from '@/modules/venta/store/venta.store.js'

const router = useRouter()
const store = useVentaStore()

const filaSeleccionada = ref(null)
const modalEliminar = ref(false)
const modalFiltros = ref(false)
const filtros = ref({ estado: '', fechaDesde: '', fechaHasta: '' })
const filtrosAplicados = ref({ estado: '', fechaDesde: '', fechaHasta: '' })

onMounted(() => {
  store.cargarVentas()
})

function seleccionarFila(venta) {
  if (filaSeleccionada.value?.id_venta === venta.id_venta) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = venta
    store.limpiarMensajes?.()
  }
}

function irANuevaFactura() {
  router.push('/venta/nueva')
}

function editarVenta() {
  if (!filaSeleccionada.value) return
  router.push(`/venta/editar/${filaSeleccionada.value.id_venta}`)
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarVenta() {
  if (!filaSeleccionada.value) return
  const resultado = await store.eliminarVenta(filaSeleccionada.value.id_venta)
  if (resultado.success) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { estado: '', fechaDesde: '', fechaHasta: '' }
  filtrosAplicados.value = { estado: '', fechaDesde: '', fechaHasta: '' }
  modalFiltros.value = false
}

const ventasFiltradas = computed(() => {
  return store.ventas.filter(v => {
    const { estado, fechaDesde, fechaHasta } = filtrosAplicados.value

    if (estado && v.estado !== estado) return false

    if (fechaDesde && v.fecha) {
      const fechaVenta = new Date(v.fecha)
      const fechaMin = new Date(fechaDesde)
      if (fechaVenta < fechaMin) return false
    }

    if (fechaHasta && v.fecha) {
      const fechaVenta = new Date(v.fecha)
      const fechaMax = new Date(fechaHasta)
      if (fechaVenta > fechaMax) return false
    }

    return true
  })
})

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>