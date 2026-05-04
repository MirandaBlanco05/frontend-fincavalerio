<template>
  <div class="min-h-screen bg-[#fafafa] p-8">
    
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Nueva Factura</h1>
        <p class="text-sm text-gray-600">Complete los datos de la factura y agregue productos</p>
      </div>
      <button @click="router.push({ name: 'Venta' })" class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Volver
      </button>
    </div>

    <!-- Card Datos Factura -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <h2 class="text-xl font-bold mb-6 pb-3 border-b-2 border-gray-100">Datos Factura</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna 1: Datos Cliente -->
        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">person</span>
              Cliente
            </label>
            <select 
              v-model="factura.id_cliente"
              @change="cargarDatosCliente"
              class="form-select"
              required
            >
              <option value="">Seleccione...</option>
              <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
                {{ cliente.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">location_on</span>
              Dirección
            </label>
            <input 
              v-model="factura.cliente_direccion" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">phone</span>
              Teléfono
            </label>
            <input 
              v-model="factura.cliente_telefono" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
            />
          </div>
        </div>

        <!-- Columna 2: Agregar Producto -->
        <div class="flex flex-col gap-4 items-center justify-center">
          <div class="w-full">
            <label class="form-label text-center block mb-2">
              <span class="material-symbols-outlined">shopping_cart</span>
              Agregar Producto
            </label>
            <select 
              v-model="productoSeleccionado"
              class="form-select"
            >
              <option value="">Seleccione producto...</option>
              <option v-for="prod in productosDisponibles" :key="prod.id_producto" :value="prod.id_producto">
                {{ prod.descripcion }} - RD$ {{ formatearNumero(prod.precio) }}
              </option>
            </select>
          </div>
          
          <div class="w-full flex gap-2">
            <input 
              v-model.number="cantidadProducto" 
              type="number" 
              min="1"
              placeholder="Cantidad"
              class="flex-1 form-input"
            />
            <button 
              @click="agregarProducto" 
              :disabled="!productoSeleccionado"
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

        <!-- Columna 3: Datos Factura -->
        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">tag</span>
              Factura No.
            </label>
            <input 
              v-model="factura.numero_factura" 
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
              v-model="factura.fecha" 
              type="date" 
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">verified_user</span>
              NCF
            </label>
            <select 
              v-model="factura.ncf"
              class="form-select"
              required
            >
              <option value="">Seleccione NCF...</option>
              <option v-for="ncf in ncfsDisponibles" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                {{ ncf.ncf_completo }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">category</span>
              Concepto
            </label>
            <select 
              v-model="factura.concepto" 
              class="form-select"
            >
              <option value="Leche">Leche</option>
              <option value="Ganado">Ganado</option>
              <option value="Suministros">Suministros</option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabla de Productos -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Tipo</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Descripción</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cantidad</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Precio</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Total</th>
            <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(producto, index) in productos" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-900">{{ producto.id_producto }}</td>
            <td class="px-6 py-4 text-gray-900">{{ producto.tipo }}</td>
            <td class="px-6 py-4 text-gray-900">{{ producto.descripcion }}</td>
            <td class="px-6 py-4 text-gray-900">{{ producto.cantidad }}</td>
            <td class="px-6 py-4 text-right text-gray-900">RD$ {{ formatearNumero(producto.precio) }}</td>
            <td class="px-6 py-4 text-right font-bold text-gray-900">RD$ {{ formatearNumero(producto.total) }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="eliminarProducto(index)" class="p-2 hover:bg-red-50 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-red-600">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="productos.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-400">
              No hay productos agregados
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
              v-model="factura.metodo_pago" 
              class="form-select w-48"
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
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
          <button @click="guardarFactura" class="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2">
            <span class="material-symbols-outlined">save</span>
            Guardar
          </button>
          <button class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">print</span>
            Imprimir
          </button>
          <button @click="router.push({ name: 'Venta' })" class="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            Volver
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useVentaStore } from '@/modules/venta/store/venta.store.js'

const router = useRouter()
const store = useVentaStore()

const factura = reactive({
  numero_factura: 'FAC-001',
  fecha: new Date().toISOString().split('T')[0],
  ncf: '',
  concepto: 'Leche',
  metodo_pago: 'Transferencia',
  id_cliente: '',
  cliente_nombre: '',
  cliente_direccion: '',
  cliente_telefono: ''
})

const productos = ref([])
const productoSeleccionado = ref('')
const cantidadProducto = ref(1)

// Mock data - TODO: Cargar desde stores reales
const clientes = ref([
  { id_cliente: 1, nombre: 'Agropecuaria El Valle', rnc: '123456789', direccion: 'Calle Principal #10', telefono: '809-555-1234' },
  { id_cliente: 2, nombre: 'Inversiones Ganaderas RD', rnc: '987654321', direccion: 'Av. Central #45', telefono: '809-555-5678' }
])

const productosDisponibles = ref([
  { id_producto: 1, tipo: 'Leche', descripcion: 'Leche Fresca 1L', precio: 85.00, stock: 100 },
  { id_producto: 2, tipo: 'Queso', descripcion: 'Queso Fresco 1lb', precio: 150.00, stock: 50 },
  { id_producto: 3, tipo: 'Yogurt', descripcion: 'Yogurt Natural 500ml', precio: 120.00, stock: 75 }
])

const ncfsDisponibles = ref([
  { id_secuencia: 1, ncf_completo: 'B0100000001' },
  { id_secuencia: 2, ncf_completo: 'B0100000002' }
])

function cargarDatosCliente() {
  const cliente = clientes.value.find(c => c.id_cliente === parseInt(factura.id_cliente))
  if (cliente) {
    factura.cliente_nombre = cliente.nombre
    factura.cliente_direccion = cliente.direccion
    factura.cliente_telefono = cliente.telefono
  }
}

function agregarProducto() {
  if (!productoSeleccionado.value) return
  
  const prod = productosDisponibles.value.find(p => p.id_producto === parseInt(productoSeleccionado.value))
  if (!prod) return
  
  const cantidad = cantidadProducto.value || 1
  const total = prod.precio * cantidad
  
  productos.value.push({
    id_producto: prod.id_producto,
    tipo: prod.tipo,
    descripcion: prod.descripcion,
    cantidad: cantidad,
    precio: prod.precio,
    total: total
  })
  
  productoSeleccionado.value = ''
  cantidadProducto.value = 1
}

function eliminarProducto(index) {
  productos.value.splice(index, 1)
}

function calcularTotal() {
  return productos.value.reduce((sum, p) => sum + p.total, 0)
}

function formatearNumero(numero) {
  return numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function limpiarFormulario() {
  if (confirm('¿Está seguro de limpiar todos los datos?')) {
    factura.numero_factura = 'FAC-001'
    factura.fecha = new Date().toISOString().split('T')[0]
    factura.ncf = ''
    factura.concepto = 'Leche'
    factura.metodo_pago = 'Transferencia'
    factura.id_cliente = ''
    factura.cliente_nombre = ''
    factura.cliente_direccion = ''
    factura.cliente_telefono = ''
    productos.value = []
    productoSeleccionado.value = ''
    cantidadProducto.value = 1
  }
}

async function guardarFactura() {
  if (!factura.id_cliente) {
    alert('Debe seleccionar un cliente')
    return
  }
  
  if (productos.value.length === 0) {
    alert('Debe agregar al menos un producto')
    return
  }

  if (!factura.ncf) {
    alert('Debe seleccionar un NCF')
    return
  }

  const datos = {
    id_cliente: parseInt(factura.id_cliente),
    fecha: factura.fecha,
    concepto: factura.concepto,
    ncf: parseInt(factura.ncf),
    estado: 'activo',
    productos: productos.value
  }

  const resultado = await store.crearVenta(datos)
  
  if (resultado.success) {
    alert('Factura guardada correctamente')
    router.push({ name: 'Venta' })
  } else {
    alert('Error: ' + resultado.error)
  }
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