const fs = require('fs');
const vForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txt = fs.readFileSync(vForm, 'utf8');

// 1. Convert NCF to Select with sequence
txt = txt.replace(/<input\s*v-model="factura\.ncf"\s*type="text"\s*required\s*class="form-input"\s*placeholder="B0100000001"\s*\/>/, 
  `<select v-model="factura.ncf" required class="form-select">
              <option value="">Seleccione NCF...</option>
              <option v-for="ncf in ncfsDisponibles" :key="ncf.id_secuencia" :value="ncf.id_secuencia">
                {{ formatoNCF(ncf) }}
              </option>
            </select>`);

// 2. Add imports
if(!txt.includes('clienteService')) {
  txt = txt.replace(/import \{ useVentaStore \} from '.*?'/, "import { useVentaStore } from '@/modules/venta/store/venta.store.js'\nimport api from '@/core/api/axios.js'\nimport clienteService from '@/modules/cliente/services/cliente.service.js'\nimport productoService from '@/modules/producto/services/producto.service.js'");
}

// 3. Change onMounted
const newOnMounted = `onMounted(async () => {
  try {
    const [cRes, pRes, nRes] = await Promise.all([
      clienteService.listar(),
      productoService.listar(),
      api.get('/ncf/secuencia/listar')
    ])
    clientes.value = cRes || []
    productosDisponibles.value = pRes || []
    ncfsDisponibles.value = nRes.data || []
  } catch(e) { console.error('Error cargando catalogos:', e) }

  if (modoEdicion.value) {`;

txt = txt.replace(/onMounted\(\(.*?\) => \{\s*if \(modoEdicion\.value\) \{/, newOnMounted);

// 4. Cheque and others
txt = txt.replace(/<option value="Transferencia">Transferencia<\/option>\s*<option value="Efectivo">Efectivo<\/option>/g, '<option value="Transferencia">Transferencia</option>\n                <option value="Efectivo">Efectivo</option>\n                <option value="Cheque">Cheque</option>');
txt = txt.replace(/parseInt\(factura\.id_cliente\)/g, 'Number(factura.id_cliente)');

// 5. Add arrays
txt = txt.replace(/const clientes = ref\(\[[\s\S]*?\]\)/, 'const clientes = ref([])');
txt = txt.replace(/const productosDisponibles = ref\(\[[\s\S]*?\]\)/, 'const productosDisponibles = ref([])');
txt = txt.replace(/const ncfsDisponibles = ref\(\[\]\)/, 'const ncfsDisponibles = ref([])'); // just in case

// 6. Add formatoNCF function
if (!txt.includes('function formatoNCF')) {
  txt = txt.replace(/<\/script>/, `
function formatoNCF(ncf) {
  if (!ncf || !ncf.comprobante) return ncf.secuencia;
  const serie = ncf.comprobante.serie;
  const tipo = String(ncf.comprobante.tipo || 1).padStart(2, '0');
  const num = String(ncf.secuencia).padStart(8, '0');
  return \`\${serie}\${tipo}\${num}\`;
}
</script>`);
}

fs.writeFileSync(vForm, txt);
console.log('Fixed VentaForm.vue successfully!');
