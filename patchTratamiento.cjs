const fs = require('fs');
const file = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/tratamientos/views/TratamientoIndex.vue';
let txt = fs.readFileSync(file, 'utf8');

// Add Enfermedad column header
txt = txt.replace(
  '<tr><th class="px-6 py-4">ID</th><th class="px-6 py-4">Nombre</th><th class="px-6 py-4">Tipo</th><th class="px-6 py-4">Inicio</th><th class="px-6 py-4">Fin</th></tr>',
  '<tr><th class="px-6 py-4">ID</th><th class="px-6 py-4">Nombre</th><th class="px-6 py-4">Enfermedad</th><th class="px-6 py-4">Tipo</th><th class="px-6 py-4">Inicio</th><th class="px-6 py-4">Fin</th></tr>'
);

// Add Enfermedad column data
txt = txt.replace(
  '<td class="px-6 py-3 font-medium">{{ t.nombre }}</td>',
  '<td class="px-6 py-3 font-medium">{{ t.nombre }}</td>\n            <td class="px-6 py-3">{{ t.enfermedad || \'—\' }}</td>'
);

// Fix colspans
txt = txt.replace(/colspan="5"/g, 'colspan="6"');

fs.writeFileSync(file, txt);
console.log('Fixed TratamientoIndex!');
