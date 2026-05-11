<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Animal</h3>
          <p class="modal-subtitle">Complete los datos del animal</p>
        </div>
        <button type="button" @click="router.push({ name: 'BovinosList' })" class="btn-close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div v-if="store.error" style="padding: 1rem 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">
          <span class="material-symbols-outlined">error</span>
          <span>{{ store.error }}</span>
        </div>
      </div>

      <form id="form-animal" @submit.prevent="guardar" class="modal-body">
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">dataset</span>
              Grupo
            </label>
            <select v-model="form.id_grupo" required class="form-select">
              <option value="">Seleccione grupo...</option>
              <option v-for="g in grupos" :key="g.id_grupo" :value="g.id_grupo">
                {{ g.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">qr_code_2</span>
              N° Crotal
            </label>
            <input v-model="form.numero_crotal" type="number" class="form-input" placeholder="Ej: 123" 
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">category</span>
              Raza
            </label>
            <select v-model="form.id_raza" required class="form-select">
              <option value="">Seleccione raza...</option>
              <option v-for="r in razas" :key="r.id_raza" :value="r.id_raza">
                {{ r.Tipo_raza }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">pets</span>
              Nombre
            </label>
            <input v-model="form.nombre" type="text" required class="form-input" placeholder="Nombre del animal" 
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$" title="Solo se permiten letras" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">event</span>
              Fecha Nacimiento
            </label>
            <input v-model="form.fecha_nacimiento" type="date" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">female</span>
              Nombre Madre
            </label>
            <input v-model="form.nombre_madre" type="text" class="form-input" placeholder="Nombre de la madre" 
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$" title="Solo se permiten letras" />
          </div>
        </div>

        <div class="form-grid">
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

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">male</span>
              Nombre Padre
            </label>
            <input v-model="form.nombre_padre" type="text" class="form-input" placeholder="Nombre del padre" 
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$" title="Solo se permiten letras" />
          </div>
        </div>

        <div class="form-grid">
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

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">cake</span>
              Edad (años)
            </label>
            <input v-model.number="form.edad" type="number" min="0" class="form-input" placeholder="Ej: 3" 
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">weight</span>
              Peso (kg)
            </label>
            <input v-model.number="form.peso" type="number" step="0.1" class="form-input" placeholder="Ej: 450" />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">location_on</span>
              Procedencia
            </label>
            <input v-model="form.procedencia" type="text" class="form-input" placeholder="Ej: Finca El Sol" 
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$" title="Letras y números permitidos" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'BovinosList' })" class="btn btn--secondary">Cancelar</button>
          <button type="submit" :disabled="store.cargando" class="btn btn--primary">
            <span class="material-symbols-outlined">save</span>
            {{ store.cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBovinoStore } from '@/modules/bovino/store/bovino.store.js'
import bovinoService from '@/modules/bovino/services/bovino.service.js'

const router = useRouter()
const route = useRoute()
const store = useBovinoStore()
const { grupos, razas } = storeToRefs(store)
const modoEdicion = computed(() => !!route.params.id)

const form = reactive({
  id_grupo: '',
  id_raza: '',
  numero_crotal: '',
  nombre: '',
  fecha_nacimiento: '',
  nombre_madre: '',
  nombre_padre: '',
  sexo: '',
  edad: '',
  peso: '',
  estado: '',
  procedencia: ''
})

onMounted(async () => {
  try {
    await store.cargarGruposyRazas()

    if (modoEdicion.value) {
      const res = await bovinoService.obtenerPorId(route.params.id)
      const data = res.data
      Object.assign(form, {
        id_grupo: data.id_grupo ? Number(data.id_grupo) : '',
        id_raza: data.id_raza ? Number(data.id_raza) : '',
        numero_crotal: data.numero_crotal,
        nombre: data.nombre,
        fecha_nacimiento: data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '',
        nombre_madre: data.nombre_madre || '',
        nombre_padre: data.nombre_padre || '',
        sexo: data.sexo,
        edad: data.edad || '',
        peso: data.peso || '',
        estado: data.estado,
        procedencia: data.procedencia || ''
      })
    }
  } catch (error) {
    console.error('Error inicializando formulario:', error)
  }
})

async function guardar() {
  try {
    let exito
    if (modoEdicion.value) {
      exito = await store.actualizarBovino(route.params.id, form)
    } else {
      exito = await store.crearBovino(form)
    }

    if (exito) {
      router.push({ name: 'BovinosList' })
    }
  } catch (error) {
    console.error('Error al guardar:', error)
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
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-label .material-symbols-outlined {
  font-size: 1.1rem;
  color: #4c9a4c;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-input, .form-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s;
  width: 100%;
  background: #fcfcfc;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4c9a4c;
  background: white;
  box-shadow: 0 0 0 4px rgba(76, 154, 76, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 2.5rem;
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
  font-size: 0.95rem;
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
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn--secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>