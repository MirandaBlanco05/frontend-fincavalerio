<template>
  <div class="modal-overlay">
    <div class="modal-content">

      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Parto</h3>
          <p class="modal-subtitle">Complete los detalles del parto</p>
        </div>
        <button type="button" @click="router.push({ name: 'Partos' })" class="btn-close">
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
          <!-- Embarazo (Filtrado) -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pregnancy</span>
              Embarazo Asociado
            </label>
            <select v-model="form.id_embarazo" required class="form-select">
              <option value="">Seleccione Embarazo...</option>
              <option v-for="emb in embarazosActivos" :key="emb.id_embarazo" :value="emb.id_embarazo">
                Embarazo ID: #{{ emb.id_embarazo }} - Vaca: {{ emb.inseminacion?.ciclo?.bovino?.nombre || 'N/A' }}
              </option>
            </select>
            <p v-if="embarazosActivos.length === 0" class="text-[11px] text-orange-600 mt-1">No hay embarazos activos disponibles</p>
          </div>

          <!-- Fecha Parto -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha del Parto
            </label>
            <input
              v-model="form.fecha_parto"
              type="date"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">child_friendly</span>
            Número de Crías
          </label>
          <input
            v-model="form.numero_crias"
            type="number"
            min="1"
            max="5"
            required
            placeholder="1"
            class="form-input"
          />
        </div>

        <!-- Observaciones -->
        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">notes</span>
            Observaciones Generales
          </label>
          <textarea
            v-model="form.observaciones"
            class="form-input"
            rows="3"
            placeholder="Indique estado de la cría, complicaciones, etc..."
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Partos' })" class="btn btn--secondary">
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
import { usePartoStore } from './store/Parto.store.js'
import embarazoService from '../Embarazo/services/Embarazo.Service.js'

const router = useRouter()
const route = useRoute()
const store = usePartoStore()

const modoEdicion = computed(() => !!route.params.id)
const cargando = ref(false)
const errorLocal = ref('')

const embarazos = ref([])

// Solo mostrar embarazos que no tengan parto asociado (excepto el actual si estamos editando)
const embarazosActivos = computed(() => {
  return embarazos.value.filter(emb => {
    // Si estamos editando, permitir el embarazo actual
    if (modoEdicion.value && emb.id_embarazo == form.id_embarazo) return true
    
    // Filtrar los que ya tienen parto en la lista del store
    const tieneParto = store.partos.some(p => p.id_embarazo == emb.id_embarazo)
    return !tieneParto && emb.finalizado !== true && emb.finalizado !== 1
  })
})

const form = reactive({
  id_embarazo: '',
  fecha_parto: '',
  numero_crias: 1,
  observaciones: ''
})

onMounted(async () => {
  try {
    const res = await embarazoService.listar()
    embarazos.value = res.data || res || []
    
    // Si no hay partos en el store, cargarlos para poder filtrar correctamente
    if (store.partos.length === 0) {
      await store.cargarPartos()
    }
  } catch (error) {
    console.error("Error cargando embarazos", error)
  }

  if (modoEdicion.value) {
    try {
      const p = store.partos.find(x => x.id_parto == route.params.id)
      if (p) {
        form.id_embarazo = p.id_embarazo || ''
        form.fecha_parto = p.fecha_parto ? p.fecha_parto.split('T')[0] : ''
        form.numero_crias = p.numero_crias || 1
        form.observaciones = p.observaciones || ''
      } else {
        errorLocal.value = 'No se encontró el parto.'
      }
    } catch (e) {
      errorLocal.value = 'Error al cargar el parto.'
    }
  }
})

async function guardar() {
  errorLocal.value = ''
  cargando.value = true

  try {
    const payload = {
      id_embarazo: form.id_embarazo,
      fecha_parto: form.fecha_parto,
      numero_crias: form.numero_crias || 1,
      observaciones: form.observaciones || null
    }

    let ok = false
    if (modoEdicion.value) {
      ok = await store.actualizarParto(route.params.id, payload)
    } else {
      ok = await store.crearParto(payload)
    }

    if (ok) {
      router.push({ name: 'Partos' })
    } else {
      errorLocal.value = store.error || 'Error al guardar el parto'
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