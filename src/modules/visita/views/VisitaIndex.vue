<template>
  <div class="flex flex-col gap-6">

    <!-- Header de página -->
    <div>
      <h2 class="text-2xl font-bold text-[#0d1b0d]">Agenda de Veterinario</h2>
      <p class="text-sm text-[#757575]">Gestiona las citas y chequeos.</p>
    </div>

    <!-- Alertas -->
    <div v-if="store.error"
      class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <!-- Grid: Calendario | Citas -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <!-- ── Calendario ─────────────────────────────── -->
      <div class="lg:col-span-2">
        <div class="rounded-xl bg-white p-4 shadow-sm border border-gray-200">

          <!-- Navegación mes -->
          <div class="flex items-center justify-between mb-2">
            <button @click="mesAnterior"
              class="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <p class="text-lg font-bold text-center flex-1 text-[#0d1b0d]">
              {{ nombreMesActual }} {{ anioActual }}
            </p>
            <button @click="mesSiguiente"
              class="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <!-- Días de semana -->
          <div class="grid grid-cols-7 text-center text-sm font-semibold text-[#757575] mt-2">
            <div>D</div><div>L</div><div>M</div><div>M</div>
            <div>J</div><div>V</div><div>S</div>
          </div>

          <!-- Días del mes -->
          <div class="grid grid-cols-7 gap-y-1 mt-1">
            <div v-for="i in primerDiaMes" :key="'v'+i"></div>
            <button
              v-for="dia in diasEnMes"
              :key="dia"
              @click="seleccionarDia(dia)"
              class="relative flex flex-col items-center justify-center h-11 w-full rounded-full text-sm font-medium transition-colors"
              :class="esDiaSeleccionado(dia)
                ? 'bg-[#4c9a4c] text-white font-bold'
                : tieneVisitas(dia)
                  ? 'text-[#4c9a4c] font-bold hover:bg-[#e7f3e7]'
                  : 'text-[#0d1b0d] hover:bg-[#e7f3e7]'"
            >
              {{ dia }}
              <span
                v-if="tieneVisitas(dia) && !esDiaSeleccionado(dia)"
                class="absolute bottom-1 h-1 w-1 rounded-full bg-[#4c9a4c]"
              ></span>
            </button>
          </div>

        </div>
      </div>

      <!-- ── Panel de citas ─────────────────────────── -->
      <div class="lg:col-span-1 flex flex-col gap-4">

        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-[#0d1b0d]">
            {{ fechaSeleccionadaLabel }}
          </h3>
          <button @click="abrirModal"
            class="flex items-center gap-2 rounded-lg bg-[#4c9a4c] px-4 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-[#4c9a4c]/90">
            <span class="material-symbols-outlined text-base">add</span>
            Añadir Cita
          </button>
        </div>

        <!-- Skeleton cargando -->
        <div v-if="store.cargando" class="flex items-center justify-center py-12 text-[#757575]">
          <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
          Cargando...
        </div>

        <template v-else>
          <!-- Tarjetas de citas -->
          <div
            v-for="(cita, i) in citasDelDia"
            :key="i"
            @click="abrirDetalle(cita)"
            class="cursor-pointer rounded-xl border-l-4 border-[#4c9a4c] bg-[#efebe9] p-4 flex items-start gap-4 hover:opacity-90 transition-opacity"
          >
            <div class="flex flex-col items-center min-w-[52px] justify-center">
              <span class="material-symbols-outlined text-[#4c9a4c] text-3xl">event_available</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-[#0d1b0d] truncate">{{ cita.veterinario || '—' }}</p>
              <p class="text-sm text-[#757575] truncate">{{ (cita.motivos || []).join(', ') || cita.observaciones || '—' }}</p>
              <div class="mt-2 flex items-center gap-1.5 text-sm text-[#5d4037]">
                <span class="material-symbols-outlined text-base">pets</span>
                <span class="truncate">{{ cita.animal || '—' }}<span v-if="cita.crotal"> · #{{ cita.crotal }}</span></span>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="citasDelDia.length === 0"
            class="rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 flex flex-col items-center text-center">
            <span class="material-symbols-outlined text-5xl text-[#bdbdbd] mb-2">event_busy</span>
            <p class="font-semibold text-[#0d1b0d]">No hay citas para este día.</p>
            <p class="text-sm text-[#757575]">¡Añade una nueva cita para organizar el día!</p>
          </div>
        </template>

      </div>
    </div>

    <!-- ════════════════════════════════ -->
    <!-- Modal: Nueva Cita               -->
    <!-- ════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modalAbierto"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="cerrarModal">
        <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">

          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-xl font-bold text-[#0d1b0d]">Nueva Cita</h3>
            <button @click="cerrarModal" class="text-2xl leading-none text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <form @submit.prevent="guardarCita" class="flex flex-col gap-3">

            <!-- Veterinario -->
            <div>
              <label class="mb-1 block text-sm font-medium">Veterinario <span class="text-red-500">*</span></label>
              <select v-model="form.Id_veterinario" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]">
                <option value="">Seleccionar veterinario...</option>
                <option v-for="v in store.veterinarios" :key="v.Id_veterinario" :value="v.Id_veterinario">
                  {{ v.nombre }}
                </option>
              </select>
            </div>

            <!-- Animal -->
            <div>
              <label class="mb-1 block text-sm font-medium">Animal <span class="text-red-500">*</span></label>
              <select v-model="form.Id_bovino" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]">
                <option value="">Seleccionar animal...</option>
                <option v-for="b in store.bovinos" :key="b.id_bovino" :value="b.id_bovino">
                  {{ b.nombre }}{{ b.numero_crotal ? ' · #' + b.numero_crotal : '' }}
                </option>
              </select>
            </div>

            <!-- Motivos -->
            <div>
              <label class="mb-1 block text-sm font-medium">Motivo(s) <span class="text-red-500">*</span></label>
              <div class="flex flex-wrap gap-2">
                <template v-if="store.motivos.length > 0">
                  <label
                    v-for="m in store.motivos"
                    :key="m.Id_motivo"
                    class="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors select-none"
                    :class="form.motivos.includes(m.Id_motivo)
                      ? 'border-[#4c9a4c] bg-[#e7f3e7] text-[#4c9a4c] font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#4c9a4c]'"
                  >
                    <input type="checkbox" :value="m.Id_motivo" v-model="form.motivos" class="hidden" />
                    {{ m.motivo }}
                  </label>
                </template>
                <!-- Fallback si el endpoint de motivos no existe aún -->
                <template v-else>
                  <label
                    v-for="mot in motivosFallback"
                    :key="mot"
                    class="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors select-none"
                    :class="form.motivosFallback.includes(mot)
                      ? 'border-[#4c9a4c] bg-[#e7f3e7] text-[#4c9a4c] font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#4c9a4c]'"
                  >
                    <input type="checkbox" :value="mot" v-model="form.motivosFallback" class="hidden" />
                    {{ mot }}
                  </label>
                </template>
              </div>
            </div>

            <!-- Fecha -->
            <div>
              <label class="mb-1 block text-sm font-medium">Fecha <span class="text-red-500">*</span></label>
              <input v-model="form.fecha" type="date" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]" />
            </div>


            <!-- Observaciones -->
            <div>
              <label class="mb-1 block text-sm font-medium">Observaciones</label>
              <textarea v-model="form.observaciones" rows="2" placeholder="Notas adicionales..."
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]">
              </textarea>
            </div>

            <button type="submit" :disabled="store.cargando"
              class="w-full rounded-lg bg-[#4c9a4c] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4c9a4c]/90 disabled:cursor-not-allowed disabled:opacity-60">
              {{ store.cargando ? 'Guardando...' : 'Guardar Cita' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ════════════════════════════════ -->
    <!-- Modal: Detalle de Cita          -->
    <!-- ════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="citaDetalle"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="citaDetalle = null">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-xl font-bold text-[#0d1b0d]">Detalle de la cita</h3>
            <button @click="citaDetalle = null" class="text-2xl leading-none text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <div class="flex items-center gap-4 rounded-xl border-l-4 border-[#4c9a4c] bg-[#efebe9] p-4 mb-4">
            <div class="flex flex-col items-center">
              <span class="material-symbols-outlined text-[#4c9a4c] text-3xl">event_available</span>
            </div>
            <div>
              <p class="font-bold text-[#0d1b0d]">{{ (citaDetalle.motivos || []).join(', ') || '—' }}</p>
              <p class="text-sm text-[#757575]">{{ citaDetalle.fecha }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-3 text-sm">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#4c9a4c]">medical_services</span>
              <p><strong>Veterinario:</strong> {{ citaDetalle.veterinario || '—' }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#4c9a4c]">pets</span>
              <p><strong>Animal:</strong> {{ citaDetalle.animal || '—' }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#4c9a4c]">tag</span>
              <p><strong>Crotal:</strong> {{ citaDetalle.crotal || '—' }}</p>
            </div>
            <div v-if="citaDetalle.observaciones" class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[#4c9a4c]">note</span>
              <p><strong>Observaciones:</strong> {{ citaDetalle.observaciones }}</p>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
        <div v-if="mostrarToast"
          class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#4c9a4c] px-5 py-3 text-white shadow-lg">
          <span class="material-symbols-outlined">check_circle</span>
          <p class="font-semibold">Cita guardada correctamente</p>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useVisitaStore } from '../store/visita.store.js'

const store = useVisitaStore()

onMounted(async () => {
  await store.cargarVisitas()
  await store.cargarCatalogos()
})

// ── Calendario ─────────────────────────────────────────
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const hoy = new Date()
const mesActual       = ref(hoy.getMonth())
const anioActual      = ref(hoy.getFullYear())
const diaSeleccionado = ref(hoy.getDate())

const nombreMesActual = computed(() => MESES[mesActual.value])
const primerDiaMes    = computed(() => new Date(anioActual.value, mesActual.value, 1).getDay())
const diasEnMes       = computed(() => new Date(anioActual.value, mesActual.value + 1, 0).getDate())

function mesAnterior() {
  if (mesActual.value === 0) { mesActual.value = 11; anioActual.value-- }
  else mesActual.value--
}
function mesSiguiente() {
  if (mesActual.value === 11) { mesActual.value = 0; anioActual.value++ }
  else mesActual.value++
}
function seleccionarDia(dia) {
  diaSeleccionado.value = dia
  store.limpiarMensajes()
}
function esDiaSeleccionado(dia) {
  return dia === diaSeleccionado.value
}

// ── Fecha ISO del día seleccionado ─────────────────────
const fechaSeleccionadaISO = computed(() => {
  const m = String(mesActual.value + 1).padStart(2, '0')
  const d = String(diaSeleccionado.value).padStart(2, '0')
  return `${anioActual.value}-${m}-${d}`
})
const fechaSeleccionadaLabel = computed(() =>
  `${String(diaSeleccionado.value).padStart(2,'0')} de ${MESES[mesActual.value]}`
)

const citasDelDia = computed(() =>
  store.visitas.filter(v => v.fecha === fechaSeleccionadaISO.value)
)

function tieneVisitas(dia) {
  const m = String(mesActual.value + 1).padStart(2, '0')
  const d = String(dia).padStart(2, '0')
  return store.visitas.some(v => v.fecha === `${anioActual.value}-${m}-${d}`)
}


// ── Modal nueva cita ───────────────────────────────────
const modalAbierto     = ref(false)
const motivosFallback  = ['Embarazo', 'Inseminación', 'Enfermedad', 'Chequeo regular']

const form = reactive({
  Id_veterinario: '',
  Id_bovino:      '',
  motivos:        [],
  motivosFallback:[],
  fecha:          '',
  observaciones:  ''
})

function abrirModal() {
  Object.assign(form, {
    Id_veterinario: '', Id_bovino: '',
    motivos: [], motivosFallback: [],
    fecha: fechaSeleccionadaISO.value, observaciones: ''
  })
  store.limpiarMensajes()
  modalAbierto.value = true
}
function cerrarModal() { modalAbierto.value = false }

async function guardarCita() {
  const ok = await store.crearVisita({
    Id_veterinario: form.Id_veterinario,
    Id_bovino:      form.Id_bovino,
    fecha:          form.fecha,
    observaciones:  form.observaciones,
    motivos:        form.motivos.length > 0 ? form.motivos : undefined
  })
  if (ok) { cerrarModal(); activarToast() }
}

// ── Detalle ────────────────────────────────────────────
const citaDetalle = ref(null)
function abrirDetalle(cita) { citaDetalle.value = cita }

// ── Toast ──────────────────────────────────────────────
const mostrarToast = ref(false)
function activarToast() {
  mostrarToast.value = true
  setTimeout(() => { mostrarToast.value = false }, 3000)
}
</script>