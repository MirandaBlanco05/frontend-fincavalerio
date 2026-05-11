<template>
  <div class="min-h-screen bg-[#fafafa] p-8">
    
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ modoEdicion ? 'Editar Compra' : 'Nueva Compra' }}</h1>
        <p class="text-sm text-gray-600">Complete los datos de la compra y agregue productos/insumos</p>
      </div>
      <button @click="router.push({ name: 'Compra' })" class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Volver
      </button>
    </div>

    <!-- Card Datos Compra -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <h2 class="text-xl font-bold mb-6 pb-3 border-b-2 border-gray-100">Datos de la Compra</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna 1: Datos Proveedor -->
        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">storefront</span>
              Proveedor
            </label>
            <select 
              v-model="compra.id_proveedor"
              @change="cargarDatosProveedor"
              class="form-select"
              required
            >
              <option value="">Seleccione...</option>
              <option v-for="prov in proveedores" :key="prov.id_proveedor" :value="prov.id_proveedor">
                {{ prov.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">map</span>
              Provincia
            </label>
            <input 
              v-model="compra.proveedor_provincia" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
              placeholder="Provincia del proveedor"
            />
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
        </div>

        <!-- Columna 2: Agregar Producto/Insumo -->
        <div class="flex flex-col gap-4 items-center justify-center">
          <div class="w-full">
            <label class="form-label text-center block mb-2">
              <span class="material-symbols-outlined">inventory_2</span>
              Agregar Item
            </label>
            <select 
              v-model="itemSeleccionado"
              class="form-select"
            >
              <option value="">Seleccione item...</option>
              <option v-for="item in itemsDisponibles" :key="item.id_item" :value="item.id_item">
                {{ item.descripcion }} - RD$ {{ formatearNumero(item.precio) }}
              </option>
            </select>
          </div>
          
          <div class="w-full flex gap-2">
            <input 
              v-model.number="cantidadItem" 
              type="number" 
              min="1"
              placeholder="Cantidad"
              class="flex-1 form-input"
            />
            <button 
              @click="agregarItem" 
              :disabled="!itemSeleccionado"
              class="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>

          <button @click="limpiarFormulario" class="w-full px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">delete_sweep</span>
            Limpiar
          </button>
        </div>

        <!-- Columna 3: Datos Factura de Compra -->
        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">tag</span>
              Factura No.
            </label>
            <input 
              v-model="compra.numero_factura" 
              type="text" 
              class="form-input bg-gray-50"
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
            <select v-model="compra.ncf" class="form-select">
              <option value="">Seleccione NCF...</option>
              <option v-for="ncf in ncfsDisponibles" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                {{ formatoNCF(ncf) }}
              </option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabla de Items -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Tipo</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Descripción</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cantidad</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Precio Compra</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Total</th>
            <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-900">{{ item.id_item }}</td>
            <td class="px-6 py-4 text-gray-900">{{ item.tipo }}</td>
            <td class="px-6 py-4 text-gray-900">{{ item.descripcion }}</td>
            <td class="px-6 py-4 text-gray-900">{{ item.cantidad }}</td>
            <td class="px-6 py-4 text-right text-gray-900">RD$ {{ formatearNumero(item.precio) }}</td>
            <td class="px-6 py-4 text-right font-bold text-gray-900">RD$ {{ formatearNumero(item.total) }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="eliminarItem(index)" class="p-2 hover:bg-red-50 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-red-600">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              No hay items agregados a esta compra
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer: Total y Botones -->
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
              <option value="Cheque">Cheque</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>
          <div class="flex items-center gap-4">
            <label class="font-bold text-gray-900">Total Compra</label>
            <input 
              :value="'RD$ ' + formatearNumero(calcularTotal())" 
              type="text" 
              class="w-52 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg font-bold text-right text-blue-800 text-xl"
              readonly
            />
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex gap-3 flex-wrap">
          <button @click="guardarCompra" :disabled="cargando" class="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50">
            <span class="material-symbols-outlined">save</span>
            {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
          <button @click="router.push({ name: 'Compra' })" class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            Volver
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useComprasStore } from '@/modules/compra/store/compra.store.js'
import api from '@/core/api/axios.js'
import insumoService from '@/modules/insumo/services/insumo.service.js'

const router = useRouter()
const route = useRoute()
const store = useComprasStore()

const modoEdicion = computed(() => !!route.params.id)
const compraGuardada = ref(false)
const cargando = ref(false)

const compra = reactive({
  numero_factura: 'COM-001',
  fecha: new Date().toISOString().split('T')[0],
  ncf: '',
  url_factura: '',
  metodo_pago: 'Transferencia',
  id_proveedor: '',
  proveedor_nombre: '',
  proveedor_telefono: '',
  proveedor_provincia: ''
})

const items = ref([])
const itemSeleccionado = ref('')
const cantidadItem = ref(1)

const proveedores = computed(() => store.proveedores)

const itemsDisponibles = ref([]);
const ncfsDisponibles = ref([]);

onMounted(async () => {
  try {
    const [insRes, ncfRes] = await Promise.all([
      insumoService.listar(),
      api.get('/ncf/secuencia/listar')
    ])
    itemsDisponibles.value = (insRes || []).map(i => ({
      id_item: i.id_insumo,
      tipo: i.tipo_insumo,
      descripcion: i.nombre,
      precio: parseFloat(i.precio) || 0
    }))
    ncfsDisponibles.value = (ncfRes && ncfRes.data) || ncfRes || []
  } catch(e) { console.error('Error cargando catalogos:', e) }

  if (store.proveedores.length === 0) {
    await store.cargarProveedores()
  }

  if (modoEdicion.value) {
    const id = route.params.id
    try {
      const res = await api.get(`/compra/obtener/${id}`)
      const comp = res.data
      
      if (comp) {
        compra.numero_factura = comp.numero_factura || `COM-${comp.id_compra.toString().padStart(3, '0')}`
        compra.fecha = comp.fecha ? new Date(comp.fecha).toISOString().split('T')[0] : ''
        compra.ncf = comp.ncf || comp.Id_ncf || ''
        compra.metodo_pago = comp.metodo_pago || 'Transferencia'
        compra.id_proveedor = comp.id_proveedor || comp.Id_proveedor || ''
        
        if (comp.proveedor) {
          compra.proveedor_nombre = comp.proveedor.nombre
          compra.proveedor_telefono = comp.proveedor.telefono || ''
          compra.proveedor_provincia = comp.proveedor.provincia?.nombre || comp.proveedor.provincia || ''
        }
        
        if (comp.productos_compra) {
          items.value = comp.productos_compra.map(pc => ({
            id_item: pc.id_insumo || pc.id_producto,
            tipo: pc.insumo?.tipo_insumo || 'N/A',
            descripcion: pc.insumo?.nombre || 'N/A',
            cantidad: pc.cantidad,
            precio: pc.precio_unitario,
            total: pc.monto_total || (pc.cantidad * pc.precio_unitario)
          }))
        }
        
        compraGuardada.value = true
      }
    } catch (e) {
      console.error("Error al cargar compra para editar", e)
    }
  }
})

function cargarDatosProveedor() {
  const prov = proveedores.value.find(p => p.id_proveedor === parseInt(compra.id_proveedor))
  if (prov) {
    compra.proveedor_nombre = prov.nombre
    compra.proveedor_telefono = prov.telefono || ''
    compra.proveedor_provincia = prov.provincia?.nombre || prov.provincia || ''
  } else {
    compra.proveedor_nombre = ''
    compra.proveedor_telefono = ''
    compra.proveedor_provincia = ''
  }
}

function agregarItem() {
  if (!itemSeleccionado.value) return
  
  const selected = itemsDisponibles.value.find(i => i.id_item === parseInt(itemSeleccionado.value))
  if (!selected) return
  
  const cantidad = cantidadItem.value || 1
  const total = selected.precio * cantidad
  
  items.value.push({
    id_item: selected.id_item,
    tipo: selected.tipo,
    descripcion: selected.descripcion,
    cantidad: cantidad,
    precio: selected.precio,
    total: total
  })
  
  itemSeleccionado.value = ''
  cantidadItem.value = 1
}

function eliminarItem(index) {
  items.value.splice(index, 1)
}

function calcularSubtotal() {
  return items.value.reduce((sum, i) => sum + i.total, 0)
}

function calcularImpuestos() {
  return calcularSubtotal() * 0.18 // 18% ITBIS
}

function calcularTotal() {
  return calcularSubtotal() + calcularImpuestos()
}

function formatearNumero(numero) {
  return (numero || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function limpiarFormulario() {
  if (confirm('¿Está seguro de limpiar todos los datos?')) {
    compra.numero_factura = 'COM-001'
    compra.fecha = new Date().toISOString().split('T')[0]
    compra.ncf = ''
    compra.metodo_pago = 'Transferencia'
    compra.id_proveedor = ''
    compra.proveedor_nombre = ''
    compra.proveedor_telefono = ''
    compra.proveedor_provincia = ''
    items.value = []
    itemSeleccionado.value = ''
    cantidadItem.value = 1
    compraGuardada.value = false
  }
}

async function guardarCompra() {
  if (!compra.id_proveedor) {
    alert('Debe seleccionar un proveedor')
    return
  }
  
  cargando.value = true

  const datos = {
    id_proveedor: parseInt(compra.id_proveedor),
    fecha: compra.fecha,
    ncf: parseInt(compra.ncf) || null,
    metodo_pago: compra.metodo_pago,
    productos: items.value
  }

  let resultado = false
  if (modoEdicion.value) {
    resultado = await store.actualizarCompra(route.params.id, datos)
  } else {
    resultado = await store.crearCompra(datos)
  }
  
  cargando.value = false

  if (resultado !== false) {
    compraGuardada.value = true
    alert(modoEdicion.value ? 'Compra actualizada correctamente' : 'Compra guardada correctamente')
    router.push({ name: 'Compra' })
  } else {
    alert('Error al guardar la compra: ' + store.error)
  }
}

function formatoNCF(ncf) {
  if (!ncf) return '—';
  if (ncf.ncf_completo) return ncf.ncf_completo;
  if (!ncf.comprobante) return ncf.secuencia;
  const serie = ncf.comprobante.serie;
  const tipo = String(ncf.comprobante.tipo || 1).padStart(2, '0');
  const num = String(ncf.secuencia).padStart(8, '0');
  return `${serie}${tipo}${num}`;
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
