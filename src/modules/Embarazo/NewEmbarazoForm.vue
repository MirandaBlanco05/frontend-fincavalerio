<template>
  <div class="modal-overlay">
    <div class="modal-content">

      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Embarazo</h3>
          <p class="modal-subtitle">Complete los detalles del embarazo</p>
        </div>
        <button type="button" @click="router.push({ name: 'Embarazos' })" class="btn-close">
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
      <form @submit.prevent="guardar" class="modal-body">

        <div class="form-grid">
          <!-- Inseminación -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">science</span>
              Inseminación
            </label>
            <select v-model="form.id_inseminacion" required class="form-select">
              <option value="">Seleccione Inseminación</option>
              <option v-for="ins in inseminaciones" :key="ins.id_inseminacion || ins.Id_inseminacion" :value="ins.id_inseminacion || ins.Id_inseminacion">
                ID: {{ ins.id_inseminacion || ins.Id_inseminacion }} - Vaca: {{ ins.ciclo?.bovino?.nombre || 'N/A' }}
              </option>
            </select>
          </div>

          <!-- Veterinario -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">medical_services</span>
              Veterinario
            </label>
            <select v-model="form.id_veterinario" required class="form-select">
              <option value="">Seleccione Veterinario</option>
              <option v-for="vet in veterinarios" :key="vet.id_veterinario || vet.Id_veterinario" :value="vet.id_veterinario || vet.Id_veterinario">
                {{ vet.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Fase -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">timelapse</span>
              Fase (Opcional)
            </label>
            <select v-model="form.fase" class="form-select">
              <option value="">Seleccione</option>
              <option value="Primer Tercio">Primer Tercio</option>
              <option value="Segundo Tercio">Segundo Tercio</option>
              <option value="Último Tercio">Último Tercio</option>
            </select>
          </div>

          <!-- Fecha Secado -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">event</span>
              Fecha Secado (Opcional)
            </label>
            <input
              v-model="form.fecha_secado"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">event_available</span>
            Fecha Prevista de Parto
          </label>
          <input
            v-model="form.fecha_prevista_parto"
            type="date"
            required
            class="form-input"
          />
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Embarazos' })" class="btn btn--secondary">
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
import api from '@/core/api/axios.js'
import { useEmbarazoStore } from './store/Embarazo.store.js'

const router = useRouter()
const route = useRoute()
const store = useEmbarazoStore()

const modoEdicion = computed(() => !!route.params.id)
const cargando = ref(false)
const errorLocal = ref('')

const veterinarios = ref([])
const inseminaciones = ref([])

const form = reactive({
  id_inseminacion: '',
  id_veterinario: '',
  fase: '',
  fecha_secado: '',
  fecha_prevista_parto: ''
})

onMounted(async () => {
  try {
    const [resVet, resIns] = await Promise.all([
      api.get("/veterinario/listar"),
      api.get("/inseminacion/listar")
    ])
    veterinarios.value = resVet.data
    inseminaciones.value = resIns.data
  } catch (error) {
    console.error("Error cargando datos para el formulario", error)
  }

  if (modoEdicion.value) {
    try {
      if (store.embarazos.length === 0) {
        await store.cargarEmbarazos()
      }
      const emb = store.embarazos.find(e => e.id_embarazo == route.params.id)
      if (emb) {
        form.id_inseminacion = emb.id_inseminacion || emb.Id_inseminacion || ''
        form.id_veterinario = emb.id_veterinario || emb.Id_veterinario || ''
        form.fase = emb.fase || ''
        form.fecha_secado = emb.fecha_secado ? emb.fecha_secado.split('T')[0] : ''
        form.fecha_prevista_parto = emb.fecha_prevista_parto ? emb.fecha_prevista_parto.split('T')[0] : ''
      } else {
        errorLocal.value = 'No se encontró el embarazo.'
      }
    } catch (e) {
      errorLocal.value = 'Error al cargar el embarazo.'
    }
  }
})

async function guardar() {
  errorLocal.value = ''
  cargando.value = true

  try {
    const payload = {
      id_inseminacion: form.id_inseminacion,
      id_veterinario: form.id_veterinario,
      fase: form.fase || null,
      fecha_secado: form.fecha_secado || null,
      fecha_prevista_parto: form.fecha_prevista_parto
    }

    let ok = false
    if (modoEdicion.value) {
      ok = await store.actualizarEmbarazo(route.params.id, payload)
    } else {
      ok = await store.crearEmbarazo(payload)
    }

    if (ok) {
      router.push({ name: 'Embarazos' })
    } else {
      errorLocal.value = store.error || 'Error al guardar el embarazo'
    }

  } catch (error) {
    errorLocal.value = 'Error desconocido al guardar'
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
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.85rem;
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

.btn-close:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.btn--primary:hover:not(:disabled) {
  background: #3d7a3d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 154, 76, 0.3);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--secondary {
  background: #f5f5f5;
  color: #374151;
}

.btn--secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .modal-body {
    padding: 1.5rem;
  }
}
</style>
