<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Registro de Enfermedad</h3>
          <p class="modal-subtitle">Complete los datos del historial</p>
        </div>
        <button type="button" @click="router.push({ name: 'HistorialEnfermedades' })" class="btn-close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="store.error" style="padding: 1rem 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">
          <span class="material-symbols-outlined">error</span>
          <span>{{ store.error }}</span>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardar" class="modal-body">
        
        <div class="form-grid">
          <!-- Animal -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pets</span>
              Animal
            </label>
            <select v-model="form.id_bovino" required class="form-select">
              <option value="">Seleccione un animal...</option>
              <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">
                {{ b.nombre || 'Sin nombre' }} - {{ b.numero_crotal || 'Sin crotal' }}
              </option>
            </select>
          </div>

          <!-- Enfermedades (Múltiple) -->
          <div class="form-group col-span-2">
            <label class="form-label required">
              <span class="material-symbols-outlined">medical_services</span>
              Enfermedades Diagnosticadas
            </label>
            <div class="checkbox-grid">
              <label v-for="e in enfermedades" :key="e.id_enfermedad" class="checkbox-card" :class="{ 'is-selected': form.enfermedades.includes(e.id_enfermedad) }">
                <input type="checkbox" :value="e.id_enfermedad" v-model="form.enfermedades" class="hidden-checkbox" />
                <span class="checkbox-marker"></span>
                <span class="checkbox-label">{{ e.nombre }}</span>
              </label>
            </div>
            <p v-if="form.enfermedades.length === 0" class="text-xs text-gray-400 mt-2">Seleccione al menos una enfermedad</p>
          </div>
        </div>

        <div class="form-grid">
          <!-- Fecha -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">calendar_today</span>
              Fecha del Diagnóstico
            </label>
            <input v-model="form.fecha" type="date" required class="form-input" />
          </div>

          <!-- Observaciones (opcional) -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">description</span>
              Observaciones
            </label>
            <input v-model="form.observaciones" type="text" class="form-input" placeholder="Opcional" />
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'HistorialEnfermedades' })" class="btn btn--secondary">Cancelar</button>
          <button type="submit" :disabled="store.cargando" class="btn btn--primary">
            <span class="material-symbols-outlined">save</span>
            {{ store.cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Registro' : 'Guardar Registro') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHistorialStore } from '../store/historial.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'
import   enfermedadService  from '@/modules/enfermedad/services/enfermedad.service.js'

const router = useRouter()
const route = useRoute()
const store = useHistorialStore()

const modoEdicion = computed(() => !!route.params.id)

const bovinos = ref([])
const enfermedades = ref([])

const form = reactive({
  id_bovino: '',
  enfermedades: [], // Ahora es un array para many-to-many
  fecha: new Date().toISOString().split('T')[0],
  observaciones: ''
})

onMounted(async () => {
  await cargarDatosAuxiliares()
  
  if (modoEdicion.value) {
    if (store.historiales.length === 0) {
      await store.cargarHistoriales()
    }
    const hist = store.historiales.find(h => h.id_historial == route.params.id)
    if (hist) {
      form.id_bovino = hist.id_bovino
      // El backend devuelve objetos en h.enfermedades, necesitamos mapear a IDs comparando nombres con el catálogo
      form.enfermedades = enfermedades.value
        .filter(e => hist.enfermedades?.some(he => he.nombre === e.nombre))
        .map(e => e.id_enfermedad)
      
      form.fecha = hist.fecha ? hist.fecha.split('T')[0] : new Date().toISOString().split('T')[0]
      form.observaciones = hist.observaciones || ''
    }
  }
})

async function cargarDatosAuxiliares() {
  try {
    const [bovinosRes, enfermedadesRes] = await Promise.all([
      bovinoService.listar(),
      enfermedadService.listar()
    ])
    bovinos.value = bovinosRes.data
    enfermedades.value = enfermedadesRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

async function guardar() {
  if (form.enfermedades.length === 0) {
    alert('Por favor seleccione al menos una enfermedad')
    return
  }
  let ok
  if (modoEdicion.value) {
    ok = await store.actualizarHistorial(route.params.id, { ...form })
  } else {
    ok = await store.crearHistorial({ ...form })
  }
  if (ok) {
    router.push({ name: 'HistorialEnfermedades' })
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
  background: rgba(0,0,0,0.5);
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

.form-input, .form-select {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
}

.form-select {
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #9ca3af;
  background: #f3f4f6;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.col-span-2 {
  grid-column: span 2;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  margin-top: 5px;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #fcfcfc;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.checkbox-card:hover {
  background: #f5f5f5;
  border-color: #9ca3af;
}

.checkbox-card.is-selected {
  background: #f0f9f0;
  border-color: #4c9a4c;
  box-shadow: 0 2px 8px rgba(76, 154, 76, 0.1);
}

.hidden-checkbox {
  display: none;
}

.checkbox-marker {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 5px;
  position: relative;
  transition: all 0.2s;
  background: white;
}

.is-selected .checkbox-marker {
  background: #4c9a4c;
  border-color: #4c9a4c;
}

.is-selected .checkbox-marker::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.is-selected .checkbox-label {
  color: #1a1a1a;
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