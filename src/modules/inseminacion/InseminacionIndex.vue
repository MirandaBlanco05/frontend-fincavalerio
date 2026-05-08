<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="irAFormulario" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nueva Inseminación</span>
      </button>

      <button @click="irAEditar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>

      <button @click="modalFiltros = true" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-secondary/30 sm:flex-none">
        <span class="material-symbols-outlined text-base">filter_list</span>
        <span class="truncate">Filtrar</span>
        <span v-if="filtrosActivos > 0" class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">{{ filtrosActivos }}</span>
      </button>
    </div>

    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>
    <div v-if="mensajeExito" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ mensajeExito }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Ciclo</th>
            <th class="px-6 py-4">Fecha</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Veterinario</th>
            <th class="px-6 py-4">Resultado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando inseminaciones...</p>
            </td>
          </tr>

          <tr v-else-if="inseminacionesFiltradas.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">search_off</span>
              <p class="mt-2">{{ store.inseminaciones?.length === 0 ? 'No hay inseminaciones registradas.' : 'No hay resultados con los filtros aplicados.' }}</p>
            </td>
          </tr>

          <tr v-else v-for="ins in inseminacionesFiltradas" :key="ins.id_inseminacion" @click="seleccionarFila(ins)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.id_inseminacion === ins.id_inseminacion }">
            <td class="px-6 py-3 font-bold">#{{ ins.id_inseminacion }}</td>
            <td class="px-6 py-3">Ciclo #{{ ins.ciclo?.id_ciclo || ins.id_ciclo || '—' }}</td>
            <td class="px-6 py-3 font-medium">{{ formatearFecha(ins.fecha) }}</td>
            <td class="px-6 py-3">{{ ins.tipo_inseminacion || ins.Tipo_inseminacion || '—' }}</td>
            <td class="px-6 py-3">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px] text-gray-400">medical_services</span>
                <span>{{ ins.veterinario?.nombre || getNombreVeterinario(ins.id_veterinario || ins.Id_veterinario) || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-bold" :class="ins.resultado === 'Efectiva' ? 'bg-green-100 text-green-700' : (ins.resultado === 'Inefectiva' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')">
                {{ ins.resultado || 'Pendiente' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Filtros -->
    <Teleport to="body">
      <div v-if="modalFiltros" class="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center" @click.self="cerrarFiltros">
        <div class="flex w-full flex-col rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
          <div class="flex h-5 w-full items-center justify-center pt-5 sm:hidden">
            <div class="h-1 w-9 rounded-full bg-gray-300"></div>
          </div>

          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-text-primary">Filtrar Inseminaciones</h3>
            <button @click="cerrarFiltros" class="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Tipo de Inseminación</label>
              <select v-model="filtros.tipo" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="Artificial">Artificial</option>
                <option value="Monta natural">Monta Natural</option>
                <option value="Asistida">Asistida</option>
              </select>
            </div>
            
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Resultado</label>
              <select v-model="filtros.resultado" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Efectiva">Efectiva</option>
                <option value="Inefectiva">Inefectiva</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
              <input v-model="filtros.fechaDesde" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
              <input v-model="filtros.fechaHasta" type="date" class="w-full rounded-lg border border-border-color px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div class="flex gap-3 p-4 border-t border-gray-200">
            <button @click="limpiarFiltros" class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
              Limpiar
            </button>
            <button @click="aplicarFiltros" class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
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
import { useInseminacionStore } from './store/Inseminacion.store.js'
import { useVeterinarioStore } from '../veterinario/store/veterinario.store.js'

const router = useRouter()
const store = useInseminacionStore()
const vetStore = useVeterinarioStore()

const filaSeleccionada = ref(null)
const modalFiltros = ref(false)
const mensajeExito = ref('')

const filtros = ref({ tipo: '', resultado: '', fechaDesde: '', fechaHasta: '' })
const filtrosAplicados = ref({ tipo: '', resultado: '', fechaDesde: '', fechaHasta: '' })

const filtrosActivos = computed(() => {
  let c = 0
  if (filtrosAplicados.value.tipo) c++
  if (filtrosAplicados.value.resultado) c++
  if (filtrosAplicados.value.fechaDesde) c++
  if (filtrosAplicados.value.fechaHasta) c++
  return c
})

onMounted(async () => {
  await Promise.all([
    store.cargarInseminaciones(),
    vetStore.cargarVeterinarios()
  ])
})

function getNombreVeterinario(id) {
  if (!id) return ''
  const vet = vetStore.veterinarios.find(v => v.id_veterinario == id)
  return vet ? vet.nombre : ''
}

function seleccionarFila(ins) {
  if (filaSeleccionada.value?.id_inseminacion === ins.id_inseminacion) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = ins
    mensajeExito.value = ''
  }
}

function irAFormulario() {
  router.push({ name: 'InseminacionNueva' })
}

function irAEditar() {
  if (!filaSeleccionada.value) return
  router.push({ name: 'InseminacionEditar', params: { id: filaSeleccionada.value.id_inseminacion } })
}

async function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  if (confirm(`¿Eliminar la inseminación #${filaSeleccionada.value.id_inseminacion}? Esta acción no se puede deshacer.`)) {
    const ok = await store.eliminarInseminacion(filaSeleccionada.value.id_inseminacion)
    if (ok) {
      mensajeExito.value = 'Inseminación eliminada exitosamente'
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
  filtros.value = { tipo: '', resultado: '', fechaDesde: '', fechaHasta: '' }
  filtrosAplicados.value = { tipo: '', resultado: '', fechaDesde: '', fechaHasta: '' }
  modalFiltros.value = false
}

function cerrarFiltros() {
  modalFiltros.value = false
}

const inseminacionesFiltradas = computed(() => {
  if (!store.inseminaciones) return []
  return store.inseminaciones.filter(ins => {
    const { tipo, resultado, fechaDesde, fechaHasta } = filtrosAplicados.value
    
    const tipoIns = ins.Tipo_inseminacion || ins.tipo_inseminacion
    const okTipo = !tipo || (tipoIns === tipo)
    
    const resIns = ins.resultado || 'Pendiente'
    const okResultado = !resultado || (resIns === resultado)
    
    const okFechaDesde = !fechaDesde || (ins.fecha && new Date(ins.fecha) >= new Date(fechaDesde))
    const okFechaHasta = !fechaHasta || (ins.fecha && new Date(ins.fecha) <= new Date(fechaHasta))

    return okTipo && okResultado && okFechaDesde && okFechaHasta
  })
})

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-DO')
}
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>