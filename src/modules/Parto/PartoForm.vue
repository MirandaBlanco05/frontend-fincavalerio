<template>

<div class="p-8">

<!-- Action Bar -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40">
search
</span>

<input
v-model="search"
class="w-full pl-10 pr-4 py-3 bg-white border-primary/10 rounded-xl focus:ring-primary focus:border-primary shadow-sm text-sm"
placeholder="Buscar registro de parto por embarazo, observaciones..."
type="text"
/>

</div>

<RouterLink
to="/partos/nuevo"
class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
>
<span class="material-symbols-outlined">add_circle</span>
<span>Nuevo Parto</span>
</RouterLink>

</div>

<!-- Table -->
<div class="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">

<div class="overflow-x-auto">

<table class="w-full text-left border-collapse">

<thead>

<tr class="bg-gray-50">

<th class="px-6 py-4 text-xs font-bold">ID Parto</th>
<th class="px-6 py-4 text-xs font-bold">ID Embarazo</th>
<th class="px-6 py-4 text-xs font-bold">Fecha del Parto</th>
<th class="px-6 py-4 text-xs font-bold">Crías</th>
<th class="px-6 py-4 text-xs font-bold">Observaciones</th>

</tr>

</thead>

<tbody>

<tr
v-for="p in partosFiltrados"
:key="p.Id_parto"
class="hover:bg-primary/5"
>

<td class="px-6 py-5 font-bold">
{{ p.Id_parto }}
</td>

<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
{{ p.EMBARAZO ? p.EMBARAZO.Id_embarazo : p.Id_embarazo }}
</span>
</td>

<td class="px-6 py-5 font-semibold">
{{ p.Fecha_parto }}
</td>

<td class="px-6 py-5">
{{ p.Numero_crias || '0' }}
</td>

<td class="px-6 py-5">
{{ p.observaciones || 'Ninguna' }}
</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

</template>

<script setup>

import { ref, computed, onMounted } from "vue"
import { usePartoStore } from "./store/Parto.store.js"

const search = ref("")
const store = usePartoStore()

const partosFiltrados = computed(() => {
  if (!search.value) return store.partos
  const query = search.value.toLowerCase()
  return store.partos.filter(p => 
    p.Id_parto?.toString().includes(query) ||
    p.Id_embarazo?.toString().includes(query) ||
    p.observaciones?.toLowerCase().includes(query)
  )
})

onMounted(() => {
  store.cargarPartos()
})

</script>