const fs = require('fs');

// --- 1. VENTA FORM ---
const vForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txtV = fs.readFileSync(vForm, 'utf8');

// Replace the onMounted entirely
const onMountedNew = `onMounted(async () => {
  try {
    const [cRes, pRes, nRes] = await Promise.all([
      api.get('/cliente/listar'),
      api.get('/producto/listar'),
      api.get('/ncf/secuencia/listar')
    ])
    
    clientes.value = cRes.data || []
    
    const prodList = pRes.data || []
    productosDisponibles.value = prodList.map(p => ({
      id_producto: p.id_producto,
      descripcion: p.descripcion,
      tipo: p.tipo_producto,
      precio: parseFloat(p.precio_venta) || 0
    }))
    
    ncfsDisponibles.value = nRes.data || []
  } catch(e) { console.error('Error cargando catalogos:', e) }

  if (modoEdicion.value) {`;

txtV = txtV.replace(/onMounted\(async \(\) => \{\s*try \{\s*const \[cRes, pRes, nRes\] = await Promise\.all\(\[.*?\}\s*catch\(e\)\s*\{\s*console\.error\([^)]+\)\s*\}\s*if \(modoEdicion\.value\) \{/s, onMountedNew);

// Add API import if not present
if (!txtV.includes("import api from '@/core/api/axios.js'")) {
  txtV = txtV.replace(/import \{ useRouter, useRoute \} from 'vue-router'/, "import { useRouter, useRoute } from 'vue-router'\nimport api from '@/core/api/axios.js'");
}

// Ensure the form has a metodo_pago fallback and check id_cliente mapping
txtV = txtV.replace(/id_cliente: Number\(factura\.id_cliente\)/g, "id_cliente: Number(factura.id_cliente) || null");
txtV = txtV.replace(/const datos = {\s*id_cliente:\s*Number\(factura\.id_cliente\)[^,]*,\s*fecha:\s*factura\.fecha,\s*concepto:\s*factura\.concepto,\s*ncf:\s*parseInt\(factura\.ncf\),\s*estado:\s*'activo',\s*productos:\s*productos\.value\s*}/s, `const datos = {
    id_cliente: Number(factura.id_cliente) || null,
    fecha: factura.fecha,
    concepto: factura.concepto,
    metodo_pago: factura.metodo_pago || 'Efectivo',
    ncf: parseInt(factura.ncf) || null,
    estado: 'activo',
    productos: productos.value
  }`);

fs.writeFileSync(vForm, txtV);


// --- 2. VENTA INDEX ---
const vIndex = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaIndex.vue';
let txtI = fs.readFileSync(vIndex, 'utf8');

// Add "concepto" to filtros
txtI = txtI.replace(/const filtros = ref\(\{ fechaDesde: '', fechaHasta: '' \}\)/g, "const filtros = ref({ fechaDesde: '', fechaHasta: '', concepto: '' })");
txtI = txtI.replace(/const filtrosAplicados = ref\(\{ fechaDesde: '', fechaHasta: '' \}\)/g, "const filtrosAplicados = ref({ fechaDesde: '', fechaHasta: '', concepto: '' })");
txtI = txtI.replace(/filtros\.value = \{ fechaDesde: '', fechaHasta: '' \}/g, "filtros.value = { fechaDesde: '', fechaHasta: '', concepto: '' }");
txtI = txtI.replace(/filtrosAplicados\.value = \{ fechaDesde: '', fechaHasta: '' \}/g, "filtrosAplicados.value = { fechaDesde: '', fechaHasta: '', concepto: '' }");

// Add computed logic for filtrosActivos
const regexFiltrosActivos = /const filtrosActivos = computed\(\(\) => \{\s*let c = 0\s*if \(filtrosAplicados\.value\.fechaDesde\) c\+\+\s*if \(filtrosAplicados\.value\.fechaHasta\) c\+\+\s*return c\s*\}\)/s;
txtI = txtI.replace(regexFiltrosActivos, `const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.fechaDesde) c++
  if (filtrosAplicados.value.fechaHasta) c++
  if (filtrosAplicados.value.concepto) c++
  return c
})`);

// Add HTML for Concepto filter
const conceptoHtml = `<div>
              <label class="mb-1 block text-sm font-medium">Concepto</label>
              <input v-model="filtros.concepto" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Buscar concepto..." />
            </div>`;
txtI = txtI.replace(/<div class="flex flex-col gap-4 p-4">\s*<div>\s*<label class="mb-1 block text-sm font-medium">Fecha Desde<\/label>/s, `<div class="flex flex-col gap-4 p-4">
            ${conceptoHtml}
            <div>
              <label class="mb-1 block text-sm font-medium">Fecha Desde</label>`);

// Add filtering logic for Concepto
const regexVentasFiltradas = /const ventasFiltradas = computed\(\(\) => \{\s*return store\.ventas\.filter\(v => \{\s*const \{ fechaDesde, fechaHasta \} = filtrosAplicados\.value\s*if \(fechaDesde && v\.fecha\) \{\s*const fechaVenta = new Date\(v\.fecha\)\s*const fechaMin = new Date\(fechaDesde\)\s*if \(fechaVenta < fechaMin\) return false\s*\}\s*if \(fechaHasta && v\.fecha\) \{\s*const fechaVenta = new Date\(v\.fecha\)\s*const fechaMax = new Date\(fechaHasta\)\s*if \(fechaVenta > fechaMax\) return false\s*\}\s*return true\s*\}\)\s*\}\)/s;
txtI = txtI.replace(regexVentasFiltradas, `const ventasFiltradas = computed(() => {
  return store.ventas.filter(v => {
    const { fechaDesde, fechaHasta, concepto } = filtrosAplicados.value

    if (concepto && v.concepto) {
      if (!v.concepto.toLowerCase().includes(concepto.toLowerCase())) return false
    }

    if (fechaDesde && v.fecha) {
      const fechaVenta = new Date(v.fecha)
      const fechaMin = new Date(fechaDesde)
      if (fechaVenta < fechaMin) return false
    }

    if (fechaHasta && v.fecha) {
      const fechaVenta = new Date(v.fecha)
      const fechaMax = new Date(fechaHasta)
      if (fechaVenta > fechaMax) return false
    }

    return true
  })
})`);

fs.writeFileSync(vIndex, txtI);
console.log('Fixed VentaForm and VentaIndex!');
