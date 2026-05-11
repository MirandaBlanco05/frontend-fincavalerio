const fs = require('fs');

// 1. TRATAMIENTO INDEX
const tIndex = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/tratamientos/views/TratamientoIndex.vue';
let txtT = fs.readFileSync(tIndex, 'utf8');

txtT = txtT.replace(/<input v-model="filtros\.tipo" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Buscar por tipo" \/>/, 
  `<select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="Metabolico">Metabolico</option>
                <option value="Antibiotico">Antibiotico</option>
                <option value="Antiparasitario">Antiparasitario</option>
                <option value="Topico">Topico</option>
                <option value="Rehidratacion">Rehidratacion</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Curativo">Curativo</option>
                <option value="Otro">Otro</option>
              </select>`);

// Also change the filter logic slightly for exact match instead of includes since it's a select
txtT = txtT.replace(/if \(tipo && !t\.tipo_tratamiento\?\.toLowerCase\(\)\.includes\(tipo\.toLowerCase\(\)\)\) return false/, "if (tipo && t.tipo_tratamiento !== tipo) return false");
fs.writeFileSync(tIndex, txtT);


// 2. VENTA FORM
const vForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txtV = fs.readFileSync(vForm, 'utf8');

txtV = txtV.replace(/\/ncf\/listar/g, '/ncf/secuencia/listar');
txtV = txtV.replace(/{{ ncf\.secuencia }}/g, '{{ formatoNCF(ncf) }}');

if (!txtV.includes('function formatoNCF')) {
  txtV = txtV.replace(/<\/script>/, `
function formatoNCF(ncf) {
  if (!ncf || !ncf.comprobante) return ncf.secuencia;
  const serie = ncf.comprobante.serie;
  const tipo = String(ncf.comprobante.tipo || 1).padStart(2, '0');
  const num = String(ncf.secuencia).padStart(8, '0');
  return \`\${serie}\${tipo}\${num}\`;
}
</script>`);
}
fs.writeFileSync(vForm, txtV);


// 3. COMPRA FORM
const cForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraForm.vue';
let txtC = fs.readFileSync(cForm, 'utf8');

txtC = txtC.replace(/\/ncf\/listar/g, '/ncf/secuencia/listar');
txtC = txtC.replace(/{{ ncf\.secuencia }}/g, '{{ formatoNCF(ncf) }}');

if (!txtC.includes('function formatoNCF')) {
  txtC = txtC.replace(/<\/script>/, `
function formatoNCF(ncf) {
  if (!ncf || !ncf.comprobante) return ncf.secuencia;
  const serie = ncf.comprobante.serie;
  const tipo = String(ncf.comprobante.tipo || 1).padStart(2, '0');
  const num = String(ncf.secuencia).padStart(8, '0');
  return \`\${serie}\${tipo}\${num}\`;
}
</script>`);
}
fs.writeFileSync(cForm, txtC);

// 4. COMPRA INDEX (Also needs formatting in the table)
const cIndex = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/compraindex.vue';
let txtCI = fs.readFileSync(cIndex, 'utf8');

txtCI = txtCI.replace(/\/ncf\/listar/g, '/ncf/secuencia/listar');

txtCI = txtCI.replace(/return ncf \? ncf\.secuencia : id/, `
  if (!ncf) return id;
  if (!ncf.comprobante) return ncf.secuencia;
  const serie = ncf.comprobante.serie;
  const tipo = String(ncf.comprobante.tipo || 1).padStart(2, '0');
  const num = String(ncf.secuencia).padStart(8, '0');
  return \`\${serie}\${tipo}\${num}\`;
`);
fs.writeFileSync(cIndex, txtCI);

console.log('Final fixes applied!');
