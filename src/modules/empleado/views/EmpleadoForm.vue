<template>
  <div class="modal-overlay">
    <div class="modal-content">
      
      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Empleado</h3>
          <p class="modal-subtitle">Complete la información del personal</p>
        </div>
        <button type="button" @click="router.push({ name: 'Empleado' })" class="btn-close">
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
        
        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">person</span>
            Nombre Completo
          </label>
          <input v-model="form.nombre" type="text" required class="form-input" placeholder="Ej: Juan Pérez" 
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$" title="Solo se permiten letras" />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">flag</span>
              Nacionalidad
            </label>
            <select v-model="form.nacionalidad" required class="form-select">
              <option value="">Seleccione...</option>
              <option value="Dominicana">Dominicana</option>
              <option value="Haitiana">Haitiana</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">badge</span>
              Cédula / ID
            </label>
            <input v-model="form.cedula" type="text" class="form-input" placeholder="00000000000" 
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" maxlength="11" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">phone</span>
              Teléfono
            </label>
            <input v-model="form.telefono" type="text" required class="form-input" placeholder="8090000000" 
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" maxlength="10" />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">payments</span>
              Salario
            </label>
            <input v-model.number="form.salario" type="number" step="0.01" min="0" class="form-input" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">work</span>
              Puesto / Cargo
            </label>
            <select v-model="form.puesto" class="form-select">
              <option value="">Seleccione...</option>
              <option value="Administrador">Administrador</option>
              <option value="Mayordomo">Mayordomo</option>
              <option value="Ordeñador">Ordeñador</option>
              <option value="Vaquero">Vaquero</option>
              <option value="Veterinario">Veterinario</option>
              <option value="Auxiliar de Veterinaria">Auxiliar de Veterinaria</option>
              <option value="Inseminador">Inseminador</option>
              <option value="Operario de Maquinaria">Operario de Maquinaria</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Sereno">Sereno / Guardián</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="material-symbols-outlined">description</span>
              Tipo de Contrato
            </label>
            <input v-model="form.contrato" type="text" class="form-input" placeholder="Ej: Fijo, Temporal" 
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$" title="Solo se permiten letras" />
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Empleado' })" class="btn btn--secondary">Cancelar</button>
          <button type="submit" :disabled="store.cargando" class="btn btn--primary">
            <span class="material-symbols-outlined">save</span>
            {{ store.cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Empleado' : 'Guardar Empleado') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmpleadoStore } from '../store/empleado.store.js'

const router = useRouter()
const route = useRoute()
const store = useEmpleadoStore()

const modoEdicion = computed(() => !!route.params.id)

const form = reactive({
  nombre: '',
  nacionalidad: '',
  cedula: '',
  telefono: '',
  salario: 0,
  contrato: '',
  puesto: ''
})

onMounted(async () => {
  if (modoEdicion.value) {
    if (store.empleados.length === 0) {
      await store.cargarEmpleados()
    }
    const emp = store.empleados.find(e => e.id_empleado == route.params.id)
    if (emp) {
      form.nombre = emp.nombre
      form.nacionalidad = emp.nacionalidad
      form.cedula = emp.cedula
      form.telefono = emp.telefono
      form.salario = emp.salario
      form.contrato = emp.contrato
      form.puesto = emp.puesto
    }
  }
})

async function guardar() {
  let res
  if (modoEdicion.value) {
    res = await store.actualizarEmpleado(route.params.id, { ...form })
  } else {
    res = await store.crearEmpleado({ ...form })
  }
  
  if (res) {
    router.push({ name: 'Empleado' })
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

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 2.5rem;
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
