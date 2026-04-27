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
placeholder="Buscar registro, veterinario o ciclo..."
type="text"
/>

</div>

<RouterLink
to="/inseminaciones/nuevo"
class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
>
<span class="material-symbols-outlined">add_circle</span>
<span>Nueva Inseminación</span>
</RouterLink>

</div>

<!-- Table -->
<div class="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">

<div class="overflow-x-auto">

<table class="w-full text-left border-collapse">

<thead>

<tr class="bg-gray-50">

<th class="px-6 py-4 text-xs font-bold">ID</th>
<th class="px-6 py-4 text-xs font-bold">Veterinario</th>
<th class="px-6 py-4 text-xs font-bold">Ciclo</th>
<th class="px-6 py-4 text-xs font-bold">Tipo</th>
<th class="px-6 py-4 text-xs font-bold">Resultado</th>
<th class="px-6 py-4 text-xs font-bold">Fecha</th>

</tr>

</thead>

<tbody>

<tr
v-for="i in inseminacionesFiltradas"
:key="i.Id_inseminacion"
class="hover:bg-primary/5"
>

<td class="px-6 py-5 font-bold">
{{ i.Id_inseminacion }}
</td>

<td class="px-6 py-5">
{{ i.veterinario ? i.veterinario.nombre : 'N/A' }}
</td>

<td class="px-6 py-5">
{{ i.ciclo ? i.ciclo.Id_ciclo : 'N/A' }}
</td>

<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
{{ i.Tipo_inseminacion }}
</span>
</td>

<td class="px-6 py-5">

<span
class="px-3 py-1 rounded-full text-xs font-bold"
:class="estadoColor(i.resultado)"
>

{{ i.resultado }}

</span>

</td>

<td class="px-6 py-5">
{{ i.fecha }}
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
import axios from "axios"

const search = ref("")
const inseminaciones = ref([])

const inseminacionesFiltradas = computed(() => {
  if (!search.value) return inseminaciones.value
  const query = search.value.toLowerCase()
  return inseminaciones.value.filter(i => 
    i.veterinario?.nombre?.toLowerCase().includes(query) ||
    i.ciclo?.Id_ciclo?.toString().includes(query) ||
    i.Id_inseminacion?.toString().includes(query) ||
    i.Tipo_inseminacion?.toLowerCase().includes(query) ||
    i.resultado?.toLowerCase().includes(query)
  )
})

function estadoColor(estado){

if(estado === "Efectiva")
return "bg-green-100 text-green-700"

if(estado === "Pendiente")
return "bg-yellow-100 text-yellow-700"

if(estado === "Inefectiva")
return "bg-red-100 text-red-700"

}

onMounted(async()=>{

try {
  const res = await axios.get("http://localhost:3000/api/inseminacion/listar")
  inseminaciones.value = res.data
} catch(error) {
  console.error("Error cargando inseminaciones", error)
}

})

</script>