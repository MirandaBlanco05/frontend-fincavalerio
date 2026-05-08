<template>
  <div class="relative min-h-screen w-full">
    <!-- Botones -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="router.push({ name: 'VeterinarioNuevo' })" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span>Nuevo</span>
      </button>
      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span>Editar</span>
      </button>
      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span>Eliminar</span>
      </button>
      <button @click="modalFiltros = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
        <span class="material-symbols-outlined text-base">filter_list</span>
        <span>Filtrar</span>
        <span v-if="filtrosActivos > 0" class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">{{ filtrosActivos }}</span>
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>{{ store.error }}
    </div>
    <div v-if="mensajeExito" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>{{ mensajeExito }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Cédula</th>
            <th class="px-6 py-4">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.cargando">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando...</p>
            </td>
          </tr>
          <tr v-else-if="veterinariosFiltrados.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">medical_services</span>
              <p class="mt-2">{{ store.veterinarios.length === 0 ? 'No hay veterinarios.' : 'No hay resultados con los filtros.' }}</p>
            </td>
          </tr>
          <tr v-else v-for="vet in veterinariosFiltrados" :key="vet.id_veterinario" @click="seleccionarFila(vet)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_veterinario === vet.id_veterinario }">
            <td class="px-6 py-3 font-bold">#{{ vet.id_veterinario }}</td>
            <td class="px-6 py-3 font-medium">{{ vet.nombre }}</td>
            <td class="px-6 py-3">{{ vet.cedula || '—' }}</td>
            <td class="px-6 py-3">{{ vet.telefono }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Veterinarios</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <input v-model="filtros.nombre" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Buscar por nombre" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Cédula</label>
              <input v-model="filtros.cedula" type="text" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="000-0000000-0" />
            </div>
          </div>
          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">Limpiar</button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90">Aplicar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVeterinarioStore } from '../store/veterinario.store.js'

const router = useRouter()
const store = useVeterinarioStore()
const filaSeleccionada = ref(null)
const mensajeExito = ref('')
const modalFiltros = ref(false)

const filtros = ref({ nombre: '', cedula: '' })
const filtrosAplicados = ref({ nombre: '', cedula: '' })

const filtrosActivos = computed(() => {
  let count = 0
  if (filtrosAplicados.value.nombre) count++
  if (filtrosAplicados.value.cedula) count++
  return count
})

const veterinariosFiltrados = computed(() => {
  if (!store.veterinarios) return []
  return store.veterinarios.filter(vet => {
    const { nombre, cedula } = filtrosAplicados.value
    if (nombre && !vet.nombre.toLowerCase().includes(nombre.toLowerCase())) return false
    if (cedula && !vet.cedula?.includes(cedula)) return false
    return true
  })
})

function seleccionarFila(vet) {
  filaSeleccionada.value = filaSeleccionada.value?.id_veterinario === vet.id_veterinario ? null : vet
  mensajeExito.value = ''
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'VeterinarioEditar', params: { id: filaSeleccionada.value.id_veterinario } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm('¿Eliminar este veterinario?')) {
    const ok = await store.eliminarVeterinario(filaSeleccionada.value.id_veterinario)
    if (ok) {
      mensajeExito.value = 'Veterinario eliminado'
      filaSeleccionada.value = null
      setTimeout(() => mensajeExito.value = '', 3000)
    }
  }
}

function aplicarFiltros() {
  filtrosAplicados.value = { ...filtros.value }
  modalFiltros.value = false
}

function limpiarFiltros() {
  filtros.value = { nombre: '', cedula: '' }
  filtrosAplicados.value = { nombre: '', cedula: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

onMounted(() => store.cargarVeterinarios())
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>