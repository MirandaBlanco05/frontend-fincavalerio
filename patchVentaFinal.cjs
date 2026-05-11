const fs = require('fs');
const vForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txt = fs.readFileSync(vForm, 'utf8');

txt = txt.replace(/onMounted\(async \(\) => \{\r?\n\s*if \(modoEdicion\.value\) \{/, `onMounted(async () => {
  try {
    const [cRes, pRes, nRes] = await Promise.all([
      clienteService.listar(),
      productoService.listar(),
      api.get('/ncf/secuencia/listar')
    ])
    clientes.value = cRes.data || cRes || []
    productosDisponibles.value = pRes.data || pRes || []
    ncfsDisponibles.value = nRes.data || []
  } catch(e) { console.error('Error cargando catalogos:', e) }

  if (modoEdicion.value) {`);

if (!txt.includes('const ncfsDisponibles = ref([])')) {
  txt = txt.replace('const productosDisponibles = ref([])', 'const productosDisponibles = ref([])\nconst ncfsDisponibles = ref([])');
}

fs.writeFileSync(vForm, txt);
console.log('Fixed VentaForm!');
