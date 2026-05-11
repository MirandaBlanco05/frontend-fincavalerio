const fs = require('fs');
const cForm = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/compra/views/CompraForm.vue';
let txt = fs.readFileSync(cForm, 'utf8');

txt = txt.replace(/insumosDisponibles\.value = insRes \|\| \[\]/, `itemsDisponibles.value = (insRes || []).map(i => ({
      id_item: i.id_insumo,
      tipo: i.tipo_insumo,
      descripcion: i.nombre,
      precio: parseFloat(i.precio) || 0
    }))`);

fs.writeFileSync(cForm, txt);
console.log('Fixed itemsDisponibles mapping!');
