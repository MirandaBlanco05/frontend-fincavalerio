const fs = require('fs');

// 1. TratamientoIndex.vue
const tFile = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/tratamientos/views/TratamientoIndex.vue';
let txtT = fs.readFileSync(tFile, 'utf8');

// Replace nombre input with select
txtT = txtT.replace(
  /<input v-model="filtros\.nombre" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Buscar por nombre" \/>/,
  `<select v-model="filtros.nombre" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option v-for="nom in nombresUnicos" :key="nom" :value="nom">{{ nom }}</option>
              </select>`
);

// Replace tipo select with dynamic select
txtT = txtT.replace(
  /<select v-model="filtros\.tipo"[^>]*>[\s\S]*?<\/select>/,
  `<select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option v-for="tipo in tiposUnicos" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>`
);

// Modify tratamientosFiltrados to check exact match for nombre if it's a select
txtT = txtT.replace(
  /if \(nombre && !t\.nombre\.toLowerCase\(\)\.includes\(nombre\.toLowerCase\(\)\)\) return false/,
  'if (nombre && t.nombre !== nombre) return false'
);

// Add computed properties for nombresUnicos and tiposUnicos
const computedVars = `
const nombresUnicos = computed(() => {
  if (!store.tratamientos) return []
  return [...new Set(store.tratamientos.map(t => t.nombre).filter(Boolean))].sort()
})
const tiposUnicos = computed(() => {
  if (!store.tratamientos) return []
  return [...new Set(store.tratamientos.map(t => t.tipo_tratamiento).filter(Boolean))].sort()
})
`;

if (!txtT.includes('const nombresUnicos =')) {
  txtT = txtT.replace(/const filtros = ref\(.*?\)/, `${computedVars}\nconst filtros = ref({ nombre: '', tipo: '', fechaDesde: '' })`);
}

fs.writeFileSync(tFile, txtT);


// 2. CicloCeloForm.vue
const cFile = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/ciclocelo/views/CicloCeloForm.vue';
let txtC = fs.readFileSync(cFile, 'utf8');

txtC = txtC.replace(
  /<input\s+v-model="form\.Id_bovino"\s+type="number"\s+required\s+class="form-input w-full rounded-xl border-border-light bg-light-beige"\s+\/>/,
  `<select v-model="form.Id_bovino" required class="form-input w-full rounded-xl border-border-light bg-light-beige">
                <option value="" disabled>Seleccione un bovino...</option>
                <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">{{ b.nombre || '#' + b.id_bovino }}</option>
              </select>`
);

txtC = txtC.replace(/import axios from "axios"/, 'import api from "@/core/api/axios.js"\nimport { onMounted, ref } from "vue"');

// Replace the store and API calls
const scriptC = `
const bovinos = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/bovino/listar')
    bovinos.value = res.data || []
  } catch(e) { console.error('Error loading bovinos:', e) }
})

async function guardarCiclo() {
  try {
    await api.post('/ciclo/crear', { ...form, Id_bovino: parseInt(form.Id_bovino) })
    alert("Ciclo registrado correctamente")
    router.push({ name: "Dashboard" })
  } catch (error) {
    console.error(error)
    alert("Error al guardar el ciclo")
  }
}
`;

txtC = txtC.replace(/async function guardarCiclo\(\) \{[\s\S]*?\}\s*<\/script>/, `${scriptC}\n</script>`);

fs.writeFileSync(cFile, txtC);

console.log('Fixed filters and Ciclo Celo!');
