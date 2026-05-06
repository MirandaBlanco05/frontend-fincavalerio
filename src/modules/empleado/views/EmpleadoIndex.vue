<template>
  <div class="relative min-h-screen w-full">

    <!-- Action Bar -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button @click="abrirModal()" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:flex-none">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="truncate">Nuevo Empleado</span>
      </button>

      <button @click="editarEmpleado()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background-light px-4 py-2 text-sm font-bold text-text-primary ring-1 ring-inset ring-border-color transition-colors hover:bg-border-color/50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">edit</span>
        <span class="truncate">Editar</span>
      </button>

      <button @click="confirmarEliminar()" :disabled="!filaSeleccionada" class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
        <span class="material-symbols-outlined text-base">delete</span>
        <span class="truncate">Eliminar</span>
      </button>
    </div>

    <div v-if="store.error" class="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>
      {{ store.error }}
    </div>

    <div v-if="store.mensaje" class="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>
      {{ store.mensaje }}
    </div>

    <!-- Tabla -->
    <div class="w-full overflow-x-auto rounded-lg border border-border-color bg-white shadow-sm">
      <table class="w-full text-left text-sm text-text-primary">
        <thead class="border-b border-border-color bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Nombre</th>
            <th class="px-6 py-4">Nacionalidad</th>
            <th class="px-6 py-4">Cédula</th>
            <th class="px-6 py-4">Teléfono</th>
            <th class="px-6 py-4">Contrato</th>
            <th class="px-6 py-4">Puesto</th>
            <th class="px-6 py-4">Salario</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="store.cargando">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <p class="mt-2">Cargando empleados...</p>
            </td>
          </tr>

          <tr v-else-if="store.empleados.length === 0">
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl">group_off</span>
              <p class="mt-2">No hay empleados registrados.</p>
            </td>
          </tr>

          <tr v-else v-for="emp in store.empleados" :key="emp.Id_empleado" @click="seleccionarFila(emp)" class="cursor-pointer border-b border-border-color bg-white transition hover:bg-primary/10" :class="{ 'bg-primary/20': filaSeleccionada?.Id_empleado === emp.Id_empleado }">
            <td class="px-6 py-3">{{ emp.Id_empleado }}</td>
            <td class="px-6 py-3 font-medium">{{ emp.nombre }}</td>
            <td class="px-6 py-3">{{ emp.nacionalidad }}</td>
            <td class="px-6 py-3 font-mono">{{ emp.cedula ?? '—' }}</td>
            <td class="px-6 py-3 font-mono">{{ emp.telefono }}</td>
            <td class="px-6 py-3">{{ emp.contrato ?? '—' }}</td>
            <td class="px-6 py-3">{{ emp.puesto ?? '—' }}</td>
            <td class="px-6 py-3 text-right font-bold">{{ formatearSalario(emp.salario) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Formulario -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-content">
          
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ esEdicion ? 'Editar' : 'Nuevo' }} Empleado</h3>
              <p class="modal-subtitle">Complete los datos del empleado</p>
            </div>
            <button type="button" @click="cerrarModal" class="btn-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="guardarEmpleado" class="modal-body">
            
            <div class="form-group span-full">
              <label class="form-label required">
                <span class="material-symbols-outlined">person</span>
                Nombre completo
              </label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Juan Antonio Pérez" class="form-input" required />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">flag</span>
                  Nacionalidad
                </label>
                <select v-model="form.nacionalidad" class="form-select" required>
                  <option value="">Seleccione...</option>
                  <option value="Dominicana">Dominicana</option>
                  <option value="Haitiana">Haitiana</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">badge</span>
                  Cédula
                </label>
                <input v-model="form.cedula" type="text" placeholder="Ej: 001-0000000-0" class="form-input" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">
                  <span class="material-symbols-outlined">phone</span>
                  Teléfono
                </label>
                <input v-model="form.telefono" type="tel" placeholder="Ej: 809-000-0000" class="form-input" required />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">payments</span>
                  Salario (RD$)
                </label>
                <input v-model="form.salario" type="number" step="0.01" placeholder="Ej: 15000" class="form-input" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">description</span>
                  Contrato
                </label>
                <input v-model="form.contrato" type="text" placeholder="Ej: Indefinido" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="material-symbols-outlined">work</span>
                  Puesto
                </label>
                <input v-model="form.puesto" type="text" placeholder="Ej: Ordeñador" class="form-input" />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn btn--secondary">Cancelar</button>
              <button type="submit" :disabled="store.cargando" class="btn btn--primary">
                <span class="material-symbols-outlined">save</span>
                {{ store.cargando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Eliminar -->
    <Teleport to="body">
      <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
        <div class="modal-content modal-content--small">
          <div class="modal-header modal-header--danger">
            <span class="material-symbols-outlined">warning</span>
            <h3 class="modal-title">Eliminar Empleado</h3>
          </div>
          <div class="modal-body">
            <p class="text-center">¿Está seguro que desea eliminar a <strong>{{ filaSeleccionada?.nombre }}</strong>?</p>
            <p class="text-center text-sm text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="modalEliminar = false" class="btn btn--secondary">Cancelar</button>
            <button @click="eliminarEmpleado" class="btn btn--danger">
              <span class="material-symbols-outlined">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useEmpleadoStore } from '@/modules/empleado/store/empleado.store.js'

const store = useEmpleadoStore()
const filaSeleccionada = ref(null)
const mostrarModal = ref(false)
const modalEliminar = ref(false)
const esEdicion = ref(false)

const form = reactive({
  id: null,
  nombre: '',
  nacionalidad: '',
  cedula: '',
  telefono: '',
  salario: '',
  contrato: '',
  puesto: ''
})

function seleccionarFila(empleado) {
  if (filaSeleccionada.value?.Id_empleado === empleado.Id_empleado) {
    filaSeleccionada.value = null
  } else {
    filaSeleccionada.value = empleado
    store.limpiarMensajes?.()
  }
}

function abrirModal() {
  limpiarForm()
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  limpiarForm()
}

function limpiarForm() {
  form.id = null
  form.nombre = ''
  form.nacionalidad = ''
  form.cedula = ''
  form.telefono = ''
  form.salario = ''
  form.contrato = ''
  form.puesto = ''
  esEdicion.value = false
}

function editarEmpleado() {
  if (!filaSeleccionada.value) return
  const emp = filaSeleccionada.value
  form.id = emp.Id_empleado
  form.nombre = emp.nombre
  form.nacionalidad = emp.nacionalidad
  form.cedula = emp.cedula || ''
  form.telefono = emp.telefono
  form.salario = emp.salario || ''
  form.contrato = emp.contrato || ''
  form.puesto = emp.puesto || ''
  esEdicion.value = true
  mostrarModal.value = true
}

async function guardarEmpleado() {
  const datos = {
    nombre: form.nombre,
    nacionalidad: form.nacionalidad,
    cedula: form.cedula || null,
    telefono: form.telefono,
    salario: form.salario ? parseFloat(form.salario) : null,
    contrato: form.contrato || null,
    puesto: form.puesto || null
  }

  let exito = false
  if (esEdicion.value) {
    exito = await store.actualizarEmpleado(form.id, datos)
  } else {
    exito = await store.crearEmpleado(datos)
  }

  if (exito) {
    cerrarModal()
    filaSeleccionada.value = null
  }
}

function confirmarEliminar() {
  if (!filaSeleccionada.value) return
  modalEliminar.value = true
}

async function eliminarEmpleado() {
  if (!filaSeleccionada.value) return
  const exito = await store.eliminarEmpleado(filaSeleccionada.value.Id_empleado)
  if (exito) {
    modalEliminar.value = false
    filaSeleccionada.value = null
  }
}

function formatearSalario(salario) {
  if (!salario) return '—'
  return `RD$ ${parseFloat(salario).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`
}

onMounted(() => {
  store.cargarEmpleados()
})
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

.modal-content--small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1.5px solid #f0f0ed;
}

.modal-header--danger {
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-header--danger .material-symbols-outlined {
  font-size: 3rem;
  color: #dc2626;
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

.span-full {
  grid-column: 1 / -1;
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

.btn--danger {
  background: #dc2626;
  color: white;
}

.btn--danger:hover {
  background: #b91c1c;
}

.font-mono { font-family: 'Courier New', monospace; }
.text-center { text-align: center; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: #9ca3af; }

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .modal-body {
    padding: 1.5rem;
  }
}
</style>