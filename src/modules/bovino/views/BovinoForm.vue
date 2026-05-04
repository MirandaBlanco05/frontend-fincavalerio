<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Animal</h3>
          <p class="modal-subtitle">Complete los datos del animal</p>
        </div>
        <button type="button" @click="router.push({ name: 'Bovinos' })" class="btn-close">
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
      <form id="form-animal" @submit.prevent="guardar" class="modal-body">
        
        <div class="form-grid">
          <!-- ID Grupo -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">dataset</span>
              ID Grupo
            </label>
            <input v-model="form.Id_grupo" type="number" required class="form-input" placeholder="Ej: 1" />
          </div>

          <!-- N° Crotal -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">qr_code_2</span>
              N° Crotal
            </label>
            <input v-model="form.numero_crotal" type="number" class="form-input" placeholder="Ej: 123" />
          </div>
        </div>

        <div class="form-grid">
          <!-- ID Raza -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">category</span>
              ID Raza
            </label>
            <input v-model="form.Id_raza" type="number" required class="form-input" placeholder="Ej: 2" />
          </div>

          <!-- Nombre -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pets</span>
              Nombre
            </label>
            <input v-model="form.nombre" type="text" required class="form-input" placeholder="Nombre del animal" />
          </div>
        </div>

        <div class="form-grid">
          <!-- Fecha Nacimiento -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha Nacimiento
            </label>
            <input v-model="form.fecha_nacimiento" type="date" required class="form-input" />
          </div>

          <!-- Nombre Madre -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">female</span>
              Nombre Madre
            </label>
            <input v-model="form.nombre_madre" type="text" class="form-input" placeholder="Nombre de la madre" />
          </div>
        </div>

        <div class="form-grid">
          <!-- Sexo -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">transgender</span>
              Sexo
            </label>
            <select v-model="form.sexo" required class="form-select">
              <option value="">Seleccione...</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <!-- Edad -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">cake</span>
              Edad (años)
            </label>
            <input v-model="form.edad" type="number" min="0" class="form-input" placeholder="Ej: 3" />
          </div>
        </div>

        <div class="form-grid">
          <!-- Estado -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">info</span>
              Estado
            </label>
            <select v-model="form.estado" required class="form-select">
              <option value="">Seleccione...</option>
              <option value="Activo">Activo</option>
              <option value="Vendido">Vendido</option>
              <option value="Muerto">Muerto</option>
            </select>
          </div>

          <!-- Peso -->
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">weight</span>
              Peso (kg)
            </label>
            <input v-model="form.peso" type="text" class="form-input" placeholder="Ej: 450" />
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Bovinos' })" class="btn btn--secondary">Cancelar</button>
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
import { reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBovinoStore } from '../store/bovino.store.js'

const router = useRouter()
const route  = useRoute()
const store  = useBovinoStore()

const modoEdicion = computed(() => !!route.params.id)

const form = reactive({
  Id_grupo:         '',
  numero_crotal:    '',
  Id_raza:          '',
  nombre:           '',
  fecha_nacimiento: '',
  nombre_madre:     '',
  sexo:             '',
  edad:             '',
  estado:           '',
  peso:             ''
})

onMounted(async () => {
  if (modoEdicion.value) {
    if (store.bovinos.length === 0) {
      await store.cargarBovinos()
    }
    const bovino = store.bovinos.find(b => b.id_bovino == route.params.id)
    if (bovino) {
      form.Id_grupo         = bovino.Id_grupo
      form.numero_crotal    = bovino.numero_crotal
      form.Id_raza          = bovino.Id_raza
      form.nombre           = bovino.nombre
      form.fecha_nacimiento = bovino.fecha_nacimiento
      form.nombre_madre     = bovino.nombre_madre
      form.sexo             = bovino.sexo
      form.edad             = bovino.edad
      form.estado           = bovino.estado
      form.peso             = bovino.peso
    }
  }
  store.limpiarMensajes()
})

async function guardar() {
  let ok
  if (modoEdicion.value) {
    ok = await store.actualizarBovino(route.params.id, { ...form })
  } else {
    ok = await store.crearBovino({ ...form })
  }
  if (ok) {
    router.push({ name: 'Bovinos' })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

/* Modal */
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

/* Form */
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

.form-input, .form-select, .form-textarea {
  padding: 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: white;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
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
  .modal-body {
    padding: 1.5rem;
  }
}
</style>