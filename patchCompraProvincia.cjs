const fs = require('fs');
const cForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraForm.vue';
let txt = fs.readFileSync(cForm, 'utf8');

// Añadir ref para provincias
if (!txt.includes('const provinciasDisponibles = ref([])')) {
  txt = txt.replace('const ncfsDisponibles = ref([]);', 'const ncfsDisponibles = ref([]);\nconst provinciasDisponibles = ref([]);');
}

// Update onMounted
const newOnMounted = `onMounted(async () => {
  try {
    const [insRes, ncfRes, provRes] = await Promise.all([
      insumoService.listar(),
      api.get('/ncf/secuencia/listar'),
      api.get('/provincia/listar')
    ])
    itemsDisponibles.value = (insRes || []).map(i => ({
      id_item: i.id_insumo,
      tipo: i.tipo_insumo,
      descripcion: i.nombre,
      precio: parseFloat(i.precio) || 0
    }))
    ncfsDisponibles.value = (ncfRes && ncfRes.data) || ncfRes || []
    provinciasDisponibles.value = (provRes && provRes.data) || provRes || []
  } catch(e) { console.error('Error cargando catalogos:', e) }`;

txt = txt.replace(/onMounted\(async \(\) => \{\s*try \{\s*const \[insRes, ncfRes\] = await Promise\.all\(\[\s*insumoService\.listar\(\),\s*api\.get\('\/ncf\/secuencia\/listar'\)\s*\]\)\s*itemsDisponibles\.value = [^\n]*\s*[^}]*\}\s*\}\)/s, ''); 
// We will just do a simpler replace targeting the try-catch block inside onMounted
txt = txt.replace(/try\s*\{\s*const \[insRes, ncfRes\] = await Promise\.all\(\[\s*insumoService\.listar\(\),\s*api\.get\('\/ncf\/secuencia\/listar'\)\s*\]\)\s*itemsDisponibles\.value =.*?\s*ncfsDisponibles\.value =.*?\s*\}\s*catch\(e\)\s*\{\s*console\.error\([^)]+\)\s*\}/s, `try {
    const [insRes, ncfRes, provRes] = await Promise.all([
      insumoService.listar(),
      api.get('/ncf/secuencia/listar'),
      api.get('/provincia/listar')
    ])
    itemsDisponibles.value = (insRes || []).map(i => ({
      id_item: i.id_insumo,
      tipo: i.tipo_insumo,
      descripcion: i.nombre,
      precio: parseFloat(i.precio) || 0
    }))
    ncfsDisponibles.value = (ncfRes && ncfRes.data) || ncfRes || []
    provinciasDisponibles.value = (provRes && provRes.data) || provRes || []
  } catch(e) { console.error('Error cargando catalogos:', e) }`);

// Update cargarDatosProveedor
const cargarProv = `function cargarDatosProveedor() {
  const prov = proveedores.value.find(p => p.id_proveedor === parseInt(compra.id_proveedor))
  if (prov) {
    compra.proveedor_nombre = prov.nombre
    compra.proveedor_direccion = prov.direccion || ''
    compra.proveedor_telefono = prov.telefono || ''
    
    // Buscar el nombre de la provincia
    const provincia = provinciasDisponibles.value.find(p => p.id_provincia === prov.id_provincia)
    compra.proveedor_provincia = provincia ? provincia.nombre : ''
  } else {
    compra.proveedor_nombre = ''
    compra.proveedor_direccion = ''
    compra.proveedor_telefono = ''
    compra.proveedor_provincia = ''
  }
}`;
txt = txt.replace(/function cargarDatosProveedor\(\) \{[\s\S]*?\}\n\}/, cargarProv);

fs.writeFileSync(cForm, txt);
console.log('Fixed Provincias!');
