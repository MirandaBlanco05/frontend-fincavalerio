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
placeholder="Buscar registro de embarazo, veterinario o inseminación..."
type="text"
/>

</div>

<RouterLink
to="/embarazos/nuevo"
class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
>
<span class="material-symbols-outlined">add_circle</span>
<span>Nuevo Embarazo</span>
</RouterLink>

</div>

<!-- Table -->
<div class="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">

<div class="overflow-x-auto">

<table class="w-full text-left border-collapse">

<thead>

<tr class="bg-gray-50">

<th class="px-6 py-4 text-xs font-bold">ID</th>
<th class="px-6 py-4 text-xs font-bold">Inseminación</th>
<th class="px-6 py-4 text-xs font-bold">Veterinario</th>
<th class="px-6 py-4 text-xs font-bold">Fase</th>
<th class="px-6 py-4 text-xs font-bold">Fecha Secado</th>
<th class="px-6 py-4 text-xs font-bold">Fecha Parto (Prevista)</th>

</tr>

</thead>

<tbody>

<tr
v-for="e in embarazosFiltrados"
:key="e.Id_embarazo"
class="hover:bg-primary/5"
>

<td class="px-6 py-5 font-bold">
{{ e.Id_embarazo }}
</td>

<td class="px-6 py-5">
{{ e.INSEMINACION ? e.INSEMINACION.Id_inseminacion : e.Id_inseminacion }}
</td>

<td class="px-6 py-5">
{{ e.VETERINARIO ? e.VETERINARIO.nombre : (e.veterinario ? e.veterinario.nombre : 'N/A') }}
</td>

<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
{{ e.fase || 'N/A' }}
</span>
</td>

<td class="px-6 py-5">
{{ e.Fecha_secado || 'N/A' }}
</td>

<td class="px-6 py-5 font-semibold">
{{ e.Fecha_prevista_parto }}
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
import { useEmbarazoStore } from "./store/Embarazo.store.js"

const search = ref("")
const store = useEmbarazoStore()

const embarazosFiltrados = computed(() => {
  if (!search.value) return store.embarazos
  const query = search.value.toLowerCase()
  return store.embarazos.filter(e => 
    e.VETERINARIO?.nombre?.toLowerCase().includes(query) ||
    e.INSEMINACION?.Id_inseminacion?.toString().includes(query) ||
    e.Id_embarazo?.toString().includes(query) ||
    e.fase?.toLowerCase().includes(query)
  )
})

onMounted(() => {
  store.cargarEmbarazos()
})

</script>
