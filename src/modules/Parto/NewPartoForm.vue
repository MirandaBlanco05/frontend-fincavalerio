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
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">ID Embarazo</label>
    <select v-model="parto.id_embarazo" required class="input-refined">
      <option value="">Seleccione Embarazo Foco...</option>
      <option v-for="emb in embarazos" :key="emb.id_embarazo" :value="emb.id_embarazo">
        Embarazo ID: {{ emb.id_embarazo }} | Fase: {{ emb.fase || 'N/A' }}
      </option>
    </select>
  </div>

  <!-- Fecha Parto -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Fecha del Parto</label>
    <input
      type="date"
      v-model="parto.fecha_parto"
      required
      class="input-refined"
    />
  </div>

  <!-- Número de Crías -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Número de Crías</label>
    <input
      type="number"
      v-model="parto.numero_crias"
      min="1"
      max="5"
      placeholder="1"
      class="input-refined"
    />
  </div>

  <!-- Tipo de Parto -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Parto</label>
    <select v-model="parto.tipo_parto" class="input-refined">
      <option value="">Seleccione...</option>
      <option value="Normal">Normal</option>
      <option value="Distócico">Distócico (Complicado)</option>
      <option value="Cesárea">Cesárea</option>
    </select>
  </div>

  <!-- Sexo de la Cría -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Sexo de la Cría</label>
    <select v-model="parto.sexo_cria" class="input-refined">
      <option value="">Seleccione...</option>
      <option value="Hembra">Hembra</option>
      <option value="Macho">Macho</option>
      <option value="Múltiple">Múltiple</option>
    </select>
  </div>

  <!-- Peso de la Cría -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Peso Cría (kg)</label>
    <input
      type="number"
      step="0.1"
      v-model="parto.peso_cria"
      placeholder="Ej: 35.5"
      class="input-refined"
    />
  </div>

  <!-- Estado de la Cría -->
  <div class="flex flex-col gap-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Estado de la Cría</label>
    <select v-model="parto.estado_cria" class="input-refined">
      <option value="">Seleccione...</option>
      <option value="Vivo">Vivo</option>
      <option value="Muerto">Muerto</option>
      <option value="Débil">Débil</option>
    </select>
  </div>

  <!-- Observaciones -->
  <div class="flex flex-col gap-2 md:col-span-2">
    <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Observaciones Generales</label>
    <textarea
      v-model="parto.observaciones"
      rows="3"
      class="input-refined"
      placeholder="Indique complicaciones, cuidados especiales, etc..."
    ></textarea>
  </div>

  <!-- BOTON GUARDAR -->
  <div class="md:col-span-2 mt-6">
    <button
      type="submit"
      class="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors shadow-lg"
    >
      <span class="material-symbols-outlined">save</span>
      Guardar Registro de Parto
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
  id_embarazo: "",
  fecha_parto: "",
  numero_crias: 1,
  tipo_parto: "",
  sexo_cria: "",
  peso_cria: "",
  estado_cria: "",
  observaciones: ""
})

onMounted(async () => {
  try {
    const res = await embarazoService.listar()
    // Asegurar que usamos minúsculas si el backend las devuelve así
    embarazos.value = res.data || res
  } catch (error) {
    console.error("Error cargando embarazos", error)
  }
})

async function guardarParto() {
  try {
    const payload = { ...parto }
    // Convertir peso a número si existe
    if (payload.peso_cria) payload.peso_cria = parseFloat(payload.peso_cria)

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