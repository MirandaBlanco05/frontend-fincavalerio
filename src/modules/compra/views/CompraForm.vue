<template>
  <div class="min-h-screen bg-[#fafafa] p-8">
    
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ modoEdicion ? 'Editar Compra' : 'Nueva Compra' }}</h1>
        <p class="text-sm text-gray-600">Complete los datos de la compra y agregue insumos</p>
      </div>
      <button @click="volver" class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Volver
      </button>
    </div>

    <!-- Card Datos Compra -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <h2 class="text-xl font-bold mb-6 pb-3 border-b-2 border-gray-100">Datos Compra</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna 1: Datos Proveedor -->
        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">person</span>
              Proveedor
            </label>
            <select 
              v-model="compra.id_proveedor"
              @change="cargarDatosProveedor"
              class="form-select"
              required
            >
              <option value="">Seleccione...</option>
              <option v-for="proveedor in store.proveedores" :key="proveedor.id_proveedor" :value="proveedor.id_proveedor">
                {{ proveedor.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">phone</span>
              Teléfono
            </label>
            <input 
              v-model="compra.proveedor_telefono" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">badge</span>
              RNC
            </label>
            <input 
              v-model="compra.proveedor_rnc" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
            />
          </div>
        </div>

        <!-- Columna 2: Agregar Insumo -->
        <div class="flex flex-col gap-4 items-center justify-center">
          <div class="w-full">
            <label class="form-label text-center block mb-2">
              <span class="material-symbols-outlined">shopping_cart</span>
              Agregar Insumo
            </label>
            <select 
              v-model="insumoSeleccionado"
              class="form-select"
            >
              <option value="">Seleccione insumo...</option>
              <option v-for="insumo in insumoStore.insumos" :key="insumo.id_insumo" :value="insumo.id_insumo">
                {{ insumo.nombre }} - RD$ {{ formatearNumero(insumo.precio) }}
              </option>
            </select>
          </div>
          
          <div class="w-full flex gap-2">
            <input 
              v-model.number="cantidadInsumo" 
              type="number" 
              min="1"
              placeholder="Cant."
              class="flex-1 form-input"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
            />
            <input 
              v-model.number="precioManual" 
              type="number" 
              min="0"
              step="0.01"
              placeholder="Precio Unit."
              class="flex-1 form-input"
            />
            <button 
              @click="agregarInsumo" 
              :disabled="!insumoSeleccionado"
              class="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>

          <button @click="limpiarInsumos" class="w-full px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">delete_sweep</span>
            Limpiar Insumos
          </button>
        </div>

        <!-- Columna 3: Datos Generales -->
        <div class="space-y-6">
          <div class="form-group" v-if="modoEdicion">
            <label class="form-label">
              <span class="material-symbols-outlined">tag</span>
              ID Compra
            </label>
            <input 
              :value="compra.id_compra" 
              type="text" 
              class="form-input bg-gray-50 font-bold"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">calendar_today</span>
              Fecha
            </label>
            <input 
              v-model="compra.fecha" 
              type="date" 
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">verified_user</span>
              NCF
            </label>
            <select 
              v-model="compra.ncf"
              class="form-select"
            >
              <option value="">(Sin NCF)</option>
              <option v-for="ncf in store.secuenciasNCF" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                {{ ncf.ncf_completo || ncf.secuencia }}
              </option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabla de Insumos -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nombre Insumo</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cantidad</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Precio Unit.</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Total</th>
            <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(insumo, index) in detalles" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-900">{{ insumo.id_insumo }}</td>
            <td class="px-6 py-4 text-gray-900">{{ insumo.nombre }}</td>
            <td class="px-6 py-4 text-gray-900">{{ insumo.cantidad }}</td>
            <td class="px-6 py-4 text-right text-gray-900">RD$ {{ formatearNumero(insumo.precio_unitario) }}</td>
            <td class="px-6 py-4 text-right font-bold text-gray-900">RD$ {{ formatearNumero(insumo.monto_total) }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="eliminarInsumo(index)" class="p-2 hover:bg-red-50 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-red-600">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="detalles.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              No hay insumos agregados a esta compra
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer: Método Pago, Total y Botones -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between flex-wrap gap-6">
        
        <!-- Método Pago y Total -->
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-4">
            <label class="font-bold text-gray-900">Método Pago</label>
            <select 
              v-model="compra.metodo_pago" 
              class="form-select w-48"
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>
          <div class="flex items-center gap-4">
            <label class="font-bold text-gray-900">Total</label>
            <input 
              :value="'RD$ ' + formatearNumero(calcularTotal())" 
              type="text" 
              class="w-52 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg font-bold text-right text-green-800 text-xl"
              readonly
            />
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex gap-3 flex-wrap">
          <button @click="guardarCompra" :disabled="store.cargando" class="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2">
            <span class="material-symbols-outlined" v-if="!store.cargando">save</span>
            <span class="material-symbols-outlined animate-spin" v-else>progress_activity</span>
            {{ store.cargando ? 'Guardando...' : 'Guardar' }}
          </button>
          <button @click="volver" class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">cancel</span>
            Cancelar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useComprasStore } from '@/modules/compra/store/compra.store.js'
import { useInsumoStore } from '@/modules/insumo/store/insumo.store.js'

const router = useRouter()
const route = useRoute()
const store = useComprasStore()
const insumoStore = useInsumoStore()

const modoEdicion = computed(() => !!route.params.id)
const compraId = computed(() => route.params.id)

const compra = reactive({
  id_compra: null,
  fecha: new Date().toISOString().split('T')[0],
  ncf: '',
  metodo_pago: 'Efectivo',
  id_proveedor: '',
  proveedor_nombre: '',
  proveedor_telefono: '',
  proveedor_rnc: ''
})

const detalles = ref([])
const insumoSeleccionado = ref('')
const cantidadInsumo = ref(1)
const precioManual = ref(null)

onMounted(async () => {
  await Promise.all([
    store.cargarProveedores(),
    store.cargarSecuenciasNCF(),
    insumoStore.cargarInsumos()
  ])

  if (modoEdicion.value) {
    cargarDatosCompraEdicion()
  }
})

// Auto-seleccionar el precio sugerido cuando se cambia de insumo
watch(insumoSeleccionado, (newId) => {
  if (newId) {
    const ins = insumoStore.insumos.find(i => i.id_insumo === parseInt(newId))
    if (ins) {
      precioManual.value = ins.precio || 0
    }
  } else {
    precioManual.value = null
  }
})

async function cargarDatosCompraEdicion() {
  try {
    const data = await store.obtenerCompra(compraId.value)
    if (!data) {
      alert(`Error crítico: No se pudo obtener la información de la compra #${compraId.value}. Servidor dice: ` + store.error)
      return
    }

    compra.id_compra = data.id_compra
    compra.fecha = data.fecha ? data.fecha.split('T')[0] : ''
    compra.ncf = data.ncf || ''
    compra.metodo_pago = data.metodo_pago || 'Efectivo'
    compra.id_proveedor = data.id_proveedor || ''
    
    // Asegurarse de que el NCF asignado actualmente aparezca en el select
    if (data.ncf && data.secuencia && !store.secuenciasNCF.some(s => s.id_secuencia === data.ncf)) {
      store.secuenciasNCF.push({
        ...data.secuencia,
        ncf_completo: data.ncf_completo || data.secuencia.secuencia
      })
    }
    
    if (data.proveedor) {
      compra.proveedor_nombre = data.proveedor.nombre
      compra.proveedor_telefono = data.proveedor.telefono
      compra.proveedor_rnc = data.proveedor.rnc
    }

    if (data.productos_compra && data.productos_compra.length > 0) {
      detalles.value = data.productos_compra.map(d => ({
        id_insumo: d.id_insumo,
        nombre: d.insumo?.nombre || `Insumo #${d.id_insumo}`,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        monto_total: d.monto_total || (d.cantidad * d.precio_unitario)
      }))
    } else {
      alert('Aviso: Esta compra no tiene productos asociados en el detalle.')
    }
  } catch (error) {
    console.error("Detalle completo del error al cargar:", error)
    alert(`Excepción al cargar la compra: ${error.message}. ` + (error.config ? `URL: ${error.config.url}` : ''))
  }
}

function cargarDatosProveedor() {
  const prov = store.proveedores.find(p => p.id_proveedor === parseInt(compra.id_proveedor))
  if (prov) {
    compra.proveedor_nombre = prov.nombre
    compra.proveedor_telefono = prov.telefono
    compra.proveedor_rnc = prov.rnc
  } else {
    compra.proveedor_nombre = ''
    compra.proveedor_telefono = ''
    compra.proveedor_rnc = ''
  }
}

function agregarInsumo() {
  if (!insumoSeleccionado.value) return
  
  const ins = insumoStore.insumos.find(i => i.id_insumo === parseInt(insumoSeleccionado.value))
  if (!ins) return
  
  const cantidad = cantidadInsumo.value || 1
  const precio = precioManual.value !== null ? parseFloat(precioManual.value) : parseFloat(ins.precio)
  const total = precio * cantidad
  
  detalles.value.push({
    id_insumo: ins.id_insumo,
    nombre: ins.nombre,
    cantidad: cantidad,
    precio_unitario: precio,
    monto_total: total
  })
  
  insumoSeleccionado.value = ''
  cantidadInsumo.value = 1
  precioManual.value = null
}

function eliminarInsumo(index) {
  detalles.value.splice(index, 1)
}

function calcularTotal() {
  return detalles.value.reduce((sum, d) => sum + parseFloat(d.monto_total), 0)
}

function formatearNumero(numero) {
  return parseFloat(numero).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function limpiarInsumos() {
  if (confirm('¿Está seguro de quitar todos los insumos de esta compra?')) {
    detalles.value = []
  }
}

async function guardarCompra() {
  if (!compra.id_proveedor) {
    alert('Debe seleccionar un proveedor')
    return
  }
  
  if (detalles.value.length === 0) {
    alert('Debe agregar al menos un insumo al detalle de compra')
    return
  }

  const datosAPI = {
    id_proveedor: parseInt(compra.id_proveedor),
    fecha: compra.fecha,
    ncf: compra.ncf ? parseInt(compra.ncf) : null,
    metodo_pago: compra.metodo_pago,
    productos: detalles.value.map(d => ({
      id_insumo: d.id_insumo,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario
    }))
  }

  let resultado = false
  if (modoEdicion.value) {
    resultado = await store.actualizarCompra(compraId.value, datosAPI)
  } else {
    resultado = await store.crearCompra(datosAPI)
  }
  
  if (resultado) {
    alert(modoEdicion.value ? 'Compra actualizada correctamente' : 'Compra registrada correctamente')
    router.push({ name: 'Compra' })
  } else {
    alert('Error al guardar: ' + store.error)
  }
}

function volver() {
  router.push({ name: 'Compra' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

* {
  font-family: 'DM Sans', sans-serif;
}

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

.form-input, .form-select {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}
</style>
