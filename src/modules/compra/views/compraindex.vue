<template>
  <div class="compra-page space-y-8">

    <section class="rounded-[28px] border border-border-color bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-text-primary">Registro de Compras</h1>
          <p class="mt-2 text-sm text-gray-500">Administra tus compras, proveedores y comprobantes fiscales desde una misma vista.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button @click="mostrarResumen" class="rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-light">Resumen</button>
          <button @click="irProveedores" class="rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-light">Proveedores</button>
          <button @click="filtrarFacturas" class="rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-background-light">Facturas</button>
          <button @click="descargarReporte" class="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">Descargar Reporte</button>
        </div>
      </div>
    </section>

    <section class="rounded-[32px] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.18)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-text-primary">Nueva Transacción</h2>
          <p class="mt-1 text-sm text-gray-500">Registra una nueva compra con su comprobante fiscal y proveedor.</p>
        </div>
      </div>

      <div class="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">ID de compra</label>
          <input
            v-model="form.id_compra"
            list="compras-registradas"
            type="text"
            placeholder="PUR-2023-001"
            class="w-full rounded-3xl border border-border-color bg-background-light px-5 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary focus:bg-gray-50"
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
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Proveedor</label>
          <input
            v-model="form.nombre_proveedor"
            list="proveedores-disponibles"
            type="text"
            placeholder="Escribe o selecciona un proveedor"
            class="w-full rounded-3xl border border-border-color bg-background-light px-5 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary focus:bg-gray-50"
          />
          <datalist id="proveedores-disponibles">
            <option
              v-for="proveedor in store.proveedores"
              :key="proveedor.id_proveedor"
              :value="proveedor.nombre"
            />
          </datalist>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Fecha de operación</label>
          <input
            v-model="form.fecha"
            type="date"
            class="w-full rounded-3xl border border-border-color bg-background-light px-5 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary focus:bg-gray-50"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">NCF (comprobante fiscal)</label>
          <input
            v-model="form.ncf"
            type="text"
            placeholder="B0100000001"
            class="w-full rounded-3xl border border-border-color bg-background-light px-5 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary focus:bg-gray-50"
          />
        </div>
      </div>

      <div class="mt-6 rounded-[28px] border border-dashed border-border-color bg-background-light p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3 text-text-primary">
            <span class="material-symbols-outlined rounded-2xl bg-white/90 p-2 text-lg text-text-primary shadow-sm">upload_file</span>
            <div>
              <p class="font-semibold">Adjuntar factura</p>
              <p class="text-sm text-gray-500">
                <span v-if="form.nombreFactura" class="text-green-600">✓ {{ form.nombreFactura }}</span>
                <span v-else>Formatos permitidos: JPG, PNG, PDF (Máx 5MB)</span>
              </p>
            </div>
          </div>

          <label class="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 cursor-pointer">
            <input type="file" class="hidden" @change="cargarFactura" />
            Subir foto de factura
          </label>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="guardarCompra"
          :disabled="store.cargando"
          class="inline-flex items-center justify-center rounded-3xl bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ esEdicion ? 'Actualizar Compra' : 'Registrar Compra' }}
        </button>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-semibold text-text-primary">Historial Reciente</h3>
          <p class="mt-1 text-sm text-gray-500">Revisa las compras registradas más recientes.</p>
        </div>
        <button @click="verTodoHistorial" class="text-sm font-semibold text-primary transition hover:text-primary/80">Ver todo el historial →</button>
      </div>

      <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">

        <div v-if="store.cargando" class="flex min-h-[240px] items-center justify-center px-6 py-16">
          <div class="flex flex-col items-center gap-3 text-gray-400">
            <span class="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
            <p>Cargando compras...</p>
          </div>
        </div>

        <div v-else-if="comprasFiltradas.length === 0" class="flex min-h-[240px] flex-col items-center justify-center gap-3 px-6 py-16 text-gray-400">
          <span class="material-symbols-outlined text-5xl">shopping_cart_off</span>
          <p>No hay compras registradas aún.</p>
        </div>

        <table v-else class="w-full text-left text-sm text-text-primary">
          <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-6 py-4">ID compra</th>
              <th class="px-6 py-4">Proveedor</th>
              <th class="px-6 py-4">Fecha</th>
              <th class="px-6 py-4">NCF</th>
              <th class="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="compra in comprasFiltradas"
              :key="compra.id_compra"
              class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            >
              <td class="whitespace-nowrap px-6 py-5 font-semibold text-text-primary">{{ compra.id_compra }}</td>
              <td class="px-6 py-5">{{ compra.proveedor?.nombre || 'Sin proveedor' }}</td>
              <td class="px-6 py-5 text-gray-500">{{ formatearFecha(compra.fecha) }}</td>
              <td class="px-6 py-5">
                <span class="inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  {{ compra.ncf || '---' }}
                </span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <button @click="editarCompra(compra)" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background-light text-text-primary transition hover:bg-border-color/50">
                    <span class="material-symbols-outlined">visibility</span>
                  </button>
                  <button @click="confirmarEliminar(compra)" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 transition hover:bg-red-200">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
  nombre_proveedor: '',
  id_proveedor: '',
  fecha: '',
  ncf: '',
  factura: null,
  nombreFactura: ''
})

const comprasFiltradas = computed(() => store.compras || [])

const cargarDatos = async () => {
  await store.cargarCompras()
  await store.cargarProveedores()
  await store.cargarSecuenciasNCF()
}

function limpiarForm() {
  form.id_compra = ''
  form.nombre_proveedor = ''
  form.id_proveedor = ''
  form.fecha = ''
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

  // Buscar el ID del proveedor por su nombre
  const proveedorSeleccionado = store.proveedores.find(
    p => p.nombre.toLowerCase() === form.nombre_proveedor.toLowerCase()
  )

  if (!proveedorSeleccionado) {
    alert('Por favor selecciona un proveedor válido de la lista')
    return
  }

  form.id_proveedor = proveedorSeleccionado.id_proveedor

  let datos
  
  // Si hay archivo, usar FormData para enviar archivo + datos
  if (form.factura) {
    datos = new FormData()
    datos.append('id_compra', form.id_compra)
    datos.append('id_proveedor', form.id_proveedor)
    datos.append('fecha', form.fecha)
    datos.append('ncf', form.ncf || '')
    datos.append('factura', form.factura)
  } else {
    // Sin archivo, enviar solo datos JSON
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

function editarCompra(compra) {
  form.id_compra = compra.id_compra
  form.id_proveedor = compra.id_proveedor
  form.nombre_proveedor = compra.proveedor?.nombre || ''
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
  
  const archivo = event.target.files[0]
  const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf']
  const tamanioMax = 5 * 1024 * 1024 // 5MB
  
  // Validar tipo de archivo
  if (!tiposPermitidos.includes(archivo.type)) {
    alert('Solo se aceptan archivos JPG, PNG o PDF')
    event.target.value = ''
    return
  }
  
  // Validar tamaño
  if (archivo.size > tamanioMax) {
    alert('El archivo no puede exceder 5MB')
    event.target.value = ''
    return
  }
  
  // Guardar el archivo en el formulario
  form.factura = archivo
  form.nombreFactura = archivo.name
  console.log('Archivo cargado:', archivo.name)
}

function mostrarResumen() {
  alert('Resumen de compras - Funcionalidad en desarrollo')
}

function irProveedores() {
  // Navegar a la sección de proveedores
  window.location.href = '/proveedores'
}

function filtrarFacturas() {
  // Mostrar solo compras con NCF
  alert('Filtrar por facturas - Funcionalidad en desarrollo')
}

function descargarReporte() {
  // Generar y descargar reporte en CSV o Excel
  const csv = generarReporteCSV()
  descargarCSV(csv, 'reporte-compras.csv')
}

function generarReporteCSV() {
  const headers = ['ID Compra', 'Proveedor', 'Fecha', 'NCF']
  const rows = store.compras.map(compra => [
    compra.id_compra,
    compra.proveedor?.nombre || 'Sin proveedor',
    compra.fecha,
    compra.ncf || '---'
  ])
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  return csv
}

function descargarCSV(contenido, nombre) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', nombre)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function verTodoHistorial() {
  // Scroll hacia la tabla de historial
  document.querySelector('table')?.scrollIntoView({ behavior: 'smooth' })
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