const fs = require('fs');
const file = 'C:/Users/User/Desktop/frontend-fincavalerio/src/modules/venta/views/VentaForm.vue';
let txt = fs.readFileSync(file, 'utf8');
txt = txt.replace("import { watch } from 'vue'", "");
fs.writeFileSync(file, txt);
