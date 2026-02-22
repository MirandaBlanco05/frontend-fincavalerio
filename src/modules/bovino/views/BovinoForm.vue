<template>
  <div class="relative min-h-screen w-full">
    <div class="mx-auto max-w-lg">

      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <button @click="router.push({ name: 'Bovinos' })" class="flex items-center gap-1 hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Volver al listado
        </button>
      </div>

      <!-- Alerta de error -->
      <div
        v-if="store.error"
        class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <span class="material-symbols-outlined text-base">warning</span>
        {{ store.error }}
      </div>

      <!-- Formulario -->
      <form id="form-animal" @submit.prevent="guardar" class="space-y-6">

        <!-- ID Grupo -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="id_grupo" class="block text-sm font-medium text-text-primary">ID Grupo <span class="text-red-500">*</span></label>
            <input
              id="id_grupo"
              v-model="form.Id_grupo"
              type="number"
              required
              placeholder="Ej: 1"
              class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <!-- Número Crotal -->
          <div>
            <label for="numero_crotal" class="block text-sm font-medium text-text-primary">N° Crotal</label>
            <input
              id="numero_crotal"
              v-model="form.numero_crotal"
              type="number"
              placeholder="Ej: 123"
              class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Raza / Nombre -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="Id_raza" class="block text-sm font-medium text-text-primary">ID Raza <span class="text-red-500">*</span></label>
            <input
              id="Id_raza"
              v-model="form.Id_raza"
              type="number"
              required
              placeholder="Ej: 2"
              class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label for="nombre" class="block text-sm font-medium text-text-primary">Nombre <span class="text-red-500">*</span></label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              placeholder="Nombre del animal"
              class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Fecha de Nacimiento -->
        <div>
          <label for="fecha_nacimiento" class="block text-sm font-medium text-text-primary">Fecha de Nacimiento <span class="text-red-500">*</span></label>
          <input
            id="fecha_nacimiento"
            v-model="form.fecha_nacimiento"
            type="date"
            required
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Nombre Madre -->
        <div>
          <label for="nombre_madre" class="block text-sm font-medium text-text-primary">Nombre Madre</label>
          <input
            id="nombre_madre"
            v-model="form.nombre_madre"
            type="text"
            placeholder="Nombre de la madre"
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Sexo -->
        <div>
          <label for="sexo" class="block text-sm font-medium text-text-primary">Sexo <span class="text-red-500">*</span></label>
          <select
            id="sexo"
            v-model="form.sexo"
            required
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Seleccione...</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <!-- Edad -->
        <div>
          <label for="edad" class="block text-sm font-medium text-text-primary">Edad (años)</label>
          <input
            id="edad"
            v-model="form.edad"
            type="number"
            min="0"
            placeholder="Ej: 3"
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Estado -->
        <div>
          <label for="estado" class="block text-sm font-medium text-text-primary">Estado <span class="text-red-500">*</span></label>
          <select
            id="estado"
            v-model="form.estado"
            required
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Seleccione...</option>
            <option value="Activo">Activo</option>
            <option value="Vendido">Vendido</option>
            <option value="Muerto">Muerto</option>
          </select>
        </div>

        <!-- Peso -->
        <div>
          <label for="peso" class="block text-sm font-medium text-text-primary">Peso (kg)</label>
          <input
            id="peso"
            v-model="form.peso"
            type="text"
            placeholder="Ej: 450"
            class="mt-1 block w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Botón guardar -->
        <button
          id="btnGuardar"
          type="submit"
          :disabled="store.cargando"
          class="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="store.cargando">Guardando...</span>
          <span v-else>{{ modoEdicion ? 'Actualizar Animal' : 'Guardar Animal' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBovinoStore } from '../store/bovino.store.js'

const router = useRouter()
const route  = useRoute()
const store  = useBovinoStore()

// ── Detectar modo (crear vs editar) ──────────────
const modoEdicion = computed(() => !!route.params.id)

// ── Formulario reactivo ───────────────────────────
const form = reactive({
  Id_grupo:         '',
  numero_crotal:    '',
  Id_raza:          '',
  nombre:           '',
  fecha_nacimiento: '',
  nombre_madre:     '',
  sexo:             '',
  edad:             '',
  estado:           '',
  peso:             ''
})

// ── Si es edición, cargar datos del bovino ────────
onMounted(async () => {
  if (modoEdicion.value) {
    // Si el store no tiene datos todavía, los cargamos
    if (store.bovinos.length === 0) {
      await store.cargarBovinos()
    }
    const bovino = store.bovinos.find(b => b.id_bovino == route.params.id)
    if (bovino) {
      form.Id_grupo         = bovino.Id_grupo
      form.numero_crotal    = bovino.numero_crotal
      form.Id_raza          = bovino.Id_raza
      form.nombre           = bovino.nombre
      form.fecha_nacimiento = bovino.fecha_nacimiento
      form.nombre_madre     = bovino.nombre_madre
      form.sexo             = bovino.sexo
      form.edad             = bovino.edad
      form.estado           = bovino.estado
      form.peso             = bovino.peso
    }
  }
  store.limpiarMensajes()
})

// ── Guardar ───────────────────────────────────────
async function guardar() {
  let ok
  if (modoEdicion.value) {
    ok = await store.actualizarBovino(route.params.id, { ...form })
  } else {
    ok = await store.crearBovino({ ...form })
  }
  if (ok) {
    router.push({ name: 'Bovinos' })
  }
}
</script>