const fs = require('fs');

// 1. CompraIndex.vue: Remove Factura column
const cIndex = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraIndex.vue';
let txtCI = fs.readFileSync(cIndex, 'utf8');

txtCI = txtCI.replace(/<th class="px-6 py-4">Factura<\/th>/, '');
txtCI = txtCI.replace(/<td class="px-6 py-3">\s*\{\{ compra\.numero_factura \|\| '—' \}\}\s*<\/td>/, '');
txtCI = txtCI.replace(/colspan="5"/g, 'colspan="4"');
txtCI = txtCI.replace(/<div class="flex items-center gap-2">\s*<input type="checkbox" v-model="filtros\.conFactura".*?<\/div>/s, '');
txtCI = txtCI.replace(/if \(conFactura && !c\.url_factura\) return false/, '');
fs.writeFileSync(cIndex, txtCI);


// 2. CompraForm.vue: Remove Factura input
const cForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraForm.vue';
let txtCF = fs.readFileSync(cForm, 'utf8');

const regexFacturaDiv = /<!-- Numero de Factura -->\s*<div>\s*<label class="form-label required">\s*<span class="material-symbols-outlined">receipt_long<\/span>\s*No\. Factura Física\s*<\/label>\s*<input[^>]+v-model="compra\.numero_factura"[^>]+>\s*<\/div>/;
txtCF = txtCF.replace(regexFacturaDiv, '');
txtCF = txtCF.replace(/numero_factura:\s*compra\.numero_factura/, '');
fs.writeFileSync(cForm, txtCF);


// 3. VentaForm.vue: Auto-fill provincia and telefono
const vForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txtVF = fs.readFileSync(vForm, 'utf8');

// Change label from Dirección to Provincia
txtVF = txtVF.replace(
  /<span class="material-symbols-outlined">location_on<\/span>\s*Dirección\s*<\/label>/,
  '<span class="material-symbols-outlined">location_on</span>\n              Provincia\n            </label>'
);

// Add watch in script setup
const watchStr = `
import { watch } from 'vue'

watch(() => factura.id_cliente, (newId) => {
  if (!newId) {
    factura.cliente_direccion = ''
    factura.cliente_telefono = ''
    return
  }
  const cliente = clientes.value.find(c => c.id_cliente === newId)
  if (cliente) {
    factura.cliente_direccion = cliente.provincia?.nombre || ''
    factura.cliente_telefono = cliente.telefono || ''
  }
})
`;

if (!txtVF.includes('watch(() => factura.id_cliente')) {
  txtVF = txtVF.replace(/import \{ ref, reactive, computed, onMounted \} from 'vue'/, "import { ref, reactive, computed, onMounted, watch } from 'vue'");
  txtVF = txtVF.replace(/onMounted\(async \(\) => \{/, `${watchStr}\n\nonMounted(async () => {`);
}

fs.writeFileSync(vForm, txtVF);

console.log("Factura removed from compra, and Venta auto-fill added!");
