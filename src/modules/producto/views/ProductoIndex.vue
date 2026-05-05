<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo -->
      <button
        @click="abrirModal()"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo</span>
      </button>

      <!-- Editar -->
      <button
        @click="abrirModal(filaSeleccionada)"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar -->
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
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Descripción</th>
            <th class="px-6 py-4">Stock</th>
            <th class="px-6 py-4">Peso</th>
            <th class="px-6 py-4">Precio Costo</th>
            <th class="px-6 py-4">Precio Venta</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando productos...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="store.productos.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">inventory</span>
              <p class="mt-2">No hay productos registrados.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="producto in store.productos"
            :key="producto.id_producto"
            @click="seleccionarFila(producto)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_producto === producto.id_producto }"
          >
            <td class="px-6 py-3 font-bold">#{{ producto.id_producto }}</td>
            <td class="px-6 py-3">{{ producto.tipo_producto }}</td>
            <td class="px-6 py-3">{{ producto.descripcion || '—' }}</td>
            <td class="px-6 py-3">{{ producto.cantidad_stock }}</td>
            <td class="px-6 py-3">{{ producto.peso || '—' }}</td>
            <td class="px-6 py-3">RD$ {{ formatearNumero(producto.precio_costo) }}</td>
            <td class="px-6 py-3 font-bold text-green-700">RD$ {{ formatearNumero(producto.precio_venta) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Producto</h3>
              <p class="modal-subtitle">Complete los datos del producto</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardar" class="modal-body">
            <div class="form-grid">
              <!-- Tipo Producto -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">category</span>
                  Tipo Producto
                </label>
                <input v-model="form.tipo_producto" type="text" required class="form-input" placeholder="Ej: Leche, Queso" />
              </div>

              <!-- Stock -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">inventory_2</span>
                  Cantidad Stock
                </label>
                <input v-model.number="form.cantidad_stock" type="number" min="0" required class="form-input" />
              </div>
            </div>

            <div class="form-grid">
              <!-- Precio Costo -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">payments</span>
                  Precio Costo
                </label>
                <input v-model.number="form.precio_costo" type="number" step="0.01" min="0" required class="form-input" />
              </div>

              <!-- Precio Venta -->
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">sell</span>
                  Precio Venta
                </label>
                <input v-model.number="form.precio_venta" type="number" step="0.01" min="0" required class="form-input" />
              </div>
            </div>

            <!-- Peso -->
            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">scale</span>
                Peso
              </label>
              <input v-model="form.peso" type="text" class="form-input" placeholder="Ej: 1kg, 500g" />
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">description</span>
                Descripción
              </label>
              <textarea v-model="form.descripcion" class="form-input" rows="3" placeholder="Descripción del producto"></textarea>
            </div>

            <!-- Botones -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn btn--secondary">Cancelar</button>
              <button type="submit" :disabled="guardando" class="btn btn--primary">
                <span class="material-symbols-outlined">save</span>
                {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Producto</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar este producto?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminar" class="btn btn--danger">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useProductoStore } from '@/modules/producto/store/producto.store.js'

const store = useProductoStore()
const filaSeleccionada = ref(null)
const modalAbierto = ref(false)
const modalEliminar = ref(false)
const guardando = ref(false)

const form = reactive({
  tipo_producto: '',
  cantidad_stock: 0,
  precio_costo: 0,
  precio_venta: 0,
  peso: '',
  descripcion: ''
})

const modoEdicion = computed(() => !!filaSeleccionada.value)

function seleccionarFila(producto) {
  if (filaSeleccionada.value?.id_producto === producto.id_producto) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = producto
    store.limpiarMensajes?.()
  }
}

function abrirModal(producto = null) {
  if (producto) {
    form.tipo_producto = producto.tipo_producto
    form.cantidad_stock = producto.cantidad_stock
    form.precio_costo = producto.precio_costo
    form.precio_venta = producto.precio_venta
    form.peso = producto.peso || ''
    form.descripcion = producto.descripcion || ''
  } else {
    resetForm()
    filaSeleccionada.value = null
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  resetForm()
}

function resetForm() {
  form.tipo_producto = ''
  form.cantidad_stock = 0
  form.precio_costo = 0
  form.precio_venta = 0
  form.peso = ''
  form.descripcion = ''
}

async function guardar() {
  guardando.value = true
  let resultado

  if (modoEdicion.value) {
    resultado = await store.actualizarProducto(filaSeleccionada.value.id_producto, form)
  } else {
    resultado = await store.crearProducto(form)
  }

  guardando.value = false

  if (resultado.success) {
    cerrarModal()
    filaSeleccionada.value = null
  }
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminar() {
  if (!filaSeleccionada.value) return
  const resultado = await store.eliminarProducto(filaSeleccionada.value.id_producto)
  if (resultado.success) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function formatearNumero(num) {
  return parseFloat(num).toFixed(2)
}

onMounted(() => {
  store.cargarProductos()
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
  max-height: 90vh;
  overflow-y: auto;
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
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.btn-close {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}

.form-label .material-symbols-outlined {
  font-size: 1rem;
  color: #4c9a4c;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 1rem;
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

.btn--primary {
  background: #4c9a4c;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #3d7a3d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 154, 76, 0.3);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>