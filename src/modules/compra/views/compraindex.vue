<template>
  <div class="relative min-h-screen w-full space-y-8">

    <!-- ══════════════════════════════════════════
         SECCIÓN 1: FORMULARIO NUEVA/EDITAR COMPRA
    ═══════════════════════════════════════════ -->
    <div class="min-h-screen bg-[#fafafa]">

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ esEdicion ? 'Editar Compra' : 'Nueva Compra' }}</h1>
          <p class="text-sm text-gray-600">Complete los datos de la compra y adjunte el comprobante fiscal</p>
        </div>
      </div>

      <!-- Card Datos Compra -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <h2 class="text-xl font-bold mb-6 pb-3 border-b-2 border-gray-100">Datos de la Compra</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Columna 1: Proveedor + Adjuntar -->
          <div class="space-y-6">
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">support_agent</span>
                Proveedor
              </label>
              <input
                v-model="form.nombre_proveedor"
                list="proveedores-disponibles"
                type="text"
                placeholder="Escribe o selecciona un proveedor"
                class="form-input"
              />
              <datalist id="proveedores-disponibles">
                <option
                  v-for="proveedor in store.proveedores"
                  :key="proveedor.id_proveedor"
                  :value="proveedor.nombre"
                />
              </datalist>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">upload_file</span>
                Adjuntar Factura
              </label>
              <label class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 cursor-pointer hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
                <span v-if="form.nombreFactura" class="text-sm font-semibold text-green-600">✓ {{ form.nombreFactura }}</span>
                <span v-else class="text-sm text-gray-500">JPG, PNG, PDF · Máx 5MB</span>
                <input type="file" class="hidden" @change="cargarFactura" accept=".jpg,.jpeg,.png,.pdf" />
              </label>
            </div>
          </div>

          <!-- Columna 2: ID Compra + NCF -->
          <div class="space-y-6">
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">tag</span>
                ID de Compra
              </label>
              <input
                v-model="form.id_compra"
                list="compras-registradas"
                type="text"
                placeholder="PUR-2023-001"
                class="form-input"
                :readonly="esEdicion"
              />
              <datalist id="compras-registradas">
                <option
                  v-for="compra in store.compras"
                  :key="compra.id_compra"
                  :value="compra.id_compra"
                >
                  {{ compra.id_compra }} - {{ compra.proveedor?.nombre || 'Sin proveedor' }}
                </option>
              </datalist>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="material-symbols-outlined">verified_user</span>
                NCF (Comprobante Fiscal)
              </label>
              <input
                v-model="form.ncf"
                type="text"
                placeholder="B0100000001"
                class="form-input"
              />
            </div>
          </div>

          <!-- Columna 3: Fecha -->
          <div class="space-y-6">
            <div class="form-group">
              <label class="form-label required">
                <span class="material-symbols-outlined">calendar_today</span>
                Fecha de Operación
              </label>
              <input
                v-model="form.fecha"
                type="date"
                class="form-input"
              />
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Formulario: botones guardar/limpiar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-end gap-3 flex-wrap">
          <button
            @click="guardarCompra"
            :disabled="store.cargando"
            class="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined">save</span>
            {{ esEdicion ? 'Actualizar Compra' : 'Guardar Compra' }}
          </button>
          <button
            @click="limpiarForm"
            class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <span class="material-symbols-outlined">delete_sweep</span>
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         SECCIÓN 2: TABLA HISTORIAL
    ═══════════════════════════════════════════ -->

    <!-- Action Bar tabla -->
    <div class="flex flex-wrap items-center gap-3">
      <button
        @click="editarCompraDesdeTabla(filaSeleccionada)"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button
        @click="confirmarEliminar(filaSeleccionada)"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>
    </div>

    <!-- Alerta error -->
    <div v-if="store.error" class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <!-- Alerta éxito -->
    <div v-if="store.mensaje" class="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID Compra</th>
            <th class="px-6 py-4">Proveedor</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">NCF</th>
            <th class="px-6 py-4">Factura</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando compras...</p>
            </td>
          </tr>

          <tr v-else-if="store.compras.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">inventory_2</span>
              <p class="mt-2">No hay compras registradas aún.</p>
            </td>
          </tr>

          <tr
            v-else
            v-for="compra in store.compras"
            :key="compra.id_compra"
            @click="seleccionarFila(compra)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_compra === compra.id_compra }"
          >
            <td class="px-6 py-3 font-bold">#{{ compra.id_compra }}</td>
            <td class="px-6 py-3">{{ compra.proveedor?.nombre || 'Sin proveedor' }}</td>
            <td class="px-6 py-3">{{ formatearFecha(compra.fecha) }}</td>
            <td class="px-6 py-3 font-mono text-xs">{{ compra.ncf || '—' }}</td>
            <td class="px-6 py-3">
              <span v-if="compra.url_factura" class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                <span class="material-symbols-outlined text-xs">attach_file</span> Adjunta
              </span>
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Compra</h3>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar esta compra?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarCompra" class="btn btn--danger">
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
import { computed, reactive, ref, onMounted } from 'vue'
import { useComprasStore } from '@/modules/compra/store/compra.store.js'

const store = useComprasStore()
const esEdicion = ref(false)
const modalEliminar = ref(false)
const compraAEliminar = ref(null)
const filaSeleccionada = ref(null)

const form = reactive({
  id_compra: '',
  nombre_proveedor: '',
  id_proveedor: '',
  fecha: new Date().toISOString().split('T')[0],
  ncf: '',
  factura: null,
  nombreFactura: ''
})

// ── Cargar datos ───────────────────────────────
const cargarDatos = async () => {
  await store.cargarCompras()
  await store.cargarProveedores()
  await store.cargarSecuenciasNCF?.()
}

// ── Form ───────────────────────────────────────
function limpiarForm() {
  form.id_compra = ''
  form.nombre_proveedor = ''
  form.id_proveedor = ''
  form.fecha = new Date().toISOString().split('T')[0]
  form.ncf = ''
  form.factura = null
  form.nombreFactura = ''
  esEdicion.value = false
}

async function guardarCompra() {
  if (!form.id_compra || !form.nombre_proveedor || !form.fecha) {
    alert('Por favor completa los campos obligatorios')
    return
  }

  const proveedorSeleccionado = store.proveedores.find(
    p => p.nombre.toLowerCase() === form.nombre_proveedor.toLowerCase()
  )

  if (!proveedorSeleccionado) {
    alert('Por favor selecciona un proveedor válido de la lista')
    return
  }

  form.id_proveedor = proveedorSeleccionado.id_proveedor

  let datos

  if (form.factura) {
    datos = new FormData()
    datos.append('id_compra', form.id_compra)
    datos.append('id_proveedor', form.id_proveedor)
    datos.append('fecha', form.fecha)
    datos.append('ncf', form.ncf || '')
    datos.append('factura', form.factura)
  } else {
    datos = {
      id_compra: form.id_compra,
      id_proveedor: form.id_proveedor,
      fecha: form.fecha,
      ncf: form.ncf || null
    }
  }

  const exito = esEdicion.value
    ? await store.actualizarCompra(form.id_compra, datos)
    : await store.crearCompra(datos)

  if (exito) {
    alert('Compra guardada exitosamente')
    limpiarForm()
  } else {
    alert('Error al guardar la compra: ' + store.error)
  }
}

function cargarFactura(event) {
  if (!event.target.files?.length) return

  const archivo = event.target.files[0]
  const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf']
  const tamanioMax = 5 * 1024 * 1024

  if (!tiposPermitidos.includes(archivo.type)) {
    alert('Solo se aceptan archivos JPG, PNG o PDF')
    event.target.value = ''
    return
  }
  if (archivo.size > tamanioMax) {
    alert('El archivo no puede exceder 5MB')
    event.target.value = ''
    return
  }

  form.factura = archivo
  form.nombreFactura = archivo.name
}

// ── Tabla / Selección ──────────────────────────
function seleccionarFila(compra) {
  if (filaSeleccionada.value?.id_compra === compra.id_compra) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = compra
    store.limpiarMensajes?.()
  }
}

function editarCompraDesdeTabla(compra) {
  if (!compra) return
  form.id_compra        = compra.id_compra
  form.id_proveedor     = compra.id_proveedor
  form.nombre_proveedor = compra.proveedor?.nombre || ''
  form.fecha            = compra.fecha
  form.ncf              = compra.ncf || ''
  form.factura          = null
  form.nombreFactura    = ''
  esEdicion.value       = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function confirmarEliminar(compra) {
  if (!compra) return
  compraAEliminar.value = compra
  modalEliminar.value   = true
}

async function eliminarCompra() {
  if (!compraAEliminar.value) return
  const exito = await store.eliminarCompra(compraAEliminar.value.id_compra)
  if (exito) {
    modalEliminar.value   = false
    compraAEliminar.value = null
    filaSeleccionada.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => cargarDatos())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

* { font-family: 'DM Sans', sans-serif; }

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }

.form-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem; font-weight: 700; color: #374151;
}
.form-label .material-symbols-outlined { font-size: 1rem; color: #4c9a4c; }
.form-label.required::after { content: '*'; color: #dc2626; margin-left: 4px; }

.form-input {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
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
.form-input[readonly] {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: white; border-radius: 20px;
  width: 100%; max-width: 450px;
}
.modal-header {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}
.modal-header--danger {
  flex-direction: column; align-items: center; gap: 1rem;
}
.modal-header--danger .material-symbols-outlined {
  font-size: 3rem; color: #dc2626;
}
.modal-title { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; }
.modal-body { padding: 2rem; text-align: center; color: #475569; font-size: 0.95rem; }
.modal-footer {
  display: flex; gap: 12px;
  padding: 1.5rem 2rem;
  border-top: 1.5px solid #f0f0ed;
}
.btn {
  flex: 1; display: flex; align-items: center; justify-content: center;
  gap: 8px; padding: 0.85rem; border: none; border-radius: 12px;
  font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn--secondary { background: #f5f5f5; color: #374151; }
.btn--secondary:hover { background: #e5e7eb; }
.btn--danger { background: #dc2626; color: white; }
.btn--danger:hover { background: #b91c1c; }
</style>