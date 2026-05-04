<template>
  <div class="compra-page space-y-8">

    <section class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">Registro de Compras</h1>
          <p class="mt-2 text-sm text-slate-500">Administra tus compras, proveedores y comprobantes fiscales desde una misma vista.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Resumen</button>
          <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Proveedores</button>
          <button class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Facturas</button>
          <button class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Descargar Reporte</button>
        </div>
      </div>
    </section>

    <section class="rounded-[32px] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.18)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">Nueva Transacción</h2>
          <p class="mt-1 text-sm text-slate-500">Registra una nueva compra con su comprobante fiscal y proveedor.</p>
        </div>
      </div>

      <div class="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ID de compra</label>
          <input
            v-model="form.id_compra"
            list="compras-registradas"
            type="text"
            placeholder="PUR-2023-001"
            class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
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

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Proveedor</label>
          <select
            v-model="form.id_proveedor"
            class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            <option value="">Seleccionar proveedor</option>
            <option v-for="proveedor in store.proveedores" :key="proveedor.id_proveedor" :value="proveedor.id_proveedor">
              {{ proveedor.nombre }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fecha de operación</label>
          <input
            v-model="form.fecha"
            type="date"
            class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">NCF (comprobante fiscal)</label>
          <input
            v-model="form.ncf"
            type="text"
            placeholder="B0100000001"
            class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>
      </div>

      <div class="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3 text-slate-700">
            <span class="material-symbols-outlined rounded-2xl bg-white/90 p-2 text-lg text-slate-900 shadow-sm">upload_file</span>
            <div>
              <p class="font-semibold">Adjuntar factura</p>
              <p class="text-sm text-slate-500">Formatos permitidos: JPG, PNG, PDF (Máx 5MB)</p>
            </div>
          </div>

          <label class="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer">
            <input type="file" class="hidden" @change="cargarFactura" />
            Subir foto de factura
          </label>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="guardarCompra"
          :disabled="store.cargando"
          class="inline-flex items-center justify-center rounded-3xl bg-[#6E420C] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#563210] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ esEdicion ? 'Actualizar Compra' : 'Registrar Compra' }}
        </button>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-semibold text-slate-900">Historial Reciente</h3>
          <p class="mt-1 text-sm text-slate-500">Revisa las compras registradas más recientes.</p>
        </div>
        <button class="text-sm font-semibold text-slate-900 transition hover:text-slate-700">Ver todo el historial →</button>
      </div>

      <div class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div v-if="store.cargando" class="flex min-h-[240px] items-center justify-center px-6 py-16">
          <div class="flex flex-col items-center gap-3 text-slate-500">
            <span class="material-symbols-outlined text-4xl">hourglass_top</span>
            <p>Cargando compras...</p>
          </div>
        </div>

        <div v-else-if="comprasFiltradas.length === 0" class="flex min-h-[240px] flex-col items-center justify-center gap-3 px-6 py-16 text-slate-500">
          <span class="material-symbols-outlined text-5xl">shopping_cart_off</span>
          <p>No hay compras registradas aún.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-slate-500">ID compra</th>
                <th class="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-slate-500">Proveedor</th>
                <th class="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-slate-500">Fecha</th>
                <th class="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-slate-500">NCF</th>
                <th class="px-6 py-4 font-semibold uppercase tracking-[0.12em] text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              <tr v-for="compra in comprasFiltradas" :key="compra.id_compra" class="hover:bg-slate-50">
                <td class="whitespace-nowrap px-6 py-5 font-semibold text-slate-900">{{ compra.id_compra }}</td>
                <td class="px-6 py-5">{{ compra.proveedor?.nombre || 'Sin proveedor' }}</td>
                <td class="px-6 py-5 text-slate-500">{{ formatearFecha(compra.fecha) }}</td>
                <td class="px-6 py-5">
                  <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {{ compra.ncf || '---' }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2">
                    <button @click="editarCompra(compra)" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
                      <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button @click="confirmarEliminar(compra)" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content">
          <div class="modal-header">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Compra</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Seguro que deseas eliminar esta compra?</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarCompra" class="btn btn--danger">Eliminar</button>
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

const form = reactive({
  id_compra: '',
  id_proveedor: '',
  fecha: '',
  ncf: ''
})

const comprasFiltradas = computed(() => store.compras || [])

const cargarDatos = async () => {
  await store.cargarCompras()
  await store.cargarProveedores()
  await store.cargarSecuenciasNCF()
}

function limpiarForm() {
  form.id_compra = ''
  form.id_proveedor = ''
  form.fecha = ''
  form.ncf = ''
  esEdicion.value = false
}

async function guardarCompra() {
  if (!form.id_compra || !form.id_proveedor || !form.fecha) return

  const datos = {
    id_compra: form.id_compra,
    id_proveedor: form.id_proveedor,
    fecha: form.fecha,
    ncf: form.ncf || null
  }

  const exito = esEdicion.value
    ? await store.actualizarCompra(form.id_compra, datos)
    : await store.crearCompra(datos)

  if (exito) limpiarForm()
}

function editarCompra(compra) {
  form.id_compra = compra.id_compra
  form.id_proveedor = compra.id_proveedor
  form.fecha = compra.fecha
  form.ncf = compra.ncf
  esEdicion.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function confirmarEliminar(compra) {
  compraAEliminar.value = compra
  modalEliminar.value = true
}

async function eliminarCompra() {
  if (!compraAEliminar.value) return
  const exito = await store.eliminarCompra(compraAEliminar.value.id_compra)
  if (exito) {
    modalEliminar.value = false
    compraAEliminar.value = null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function cargarFactura(event) {
  if (!event.target.files?.length) return
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .55);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  width: min(100%, 420px);
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(15, 23, 42, 0.18);
}

.modal-header {
  display: grid;
  place-items: center;
  padding: 2rem 1.5rem 0;
  gap: 1rem;
}

.modal-header .material-symbols-outlined {
  font-size: 3rem;
  color: #B91C1C;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
}

.modal-body {
  padding: 1.5rem;
  text-align: center;
  color: #475569;
  font-size: 0.95rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #f8fafc;
}

.btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 0.95rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s ease;
}

.btn--secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn--secondary:hover {
  background: #e2e8f0;
}

.btn--danger {
  background: #dc2626;
  color: white;
}

.btn--danger:hover {
  background: #b91c1c;
}
</style>