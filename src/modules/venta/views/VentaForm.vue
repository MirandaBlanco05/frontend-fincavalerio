<template>
  <div class="min-h-screen bg-[#fff8f5]">
    
    <!-- Header -->
    <div class="bg-[#6e420c] text-white py-8 px-8 shadow-lg">
      <h1 class="text-4xl font-bold text-center font-['Manrope']">Factura Venta</h1>
    </div>

    <!-- Contenedor Principal -->
    <div class="max-w-[1600px] mx-auto p-10">

      <!-- Card Datos Factura -->
      <div class="bg-white rounded-xl shadow-sm border border-[#ece0d9] p-10 mb-8">
        <h2 class="text-2xl font-bold mb-8 pb-4 border-b-2 border-[#ece0d9] text-[#201b16]">Datos Factura</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <!-- Columna 1: Datos Cliente -->
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <label class="font-bold w-28 text-[#201b16] text-base">Cliente</label>
              <select 
                v-model="factura.id_cliente"
                @change="cargarDatosCliente"
                class="flex-1 px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
              >
                <option value="">Seleccione...</option>
                <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
                  {{ cliente.nombre }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold w-28 text-[#201b16] text-base">Dirección</label>
              <input 
                v-model="factura.cliente_direccion" 
                type="text" 
                class="flex-1 px-4 py-3 bg-[#f1e6de] border-none rounded-lg text-[#837468]"
                readonly
              />
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold w-28 text-[#201b16] text-base">Teléfono</label>
              <input 
                v-model="factura.cliente_telefono" 
                type="text" 
                class="flex-1 px-4 py-3 bg-[#f1e6de] border-none rounded-lg text-[#837468]"
                readonly
              />
            </div>
          </div>

          <!-- Columna 2: Producto y Acciones -->
          <div class="flex flex-col gap-6 items-center justify-center">
            <div class="w-full">
              <label class="block font-bold mb-3 text-center text-[#201b16] text-base">Agregar Producto</label>
              <select 
                v-model="productoSeleccionado"
                class="w-full px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 font-semibold text-[#201b16]"
              >
                <option value="">Seleccione producto...</option>
                <option v-for="prod in productosDisponibles" :key="prod.id_producto" :value="prod.id_producto">
                  {{ prod.descripcion }} - RD$ {{ formatearNumero(prod.precio) }}
                </option>
              </select>
            </div>
            
            <div class="w-full flex gap-3">
              <input 
                v-model.number="cantidadProducto" 
                type="number" 
                min="1"
                placeholder="Cantidad"
                class="flex-1 px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
              />
              <button 
                @click="agregarProducto" 
                :disabled="!productoSeleccionado"
                class="px-8 py-3 bg-[#6e420c] text-white rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>

            <button @click="limpiarFormulario" class="w-full px-6 py-3 bg-[#f1e6de] text-[#512d00] hover:bg-[#ece0d9] rounded-lg font-bold transition-colors">
              Limpiar
            </button>
          </div>

          <!-- Columna 3: Datos Factura -->
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <label class="font-bold w-32 text-[#201b16] text-base">Factura No.</label>
              <input 
                v-model="factura.numero_factura" 
                type="text" 
                class="flex-1 px-4 py-3 bg-[#f1e6de] border-none rounded-lg text-[#837468]"
                readonly
              />
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold w-32 text-[#201b16] text-base">Fecha:</label>
              <input 
                v-model="factura.fecha" 
                type="date" 
                class="flex-1 px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
              />
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold w-32 text-[#201b16] text-base">NCF:</label>
              <select 
                v-model="factura.ncf"
                class="flex-1 px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
              >
                <option value="">Seleccione NCF...</option>
                <option v-for="ncf in ncfsDisponibles" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                  {{ ncf.ncf_completo }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold w-32 text-[#201b16] text-base">Concepto</label>
              <select 
                v-model="factura.concepto" 
                class="flex-1 px-4 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
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
      <div class="bg-white rounded-xl shadow-sm border border-[#ece0d9] overflow-hidden mb-8">
        <table class="w-full">
          <thead>
            <tr class="bg-[#f7ece4]">
              <th class="px-6 py-4 text-left font-bold text-sm text-[#837468] uppercase">ID</th>
              <th class="px-6 py-4 text-left font-bold text-sm text-[#837468] uppercase">Tipo</th>
              <th class="px-6 py-4 text-left font-bold text-sm text-[#837468] uppercase">Descripción</th>
              <th class="px-6 py-4 text-left font-bold text-sm text-[#837468] uppercase">Cantidad</th>
              <th class="px-6 py-4 text-right font-bold text-sm text-[#837468] uppercase">Precio</th>
              <th class="px-6 py-4 text-right font-bold text-sm text-[#837468] uppercase">Total</th>
              <th class="px-6 py-4 text-center font-bold text-sm text-[#837468] uppercase">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1e6de]">
            <tr v-for="(producto, index) in productos" :key="index" class="hover:bg-[#fdf1ea]">
              <td class="px-6 py-4 text-[#201b16]">{{ producto.id_producto }}</td>
              <td class="px-6 py-4 text-[#201b16]">{{ producto.tipo }}</td>
              <td class="px-6 py-4 text-[#201b16]">{{ producto.descripcion }}</td>
              <td class="px-6 py-4 text-[#201b16]">{{ producto.cantidad }}</td>
              <td class="px-6 py-4 text-right text-[#201b16]">RD$ {{ formatearNumero(producto.precio) }}</td>
              <td class="px-6 py-4 text-right font-bold text-[#512d00]">RD$ {{ formatearNumero(producto.total) }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="eliminarProducto(index)" class="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] rounded-lg hover:bg-[#ba1a1a] hover:text-white transition-colors font-bold text-sm">
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="productos.length === 0">
              <td colspan="7" class="px-6 py-16 text-center text-[#837468] text-base">
                No hay productos agregados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: Método Pago, Total y Botones -->
      <div class="bg-white rounded-xl shadow-sm border border-[#ece0d9] p-8">
        <div class="flex items-center justify-between flex-wrap gap-8">
          
          <!-- Método Pago y Total -->
          <div class="flex items-center gap-10">
            <div class="flex items-center gap-4">
              <label class="font-bold text-[#201b16] text-base">Método Pago</label>
              <select 
                v-model="factura.metodo_pago" 
                class="px-5 py-3 bg-[#fdf1ea] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e420c]/20 text-[#201b16]"
              >
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="font-bold text-[#201b16] text-base">Total</label>
              <input 
                :value="'RD$ ' + formatearNumero(calcularTotal())" 
                type="text" 
                class="w-52 px-5 py-3 bg-[#f7ece4] border-none rounded-lg font-bold text-right text-[#512d00] text-xl"
                readonly
              />
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex gap-4 flex-wrap">
            <button @click="guardarFactura" class="px-8 py-3 bg-[#6e420c] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg text-base">
              Guardar
            </button>
            <button class="px-8 py-3 bg-[#f1e6de] text-[#512d00] rounded-lg font-bold hover:bg-[#ece0d9] transition-colors text-base">
              Imprimir
            </button>
            <button @click="$router.push('/venta')" class="px-8 py-3 bg-[#f1e6de] text-[#512d00] rounded-lg font-bold hover:bg-[#ece0d9] transition-colors text-base">
              Volver
            </button>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVentaStore } from '@/modules/venta/store/venta.store.js'

const router = useRouter()
const store = useVentaStore()

const factura = ref({
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
  const cliente = clientes.value.find(c => c.id_cliente === parseInt(factura.value.id_cliente))
  if (cliente) {
    factura.value.cliente_nombre = cliente.nombre
    factura.value.cliente_direccion = cliente.direccion
    factura.value.cliente_telefono = cliente.telefono
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
    factura.value = {
      numero_factura: 'FAC-001',
      fecha: new Date().toISOString().split('T')[0],
      ncf: '',
      concepto: 'Leche',
      metodo_pago: 'Transferencia',
      id_cliente: '',
      cliente_nombre: '',
      cliente_direccion: '',
      cliente_telefono: ''
    }
    productos.value = []
    productoSeleccionado.value = ''
    cantidadProducto.value = 1
  }
}

async function guardarFactura() {
  if (!factura.value.id_cliente) {
    alert('Debe seleccionar un cliente')
    return
  }
  
  if (productos.value.length === 0) {
    alert('Debe agregar al menos un producto')
    return
  }

  if (!factura.value.ncf) {
    alert('Debe seleccionar un NCF')
    return
  }

  const datos = {
    id_cliente: parseInt(factura.value.id_cliente),
    fecha: factura.value.fecha,
    concepto: factura.value.concepto,
    ncf: parseInt(factura.value.ncf),
    estado: 'activo',
    productos: productos.value
  }

  const resultado = await store.crearVenta(datos)
  
  if (resultado.success) {
    alert('Factura guardada correctamente')
    router.push('/venta')
  } else {
    alert('Error: ' + resultado.error)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Manrope', sans-serif;
}
</style>