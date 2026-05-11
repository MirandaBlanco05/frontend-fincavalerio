<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Ordeño</h3>
          <p class="modal-subtitle">Registre la producción de leche</p>
        </div>
        <button type="button" @click="router.push({ name: 'Ordenio' })" class="btn-close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div v-if="store.error" style="padding: 1rem 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">
          <span class="material-symbols-outlined">error</span>
          <span>{{ store.error }}</span>
        </div>
      </div>

      <form @submit.prevent="guardar" class="modal-body">
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pets</span>
              Bovino
            </label>
            <select v-model.number="form.id_bovino" required class="form-select">
              <option value="">Seleccione vaca...</option>
              <option v-for="b in bovinos" :key="b.id_bovino" :value="b.id_bovino">
                {{ b.nombre }} {{ b.numero_crotal ? `(#${b.numero_crotal})` : '' }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">badge</span>
              Empleado
            </label>
            <select v-model.number="form.id_empleado" required class="form-select">
              <option value="">Seleccione encargado...</option>
              <option v-for="e in empleados" :key="e.id_empleado" :value="e.id_empleado">
                {{ e.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha
            </label>
            <input v-model="form.fecha" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">schedule</span>
              Turno (Momento del Día)
            </label>
            <select v-model="form.momento_dia" required class="form-select">
              <option value="">Seleccione...</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">water_drop</span>
            Cantidad (Litros)
          </label>
          <input v-model="form.cantidad_total" type="number" step="0.01" required class="form-input" placeholder="Ej: 15.5" />
        </div>

        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Ordenio' })" class="btn btn--secondary">Cancelar</button>
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
import { useOrdenioStore } from '../store/ordenio.store.js'
import { bovinoService } from '@/modules/bovino/services/bovino.service.js'
import { empleadoService } from '@/modules/empleado/services/empleado.service.js'

const router = useRouter()
const route  = useRoute()
const store  = useOrdenioStore()

const modoEdicion = computed(() => !!route.params.id)

const bovinos = ref([])
const empleados = ref([])

const form = reactive({
  id_bovino:      '',
  id_empleado:    '',
  fecha:          new Date().toISOString().split('T')[0],
  momento_dia:    '',
  cantidad_total: ''
})

onMounted(async () => {
  await cargarDatosAuxiliares()
  
  if (modoEdicion.value) {
    if (store.ordenios.length === 0) {
      await store.cargarOrdenios()
    }
    const registro = store.ordenios.find(o => o.id_ordenio == route.params.id)
    if (registro) {
      form.id_bovino      = registro.id_bovino
      form.id_empleado    = registro.id_empleado
      form.fecha          = registro.fecha ? registro.fecha.split('T')[0] : ''
      form.momento_dia    = registro.momento_dia
      form.cantidad_total = registro.cantidad_total
    }
  }
})

async function cargarDatosAuxiliares() {
  try {
    const [bovRes, empRes] = await Promise.all([
      bovinoService.listar(),
      empleadoService.listar()
    ])
    bovinos.value = bovRes.data
    empleados.value = empRes.data
  } catch (error) {
    console.error('Error al cargar datos auxiliares:', error)
  }
}

async function guardar() {
  let ok
  if (modoEdicion.value) {
    ok = await store.actualizarOrdenio(route.params.id, { ...form })
  } else {
    ok = await store.crearOrdenio({ ...form })
  }
  if (ok) {
    router.push({ name: 'Ordenio' })
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

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4c9a4c;
  background: #f0f9f0;
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
}
</style>
