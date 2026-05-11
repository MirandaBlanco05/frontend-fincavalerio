const fs = require('fs');

// --- 1. COMPRA INDEX ---
const cIndex = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/compraindex.vue';
let txtI = fs.readFileSync(cIndex, 'utf8');

// Use getSecuenciaNCF
txtI = txtI.replace(/\{\{\s*compra\.ncf\s*\|\|\s*'—'\s*\}\}/, '{{ getSecuenciaNCF(compra.ncf) }}');

// Use numero_factura instead of URL attach logic
txtI = txtI.replace(/<span v-if="compra\.url_factura"[\s\S]*?<\/td>/, '{{ compra.numero_factura || \'—\' }}\n            </td>');

// Add import api
if (!txtI.includes('import api')) {
  txtI = txtI.replace(/import \{ useRouter \} from 'vue-router'/, "import { useRouter } from 'vue-router'\nimport api from '@/core/api/axios.js'");
}

// Fetch ncfs
const onMountedIndex = `onMounted(async () => {
  await store.cargarCompras()
  await store.cargarProveedores()
  try {
    const res = await api.get('/ncf/secuencia/listar')
    ncfs.value = res.data || []
  } catch(e) { console.error('Error NCF:', e) }
})`;
txtI = txtI.replace(/onMounted\(async \(\) => \{\s*await store\.cargarCompras\(\)\s*await store\.cargarProveedores\(\)\s*\}\)/, onMountedIndex);

fs.writeFileSync(cIndex, txtI);


// --- 2. COMPRA FORM ---
const cForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraForm.vue';
let txtF = fs.readFileSync(cForm, 'utf8');

// Add imports
if (!txtF.includes('import api')) {
  txtF = txtF.replace(/import \{ useComprasStore \} from '.*?'/, "import { useComprasStore } from '@/modules/compra/store/compra.store.js'\nimport api from '@/core/api/axios.js'\nimport insumoService from '@/modules/insumo/services/insumo.service.js'");
}

// Add proveedor_provincia HTML
const provHtml = `          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">map</span>
              Provincia
            </label>
            <input 
              v-model="compra.proveedor_provincia" 
              type="text" 
              class="form-input bg-gray-50"
              readonly
            />
          </div>
        </div>`;
txtF = txtF.replace(/<\/div>\s*<!-- Columna 2: Agregar Producto\/Insumo -->/, provHtml + '\n\n        <!-- Columna 2: Agregar Producto/Insumo -->');

// Update cargarDatosProveedor
const cargarProv = `function cargarDatosProveedor() {
  const prov = proveedores.value.find(p => p.id_proveedor === parseInt(compra.id_proveedor))
  if (prov) {
    compra.proveedor_nombre = prov.nombre
    compra.proveedor_direccion = prov.direccion || ''
    compra.proveedor_telefono = prov.telefono || ''
    compra.proveedor_provincia = prov.provincia || ''
  } else {
    compra.proveedor_nombre = ''
    compra.proveedor_direccion = ''
    compra.proveedor_telefono = ''
    compra.proveedor_provincia = ''
  }
}`;
txtF = txtF.replace(/function cargarDatosProveedor\(\) \{[\s\S]*?\}\n\}/, cargarProv);

fs.writeFileSync(cForm, txtF);

console.log('Fixed Compra issues directly!');
