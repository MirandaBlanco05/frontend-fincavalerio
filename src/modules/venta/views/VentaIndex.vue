<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nueva Factura -->
      <button
        @click="irANuevaFactura"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Factura</span>
      </button>

      <!-- Editar (activo solo si hay fila seleccionada) -->
      <button
        @click="editarVenta()"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar (activo solo si hay fila seleccionada) -->
      <button
        @click="confirmarEliminar()"
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
            <th class="px-6 py-4">Cliente</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">NCF</th>
            <th class="px-6 py-4">Concepto</th>
            <th class="px-6 py-4">Estado</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando facturas...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="store.ventas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">receipt_long</span>
              <p class="mt-2">No hay facturas registradas.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="venta in store.ventas"
            :key="venta.id_venta"
            @click="seleccionarFila(venta)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_venta === venta.id_venta }"
          >
            <td class="px-6 py-3 font-bold">#{{ venta.id_venta }}</td>
            <td class="px-6 py-3">
              <p class="font-medium">{{ venta.cliente?.nombre || 'N/A' }}</p>
              <p class="text-xs text-gray-500">RNC: {{ venta.cliente?.rnc || 'N/A' }}</p>
            </td>
            <td class="px-6 py-3">{{ formatearFecha(venta.fecha) }}</td>
            <td class="px-6 py-3 font-mono text-xs">{{ venta.ncf_completo || 'N/A' }}</td>
            <td class="px-6 py-3">{{ venta.concepto || '—' }}</td>
            <td class="px-6 py-3">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                :class="venta.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ venta.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Factura</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar esta factura?</p>
            <p class="text-center text-sm text-muted">El NCF será restaurado como disponible.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarVenta" class="btn btn--danger">
              <span class="material-symbols-outlined">delete</span>
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
import { useVentaStore } from '@/modules/venta/store/venta.store.js'

const router = useRouter()
const store = useVentaStore()
const filaSeleccionada = ref(null)
const modalEliminar = ref(false)

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

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => {
  store.cargarVentas()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
  font-family: 'DM Sans', sans-serif;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
}

.modal-content--small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-header--danger {
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-header--danger .material-symbols-outlined {
  font-size: 3rem;
  color: #dc2626;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 1.5rem 2rem;
  border-top: 1.5px solid #f0f0ed;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--secondary {
  background: #f5f5f5;
  color: #374151;
}

.btn--secondary:hover {
  background: #e5e7eb;
}

.btn--danger {
  background: #dc2626;
  color: white;
}

.btn--danger:hover {
  background: #b91c1c;
}

.text-center { text-align: center; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: #9ca3af; }
</style>