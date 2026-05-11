<template>
  <div class="relative min-h-screen w-full">
    <div class="mx-auto max-w-2xl">

      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <button
          @click="router.push({ name: 'Dashboard' })"
          class="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
      </div>

      <h2 class="text-2xl font-bold tracking-tight text-deep-green md:text-3xl mb-6">
        Ciclo de Celo
      </h2>

      <div class="rounded-2xl border border-border-light bg-white p-6 shadow-sm">

        <form @submit.prevent="guardarCiclo" class="space-y-5">

          <!-- ID Bovino -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label class="flex flex-col">
              <p class="pb-1.5 text-sm font-semibold">ID Bovino</p>
              <input
                v-model="form.Id_bovino"
                type="number"
                required
                class="form-input w-full rounded-xl border-border-light bg-light-beige"
              />
            </label>
          </div>

          <!-- Fechas -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label class="flex flex-col">
              <p class="pb-1.5 text-sm font-semibold">Fecha Inicio</p>
              <input
                v-model="form.Fecha_inicio"
                type="date"
                required
                class="form-input w-full rounded-xl border-border-light bg-light-beige"
              />
            </label>

            <label class="flex flex-col">
              <p class="pb-1.5 text-sm font-semibold">Fecha Fin</p>
              <input
                v-model="form.Fecha_fin"
                type="date"
                required
                class="form-input w-full rounded-xl border-border-light bg-light-beige"
              />
            </label>
          </div>

          <!-- Duración -->
          <label class="flex flex-col">
            <p class="pb-1.5 text-sm font-semibold">Duración</p>
            <input
              v-model="form.duracion"
              type="text"
              class="form-input w-full rounded-xl border-border-light bg-light-beige"
            />
          </label>

          <!-- Observaciones -->
          <label class="flex flex-col">
            <p class="pb-1.5 text-sm font-semibold">Observación</p>
            <textarea
              v-model="form.observaciones"
              rows="4"
              class="form-textarea w-full rounded-xl border-border-light bg-light-beige"
            ></textarea>
          </label>

          <!-- Botón -->
          <button
            type="submit"
            class="w-full rounded-xl bg-secondary py-4 text-base font-bold text-white shadow-md transition-all hover:bg-opacity-95"
          >
            Guardar Ciclo
          </button>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()

const form = reactive({
  Id_bovino: "",
  Fecha_inicio: "",
  Fecha_fin: "",
  duracion: "",
  observaciones: ""
})

async function guardarCiclo() {
  try {
    await axios.post(
      "http://localhost:3000/api/ciclo/crear",
      { ...form }
    )

    alert("Ciclo registrado correctamente")

    router.push({ name: "Dashboard" })

  } catch (error) {
    console.error(error)
    alert("Error al guardar el ciclo")
  }
}
</script>