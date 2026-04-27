<template>

<main class="flex-1 p-6 md:p-12 bg-background-subtle">

<div class="max-w-4xl mx-auto">

<div class="mb-10 text-center md:text-left flex justify-between items-center">
  <div>
    <h2 class="text-3xl font-extrabold text-secondary tracking-tight mb-2">
      Registrar Nuevo Parto
    </h2>
    <p class="text-slate-400 font-medium text-sm max-w-lg">
      Complete con precisión los detalles del parto y el número de crías.
    </p>
  </div>
  <button @click="cancelar" class="text-slate-500 hover:text-slate-700 font-semibold px-4 py-2 border border-slate-300 rounded-lg bg-white shadow-sm transition-colors">
    Volver
  </button>
</div>

<div class="bg-white rounded-[2rem] p-8 md:p-12 shadow border">

<form @submit.prevent="guardarParto" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">

  <!-- ID Embarazo -->
  <div class="flex flex-col gap-2 md:col-span-2">
    <label class="text-xs font-bold">ID Embarazo</label>
    <select v-model="parto.Id_embarazo" required class="input-refined">
      <option value="">Seleccione Embarazo Foco...</option>
      <option v-for="emb in embarazos" :key="emb.Id_embarazo" :value="emb.Id_embarazo">
        Embarazo ID: {{ emb.Id_embarazo }} | Fase: {{ emb.fase || 'N/A' }}
      </option>
    </select>
  </div>

  <!-- Fecha Parto -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold">Fecha del Parto</label>
    <input
      type="date"
      v-model="parto.Fecha_parto"
      required
      class="input-refined"
    />
  </div>

  <!-- Número de Crías -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold">Número de Crías</label>
    <input
      type="number"
      v-model="parto.Numero_crias"
      min="1"
      max="5"
      placeholder="1"
      class="input-refined"
    />
  </div>

  <!-- Observaciones -->
  <div class="flex flex-col gap-2 md:col-span-2">
    <label class="text-xs font-bold">Observaciones Generales</label>
    <textarea
      v-model="parto.observaciones"
      rows="3"
      class="input-refined"
      placeholder="Indique estado de la cría, complicaciones, etc..."
    ></textarea>
  </div>

  <!-- BOTON GUARDAR -->
  <div class="md:col-span-2 mt-6">
    <button
      type="submit"
      class="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
    >
      <span class="material-symbols-outlined">save</span>
      Guardar Parto
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
import { usePartoStore } from "./store/Parto.store.js"
import embarazoService from "../Embarazo/services/Embarazo.Service.js"

const router = useRouter()
const store = usePartoStore()
const embarazos = ref([])

const parto = reactive({
  Id_embarazo: "",
  Fecha_parto: "",
  Numero_crias: 1,
  observaciones: ""
})

onMounted(async () => {
  try {
    embarazos.value = await embarazoService.listar()
  } catch (error) {
    console.error("Error cargando embarazos", error)
  }
})

async function guardarParto() {
  try {
    const payload = {
      Id_embarazo: parto.Id_embarazo,
      Fecha_parto: parto.Fecha_parto,
      Numero_crias: parto.Numero_crias || null,
      observaciones: parto.observaciones || null
    }

    await store.crearParto(payload)

    alert("Parto guardado correctamente")
    router.push("/partos")

  } catch (error) {
    console.error("Error guardando parto", error)
    const backendError = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
    alert(`Ocurrió un error: ${backendError}`)
  }
}

function cancelar() {
  router.push("/partos")
}

</script>