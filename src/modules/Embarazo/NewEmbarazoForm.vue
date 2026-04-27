<template>

<main class="flex-1 p-6 md:p-12 bg-background-subtle">

<div class="max-w-4xl mx-auto">

<div class="mb-10 text-center md:text-left">

<h2 class="text-3xl font-extrabold text-secondary tracking-tight mb-2">
Registro de Embarazo
</h2>

<p class="text-slate-400 font-medium text-sm max-w-lg">
Complete con precisión los detalles del nuevo embarazo.
</p>

</div>

<div class="bg-white rounded-[2rem] p-8 md:p-12 shadow border">

<form
@submit.prevent="guardar"
class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7"
>

<!-- ID Inseminación -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">ID Inseminación</label>

<select
v-model="form.Id_inseminacion"
required
class="input-refined"
>
  <option value="">Seleccione Inseminación</option>
  <option v-for="ins in inseminaciones" :key="ins.Id_inseminacion" :value="ins.Id_inseminacion">
    ID: {{ ins.Id_inseminacion }} - Vaca: {{ ins.ciclo?.bovino?.nombre || 'N/A' }}
  </option>
</select>

</div>

<!-- ID Veterinario -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">ID Veterinario</label>

<select
v-model="form.Id_veterinario"
required
class="input-refined"
>
  <option value="">Seleccione Veterinario</option>
  <option v-for="vet in veterinarios" :key="vet.Id_veterinario" :value="vet.Id_veterinario">
    {{ vet.nombre }}
  </option>
</select>

</div>

<!-- Fase -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">Fase (Opcional)</label>

<select
v-model="form.fase"
class="input-refined"
>

<option value="">Seleccione</option>
<option value="Primer Tercio">Primer Tercio</option>
<option value="Segundo Tercio">Segundo Tercio</option>
<option value="Último Tercio">Último Tercio</option>

</select>

</div>

<!-- Fecha Secado -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">Fecha Secado (Opcional)</label>

<input
v-model="form.Fecha_secado"
type="date"
class="input-refined"
/>

</div>

<!-- Fecha Prevista Parto -->

<div class="flex flex-col md:col-span-2 gap-2">
<label class="text-xs font-bold">Fecha Prevista Parto</label>

<input
v-model="form.Fecha_prevista_parto"
type="date"
required
class="input-refined"
/>

</div>

<!-- BOTON -->

<div class="md:col-span-2 mt-6">

<button
type="submit"
class="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
>

<span class="material-symbols-outlined">
save
</span>

Guardar Embarazo

</button>

</div>

</form>

</div>

</div>

</main>

</template>

<script setup>

import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "@/core/api/axios.js"
import { useEmbarazoStore } from "./store/Embarazo.store.js"

const router = useRouter()
const store = useEmbarazoStore()

const veterinarios = ref([])
const inseminaciones = ref([])

const form = reactive({
Id_inseminacion: "",
Id_veterinario: "",
fase: "",
Fecha_secado: "",
Fecha_prevista_parto: ""
})

onMounted(async () => {
  try {
    const [resVet, resIns] = await Promise.all([
      api.get("/visita/veterinarios"),
      api.get("/inseminacion/listar")
    ])
    veterinarios.value = resVet.data
    inseminaciones.value = resIns.data
  } catch (error) {
    console.error("Error cargando datos para el formulario", error)
  }
})

async function guardar(){

try {
  const payload = {
    Id_inseminacion: form.Id_inseminacion,
    Id_veterinario: form.Id_veterinario,
    fase: form.fase || null,
    Fecha_secado: form.Fecha_secado || null,
    Fecha_prevista_parto: form.Fecha_prevista_parto
  }

  await store.crearEmbarazo(payload)

  alert("Embarazo guardado correctamente")
  router.push("/embarazos")

} catch (error) {
  console.error("Error guardando embarazo", error)
  const backendError = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido en el servidor"
  alert(`Ocurrió un error al guardar el embarazo: ${backendError}`)
}

}

</script>
