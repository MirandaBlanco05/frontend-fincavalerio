<template>

<main class="flex-1 p-6 md:p-12 bg-background-subtle">

<div class="max-w-4xl mx-auto">

<div class="mb-10 text-center md:text-left">

<h2 class="text-3xl font-extrabold text-secondary tracking-tight mb-2">
Registro de Inseminación
</h2>

<p class="text-slate-400 font-medium text-sm max-w-lg">
Complete con precisión los detalles técnicos.
</p>

</div>

<div class="bg-white rounded-[2rem] p-8 md:p-12 shadow border">

<form
@submit.prevent="guardar"
class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7"
>

<!-- ID -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">ID Inseminación</label>

<input
v-model="form.id_inseminacion"
class="input-refined"
placeholder="INS-2024-001"
/>

</div>

<!-- Veterinario -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">ID Veterinaro</label>

<input
v-model="form.id_veterinaro"
type="number"
required
class="input-refined"
placeholder="Código veterinario"
/>

</div>

<!-- Ciclo -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">ID Ciclo</label>

<input
v-model="form.id_ciclo"
type="number"
required
class="input-refined"
/>

</div>

<!-- Fecha -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">Fecha</label>

<input
v-model="form.fecha"
type="date"
required
class="input-refined"
/>

</div>

<!-- Tipo -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">Tipo Inseminación</label>

<select
v-model="form.tipo"
required
class="input-refined"
>

<option value="">Seleccione</option>
<option value="Artificial">Artificial</option>
<option value="Monta natural">Monta Natural</option>
<option value="Asistida">Asistida</option>

</select>

</div>

<!-- Resultado -->

<div class="flex flex-col gap-2">
<label class="text-xs font-bold">Estatus</label>

<select
v-model="form.resultado"
required
class="input-refined"
>

<option value="Pendiente">Pendiente</option>
<option value="Efectiva">Efectiva</option>
<option value="Inefectiva">Inefectiva</option>

</select>

</div>

<!-- BOTON -->

<div class="md:col-span-2 mt-6">

<button
type="submit"
class="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3"
>

<span class="material-symbols-outlined">
save
</span>

Guardar Inseminación

</button>

</div>

</form>

</div>

</div>

</main>

</template>

<script setup>

import { reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()

const form = reactive({

id_inseminacion: "",
id_veterinaro: "",
id_ciclo: "",
fecha: "",
tipo: "",
resultado: "Pendiente"

})

async function guardar(){

try {
  const payload = {
    Id_veterinaro: form.id_veterinaro,
    Id_ciclo: form.id_ciclo,
    fecha: form.fecha,
    Tipo_inseminacion: form.tipo,
    resultado: form.resultado
  }

  await axios.post("http://localhost:3000/api/inseminacion/crear", payload)

  alert("Inseminación guardada correctamente")
  router.push("/inseminaciones")

} catch (error) {
  console.error("Error guardando inseminación", error)
  const backendError = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido en el servidor"
  alert(`Ocurrió un error al guardar la inseminación: ${backendError}`)
}

}

</script>