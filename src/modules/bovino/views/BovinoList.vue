<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <!-- Nuevo Animal -->
      <button
        @click="irAFormulario"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Animal</span>
      </button>

      <!-- Editar (activo solo si hay fila seleccionada) -->
      <button
        @click="irAEditar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <!-- Eliminar (activo solo si hay fila seleccionada) -->
      <button
        @click="confirmarEliminar"
        :disabled="!filaSeleccionada"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <!-- Filtrar -->
      <button
        @click="modalFiltros = true"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none"
      >
        <span class="material-symbols-outlined text-base">filter_list</span>
        <span class="truncate">Filtrar</span>
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

    <!-- Alerta de éxito -->
    <div
      v-if="store.mensaje"
      class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <!-- Encabezado -->
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Grupo</th>
            <th class="px-6 py-4">N° Crotal</th>
            <th class="px-6 py-4">Raza</th>
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">F. Nacimiento</th>
            <th class="px-6 py-4">Madre</th>
            <th class="px-6 py-4">Sexo</th>
            <th class="px-6 py-4">Edad</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4">Peso</th>
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody>
          <!-- Cargando -->
          <tr v-if="store.cargando">
            <td colspan="11" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando animales...</p>
            </td>
          </tr>

          <!-- Sin datos -->
          <tr v-else-if="bovinosFiltrados.length === 0">
            <td colspan="11" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">No hay animales registrados.</p>
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-else
            v-for="b in bovinosFiltrados"
            :key="b.id_bovino"
            @click="seleccionarFila(b)"
            class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10"
            :class="{ 'bg-primary/20': filaSeleccionada?.id_bovino === b.id_bovino }"
          >
            <td class="px-6 py-3">{{ b.id_bovino }}</td>
            <td class="px-6 py-3">{{ b.Id_grupo }}</td>
            <td class="px-6 py-3">{{ b.numero_crotal ?? '—' }}</td>
            <td class="px-6 py-3">{{ b.Id_raza }}</td>
            <td class="px-6 py-3 font-medium">{{ b.nombre }}</td>
            <td class="px-6 py-3">{{ b.fecha_nacimiento }}</td>
            <td class="px-6 py-3">{{ b.nombre_madre ?? '—' }}</td>
            <td class="px-6 py-3">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                :class="b.sexo === 'Macho' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'"
              >
                {{ b.sexo }}
              </span>
            </td>
            <td class="px-6 py-3">{{ b.edad ?? '—' }}</td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                {{ b.estado }}
              </span>
            </td>
            <td class="px-6 py-3">{{ b.peso ? b.peso + ' kg' : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ───────────────────────────────────────────── -->
    <!-- Modal de Filtros (BottomSheet style)          -->
    <!-- ───────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="modalFiltros"
        class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center"
        @click.self="modalFiltros = false"
      >
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">

          <!-- Handle mobile -->
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between p-4">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Animales</h3>
            <button
              @click="modalFiltros = false"
              class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <!-- Campos -->
          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Edad</label>
              <select v-model="filtros.edad" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Todas</option>
                <option value="menos1">Menos de 1 año</option>
                <option value="1a3">1–3 años</option>
                <option value="mas3">Más de 3 años</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Sexo</label>
              <select v-model="filtros.sexo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Estado</label>
              <select v-model="filtros.estado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Vendido">Vendido</option>
                <option value="Muerto">Muerto</option>
              </select>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 p-4">
            <button
              @click="limpiarFiltros"
              class="flex-1 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30"
            >
              Limpiar
            </button>
            <button
              @click="aplicarFiltros"
              class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBovinoStore } from '../store/bovino.store.js'

const router = useRouter()
const store  = useBovinoStore()

// ── Cargar al montar ──────────────────────────────
onMounted(() => store.cargarBovinos())

// ── Selección de fila ─────────────────────────────
const filaSeleccionada = ref(null)

function seleccionarFila(bovino) {
  if (filaSeleccionada.value?.id_bovino === bovino.id_bovino) {
    filaSeleccionada.value = null   // deseleccionar al hacer clic de nuevo
  } else {
    filaSeleccionada.value = bovino
    store.limpiarMensajes()
  }
}

// ── Navegación ────────────────────────────────────
function irAFormulario() {
  router.push({ name: 'BovinoNuevo' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'BovinoEditar', params: { id: filaSeleccionada.value.id_bovino } })
}

// ── Eliminar ──────────────────────────────────────
async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  const nombre = filaSeleccionada.value.nombre
  if (confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) {
    await store.eliminarBovino(filaSeleccionada.value.id_bovino)
    filaSeleccionada.value = null
  }
}

// ── Filtros ───────────────────────────────────────
const modalFiltros = ref(false)
const filtros = ref({ edad: '', sexo: '', estado: '' })
const filtrosAplicados = ref({ edad: '', sexo: '', estado: '' })

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { edad: '', sexo: '', estado: '' }
  filtrosAplicados.value = { edad: '', sexo: '', estado: '' }
  modalFiltros.value = false
}

const bovinosFiltrados = computed(() => {
  return store.bovinos.filter(b => {
    const { edad, sexo, estado } = filtrosAplicados.value

    let okEdad = true
    if (edad === 'menos1') okEdad = Number(b.edad) < 1
    if (edad === '1a3')    okEdad = Number(b.edad) >= 1 && Number(b.edad) <= 3
    if (edad === 'mas3')   okEdad = Number(b.edad) > 3

    const okSexo   = !sexo   || b.sexo   === sexo
    const okEstado = !estado || b.estado === estado

    return okEdad && okSexo && okEstado
  })
})
</script>