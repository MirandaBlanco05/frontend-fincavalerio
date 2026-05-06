<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Tratamiento</h3>
          <p class="modal-subtitle">Complete los datos del tratamiento realizado</p>
        </div>
        <button type="button" @click="router.push({ name: 'Tratamientos' })" class="btn-close">
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
          <!-- Nombre -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">healing</span>
              Nombre del Tratamiento
            </label>
            <input v-model="form.nombre" type="text" required class="form-input" placeholder="Ej: Antibiótico inyectable" />
          </div>

          <!-- Tipo -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">category</span>
              Tipo de Tratamiento
            </label>
            <input v-model="form.tipo_tratamiento" type="text" required class="form-input" placeholder="Ej: Antibiótico" />
          </div>
        </div>

        <div class="form-grid">
          <!-- Enfermedad -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">medical_services</span>
              Enfermedad
            </label>
            <select v-model="form.id_enfermedad" required class="form-select">
              <option value="">Seleccione una enfermedad...</option>
              <option v-for="e in enfermedades" :key="e.id_enfermedad" :value="e.id_enfermedad">
                {{ e.nombre }}
              </option>
            </select>
          </div>

          <!-- Empleado -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">badge</span>
              Empleado Responsable
            </label>
            <select v-model="form.id_empleado" required class="form-select">
              <option value="">Seleccione un empleado...</option>
              <option v-for="e in empleados" :key="e.id_empleado" :value="e.id_empleado">
                {{ e.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Fecha Inicio -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">calendar_today</span>
              Fecha de Inicio
            </label>
            <input v-model="form.fecha_inicio" type="date" required class="form-input" />
          </div>

          <!-- Fecha Fin -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha de Fin
            </label>
            <input v-model="form.fecha_fin" type="date" required class="form-input" />
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Tratamientos' })" class="btn btn--secondary">Cancelar</button>
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
import { useTratamientoStore } from '../store/tratamiento.store.js'
import enfermedadService from '@/modules/enfermedad/services/enfermedad.service.js'
import empleadoService from '@/modules/empleado/services/empleado.service.js'

const router = useRouter()
const route = useRoute()
const store = useTratamientoStore()

const modoEdicion = computed(() => !!route.params.id)

const enfermedades = ref([])
const empleados = ref([])

const form = reactive({
  nombre: '',
  tipo_tratamiento: '',
  id_enfermedad: '',
  id_empleado: '',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: new Date().toISOString().split('T')[0]
})

onMounted(async () => {
  await cargarDatosAuxiliares()
  
  if (modoEdicion.value) {
    if (store.tratamientos.length === 0) {
      await store.cargarTratamientos()
    }
    const trat = store.tratamientos.find(t => t.id_tratamiento == route.params.id)
    if (trat) {
      form.nombre = trat.nombre
      form.tipo_tratamiento = trat.tipo_tratamiento
      form.id_enfermedad = trat.id_enfermedad
      form.id_empleado = trat.id_empleado
      form.fecha_inicio = trat.fecha_inicio ? trat.fecha_inicio.split('T')[0] : new Date().toISOString().split('T')[0]
      form.fecha_fin = trat.fecha_fin ? trat.fecha_fin.split('T')[0] : new Date().toISOString().split('T')[0]
    }
  }
})

async function cargarDatosAuxiliares() {
  try {
    const [enfermedadesRes, empleadosRes] = await Promise.all([
      enfermedadService.listar(),
      empleadoService.listar()
    ])
    enfermedades.value = enfermedadesRes.data
    empleados.value = empleadosRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

async function guardar() {
  let ok
  if (modoEdicion.value) {
    ok = await store.actualizarTratamiento(route.params.id, { ...form })
  } else {
    ok = await store.crearTratamiento({ ...form })
  }
  if (ok) {
    router.push({ name: 'Tratamientos' })
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