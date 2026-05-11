<template>
  <div class="modal-overlay">
    <div class="modal-content">

      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Ciclo de Celo</h3>
          <p class="modal-subtitle">Registre los datos del ciclo reproductivo</p>
        </div>
        <button type="button" @click="router.push({ name: 'CicloCelo' })" class="btn-close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Alerta error -->
      <div v-if="errorLocal" style="padding: 1rem 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">
          <span class="material-symbols-outlined">error</span>
          <span>{{ errorLocal }}</span>
        </div>
      </div>

      <!-- Formulario -->
      <form id="form-celo" @submit.prevent="guardar" class="modal-body">

        <div class="form-grid">
          <!-- Animal (Select) -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pets</span>
              Animal (Bovino)
            </label>
            <select v-model="form.id_bovino" required class="form-select">
              <option value="">Seleccione un animal...</option>
              <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">
                {{ b.nombre }} {{ b.numero_crotal ? '· #' + b.numero_crotal : '' }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Fecha Inicio -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha Inicio
            </label>
            <input
              v-model="form.fecha_inicio"
              type="date"
              required
              class="form-input"
              @change="calcularDuracion"
            />
          </div>

          <!-- Fecha Fin -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event_available</span>
              Fecha Fin
            </label>
            <input
              v-model="form.fecha_fin"
              type="date"
              required
              class="form-input"
              @change="calcularDuracion"
            />
          </div>
        </div>

        <!-- Duración (calculada automáticamente) -->
        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">schedule</span>
            Duración (días)
          </label>
          <input
            v-model="form.duracion"
            type="text"
            readonly
            class="form-input"
            placeholder="Se calcula automáticamente"
            style="background: #f9fafb; cursor: not-allowed;"
          />
        </div>

        <!-- Observaciones -->
        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">notes</span>
            Observaciones
          </label>
          <textarea
            v-model="form.observaciones"
            class="form-input"
            rows="3"
            maxlength="200"
            placeholder="Detalles adicionales sobre el ciclo..."
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'CicloCelo' })" class="btn btn--secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="cargando" class="btn btn--primary">
            <span class="material-symbols-outlined">save</span>
            {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCeloStore } from '../store/celo.store.js'
import api from '@/core/api/axios.js'

const router = useRouter()
const route  = useRoute()
const store  = useCeloStore()

const modoEdicion = computed(() => !!route.params.id)
const cargando    = ref(false)
const errorLocal  = ref('')
const bovinos     = ref([])

const form = reactive({
  id_bovino:      '',
  fecha_inicio:   '',
  fecha_fin:      '',
  duracion:       '',
  observaciones:  ''
})

onMounted(async () => {
  await cargarBovinos()
  
  if (modoEdicion.value) {
    try {
      if (store.ciclos.length === 0) {
        await store.cargarCiclos()
      }
      const celo = store.ciclos.find(c => c.id_ciclo == route.params.id)
      if (celo) {
        form.id_bovino     = celo.id_bovino || (celo.bovino?.id_bovino)
        form.fecha_inicio  = celo.fecha_inicio ? celo.fecha_inicio.split('T')[0] : ''
        form.fecha_fin     = celo.fecha_fin ? celo.fecha_fin.split('T')[0] : ''
        form.duracion      = celo.duracion
        form.observaciones = celo.observaciones || ''
      } else {
        errorLocal.value = 'No se encontró el ciclo.'
      }
    } catch (e) {
      errorLocal.value = 'Error al cargar el ciclo.'
    }
  }
})

async function cargarBovinos() {
  try {
    const res = await api.get('/bovino/listar')
    bovinos.value = res.data
  } catch (e) {
    console.error('Error al cargar bovinos:', e)
  }
}

function calcularDuracion() {
  if (form.fecha_inicio && form.fecha_fin) {
    const inicio = new Date(form.fecha_inicio)
    const fin = new Date(form.fecha_fin)
    const diff = fin - inicio
    const dias = Math.round(diff / (1000 * 60 * 60 * 24))
    form.duracion = dias >= 0 ? dias.toString() : '0'
  }
}

async function guardar() {
  errorLocal.value = ''
  cargando.value   = true

  try {
    const payload = { ...form }

    let resultado
    if (modoEdicion.value) {
      resultado = await store.actualizarCelo(route.params.id, payload)
    } else {
      resultado = await store.crearCelo(payload)
    }

    if (resultado) {
      router.push({ name: 'CicloCelo' })
    } else {
      errorLocal.value = store.error || 'Error al guardar el ciclo.'
    }

  } catch (error) {
    errorLocal.value = error.response?.data?.error
      || error.response?.data?.mensaje
      || 'Error desconocido en el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
  font-family: 'DM Sans', sans-serif;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.btn-close {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}

.form-label .material-symbols-outlined {
  font-size: 1rem;
  color: #4c9a4c;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input,
.form-select,
textarea {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus,
.form-select:focus,
textarea:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 1rem;
  border-top: 1.5px solid #f0f0ed;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--primary {
  background: #4c9a4c;
  color: white;
}

.btn--secondary {
  background: #f5f5f5;
  color: #374151;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>