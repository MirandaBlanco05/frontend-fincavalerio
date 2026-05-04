<template>
  <div class="p-6 max-w-6xl mx-auto w-full bg-[#fff8f5] min-h-screen">
    
    <!-- Quick Actions Section -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button @click="irANuevaFactura" class="flex items-center gap-2 px-6 py-3 bg-[#6e420c] text-white rounded-lg shadow-lg hover:opacity-90 transition-all font-bold text-sm">
        <span class="material-symbols-outlined">add</span> Nueva Factura
      </button>
      <button @click="cargarDatos" class="flex items-center gap-2 px-6 py-3 bg-stone-100 text-[#51453a] rounded-lg hover:bg-stone-200 transition-all font-bold text-sm">
        <span class="material-symbols-outlined">refresh</span> Actualizar
      </button>
      <button class="flex items-center gap-2 px-6 py-3 bg-stone-100 text-[#51453a] rounded-lg hover:bg-stone-200 transition-all font-bold text-sm">
        <span class="material-symbols-outlined">search</span> Buscar
      </button>
      <button class="flex items-center gap-2 px-6 py-3 bg-stone-100 text-[#51453a] rounded-lg hover:bg-stone-200 transition-all font-bold text-sm">
        <span class="material-symbols-outlined">print</span> Imprimir
      </button>
    </div>

    <!-- Tabla de Ventas -->
    <section class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-8">
      <div class="p-6 border-b border-stone-100">
        <h3 class="font-bold text-sm text-[#201b16] uppercase tracking-wider">Facturas Registradas</h3>
      </div>

      <div v-if="store.cargando" class="p-12 text-center">
        <div class="inline-block w-8 h-8 border-3 border-[#ece0d9] border-t-[#83541e] rounded-full animate-spin"></div>
        <p class="mt-4 text-[#837468]">Cargando ventas...</p>
      </div>

      <table v-else class="w-full border-collapse">
        <thead class="bg-stone-50 text-left">
          <tr>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">Factura</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">Cliente</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">NCF</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">Concepto</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 font-bold text-[0.625rem] text-[#837468] uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="venta in store.ventas" :key="venta.id_venta" class="hover:bg-[#fdf1ea]">
            <td class="px-6 py-5 font-medium text-sm text-[#201b16]">#{{ venta.id_venta }}</td>
            <td class="px-6 py-5 text-sm">
              <p class="font-semibold text-[#201b16]">{{ venta.cliente?.nombre || 'N/A' }}</p>
              <p class="text-xs text-[#837468]">RNC: {{ venta.cliente?.rnc || 'N/A' }}</p>
            </td>
            <td class="px-6 py-5 text-sm text-[#201b16]">{{ formatearFecha(venta.fecha) }}</td>
            <td class="px-6 py-5 text-sm">
              <span class="px-3 py-1 bg-[#e3d8d0] rounded-lg font-mono text-xs text-[#512d00]">
                {{ venta.ncf_completo || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-5 text-sm text-[#201b16]">{{ venta.concepto || '-' }}</td>
            <td class="px-6 py-5">
              <span :class="venta.estado === 'activo' ? 'bg-[#b9eeab] text-[#002201]' : 'bg-[#ffdad6] text-[#ba1a1a]'" 
                    class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                {{ venta.estado }}
              </span>
            </td>
            <td class="px-6 py-5 text-right">
              <div class="flex justify-end gap-2">
                <button @click="editar(venta.id_venta)" class="p-2 hover:bg-[#f1e6de] rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-[#837468] text-lg">edit</span>
                </button>
                <button @click="confirmarEliminar(venta.id_venta)" class="p-2 hover:bg-[#ffdad6] rounded-lg transition-colors">
                  <span class="material-symbols-outlined text-[#ba1a1a] text-lg">delete</span>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="store.ventas.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-[#837468]">
              No hay facturas registradas
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal Formulario -->
    <div v-if="mostrarFormulario" @click.self="cerrarFormulario" 
         class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <!-- Header Modal -->
        <div class="sticky top-0 bg-white border-b border-stone-200 px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <h2 class="text-2xl font-extrabold text-[#201b16]">
            {{ editando ? 'Editar Factura' : 'Nueva Factura' }}
          </h2>
          <button @click="cerrarFormulario" class="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <span class="material-symbols-outlined text-stone-600">close</span>
          </button>
        </div>

        <form @submit.prevent="guardar" class="p-8">
          
          <!-- Grid 2 columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
            
            <!-- Columna 1 -->
            <div class="space-y-6">
              <!-- Cliente -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center font-bold text-[0.875rem] text-[#201b16] uppercase tracking-wide">
                  <span class="material-symbols-outlined text-[#83541e] text-base mr-2">person</span>
                  Cliente / Entidad
                </label>
                <div class="relative h-12">
                  <select v-model="form.id_cliente" required
                          class="w-full h-full bg-stone-50 border-none rounded-lg px-4 text-[0.875rem] font-medium appearance-none focus:ring-2 focus:ring-[#83541e]/20 text-[#201b16]">
                    <option value="">Seleccione un cliente...</option>
                    <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
                      {{ cliente.nombre }}
                    </option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3 text-stone-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              <!-- Fecha -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center font-bold text-[0.875rem] text-[#201b16] uppercase tracking-wide">
                  <span class="material-symbols-outlined text-[#83541e] text-base mr-2">calendar_today</span>
                  Fecha de Emisión
                </label>
                <input v-model="form.fecha" type="date" required
                       class="w-full h-12 bg-stone-50 border-none rounded-lg px-4 text-[0.875rem] font-medium focus:ring-2 focus:ring-[#83541e]/20 text-[#201b16]" />
              </div>

              <!-- Concepto -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center font-bold text-[0.875rem] text-[#201b16] uppercase tracking-wide">
                  <span class="material-symbols-outlined text-[#83541e] text-base mr-2">category</span>
                  Concepto de Venta
                </label>
                <input v-model="form.concepto" type="text" placeholder="Ej: Venta de Ganado en Pie"
                       class="w-full h-12 bg-stone-50 border-none rounded-lg px-4 text-[0.875rem] font-medium focus:ring-2 focus:ring-[#83541e]/20 text-[#201b16]" />
              </div>
            </div>

            <!-- Columna 2 -->
            <div class="space-y-6">
              <!-- NCF -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center font-bold text-[0.875rem] text-[#201b16] uppercase tracking-wide">
                  <span class="material-symbols-outlined text-[#83541e] text-base mr-2">verified_user</span>
                  NCF (Comprobante Fiscal)
                </label>
                <select v-model="form.ncf" required
                        class="w-full h-12 bg-stone-50 border-none rounded-lg px-4 text-[0.875rem] font-medium appearance-none focus:ring-2 focus:ring-[#83541e]/20 text-[#201b16]">
                  <option value="">Seleccione un NCF...</option>
                  <option v-for="ncf in ncfsDisponibles" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                    {{ ncf.ncf_completo }} - {{ ncf.comprobante?.nombre }}
                  </option>
                </select>
                <small v-if="ncfsDisponibles.length === 0" class="text-[#ba1a1a] text-[0.625rem] font-medium">
                  No hay NCF disponibles
                </small>
              </div>

              <!-- Estado -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center font-bold text-[0.875rem] text-[#201b16] uppercase tracking-wide">
                  <span class="material-symbols-outlined text-[#83541e] text-base mr-2">toggle_on</span>
                  Estado
                </label>
                <select v-model="form.estado"
                        class="w-full h-12 bg-stone-50 border-none rounded-lg px-4 text-[0.875rem] font-medium appearance-none focus:ring-2 focus:ring-[#83541e]/20 text-[#201b16]">
                  <option value="activo">Activo</option>
                  <option value="anulado">Anulado</option>
                </select>
              </div>

              <!-- Info Card -->
              <div class="mt-8 p-4 bg-[#fdf1ea] rounded-lg border border-[#d5c3b5] flex items-start gap-3">
                <span class="material-symbols-outlined text-[#512d00]">info</span>
                <div>
                  <p class="font-bold text-[0.875rem] text-[#201b16]">Crédito Fiscal</p>
                  <p class="text-[0.625rem] text-[#51453a] leading-4 mt-1">
                    Esta factura será emitida bajo el régimen de comprobante fiscal para crédito fiscal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="mensajeError" class="mb-6 p-4 bg-[#ffdad6] border border-[#ba1a1a] rounded-lg flex items-center gap-3">
            <span class="material-symbols-outlined text-[#ba1a1a]">error</span>
            <p class="text-sm text-[#93000a] font-semibold">{{ mensajeError }}</p>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-4 pt-6 border-t border-stone-200">
            <button type="button" @click="cerrarFormulario"
                    class="px-6 py-3 bg-[#f1e6de] text-[#201b16] rounded-lg font-bold text-[0.875rem] hover:bg-[#ece0d9] transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="store.cargando"
                    class="px-6 py-3 bg-[#6e420c] text-white rounded-lg font-bold text-[0.875rem] hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
              <span v-if="store.cargando" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVentaStore } from '@/modules/venta/store/venta.store.js'

const router = useRouter()
const store = useVentaStore()
const mostrarFormulario = ref(false)
const editando = ref(false)
const mensajeError = ref('')

// Mock data - TODO: reemplazar con stores reales
const clientes = ref([
  { id_cliente: 1, nombre: 'Agropecuaria El Valle' },
  { id_cliente: 2, nombre: 'Inversiones Ganaderas RD' }
])

const ncfsDisponibles = ref([
  { id_secuencia: 1, ncf_completo: 'B0100000001', comprobante: { nombre: 'Crédito Fiscal' } },
  { id_secuencia: 2, ncf_completo: 'B0100000002', comprobante: { nombre: 'Crédito Fiscal' } }
])

const form = ref({
  id_cliente: '',
  fecha: new Date().toISOString().split('T')[0],
  concepto: '',
  ncf: '',
  estado: 'activo'
})

function formatearFecha(fecha) {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function resetForm() {
  form.value = {
    id_cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    ncf: '',
    estado: 'activo'
  }
  editando.value = false
  mensajeError.value = ''
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  resetForm()
}

async function guardar() {
  mensajeError.value = ''
  
  const resultado = editando.value
    ? await store.actualizarVenta(form.value.id_venta, form.value)
    : await store.crearVenta(form.value)

  if (resultado.success) {
    cerrarFormulario()
    alert(editando.value ? 'Venta actualizada correctamente' : 'Venta creada correctamente')
  } else {
    mensajeError.value = resultado.error
  }
}

async function editar(id) {
  const venta = await store.obtenerVenta(id)
  if (venta) {
    form.value = {
      id_venta: venta.id_venta,
      id_cliente: venta.id_cliente,
      fecha: venta.fecha,
      concepto: venta.concepto || '',
      ncf: venta.ncf,
      estado: venta.estado
    }
    editando.value = true
    mostrarFormulario.value = true
  }
}

async function confirmarEliminar(id) {
  if (confirm('¿Está seguro de eliminar esta venta? Se restaurará el NCF.')) {
    const resultado = await store.eliminarVenta(id)
    if (resultado.success) {
      alert('Venta eliminada correctamente')
    } else {
      alert('Error al eliminar: ' + resultado.error)
    }
  }
}

async function cargarDatos() {
  await store.cargarVentas()
}

function irANuevaFactura() {
  router.push('/venta/nueva')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Symbols Outlined';
}

* {
  font-family: 'Manrope', sans-serif;
}
</style>