<template>
  <div class="modal-overlay">
    <div class="modal-content">

      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nuevo' }} Proveedor</h3>
          <p class="modal-subtitle">Complete los datos del proveedor</p>
        </div>
        <button type="button" @click="router.push({ name: 'Proveedores' })" class="btn-close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div v-if="errorLocal" style="padding: 1rem 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">
          <span class="material-symbols-outlined">error</span>
          <span>{{ errorLocal }}</span>
        </div>
      </div>

      <form @submit.prevent="guardar" class="modal-body">
        
        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">storefront</span>
            Nombre de la Empresa o Proveedor
          </label>
          <input v-model="form.nombre" type="text" required class="form-input" />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">badge</span>
              RNC
            </label>
            <input v-model="form.rnc" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">phone</span>
              Teléfono
            </label>
            <input v-model="form.telefono" type="tel" required class="form-input" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">category</span>
              Tipo de Proveedor
            </label>
            <input v-model="form.tipo_proveedor" type="text" required class="form-input" placeholder="Ej: Insumos Agrícolas" />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">location_on</span>
              Provincia
            </label>
            <select v-model="form.id_provincia" required class="form-select">
              <option value="">Seleccione...</option>
              <option v-for="p in provincias" :key="p.id_provincia" :value="p.id_provincia">
                {{ p.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">
            <span class="material-symbols-outlined">toggle_on</span>
            Estado
          </label>
          <select v-model="form.estado" required class="form-select">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" @click="router.push({ name: 'Proveedores' })" class="btn btn--secondary">
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
import { useProveedorStore } from '../store/proveedor.store.js'
import api from '@/core/api/axios.js'

const router = useRouter()
const route  = useRoute()
const store  = useProveedorStore()

const modoEdicion = computed(() => !!route.params.id)
const cargando    = ref(false)
const errorLocal  = ref('')
const provincias  = ref([])

const form = reactive({
  nombre: '',
  rnc: '',
  telefono: '',
  tipo_proveedor: '',
  id_provincia: '',
  estado: 'Activo'
})

onMounted(async () => {
  // Cargar provincias
  try {
    const res = await api.get('/provincia/listar')
    provincias.value = res.data || []
  } catch (err) {
    console.error('Error al cargar provincias:', err)
  }

  if (modoEdicion.value) {
    if (store.proveedores.length === 0) {
      await store.cargarProveedores()
    }
    const prov = store.proveedores.find(p => p.id_proveedor == route.params.id)
    if (prov) {
      form.nombre = prov.nombre || ''
      form.rnc = prov.rnc || ''
      form.telefono = prov.telefono || ''
      form.tipo_proveedor = prov.tipo_proveedor || prov.tipo || ''
      form.id_provincia = prov.id_provincia || ''
      form.estado = prov.estado || 'Activo'
    } else {
      errorLocal.value = 'No se pudo encontrar el proveedor.'
    }
  }
})

async function guardar() {
  errorLocal.value = ''
  cargando.value   = true

  try {
    let result
    if (modoEdicion.value) {
      result = await store.actualizarProveedor(route.params.id, { ...form })
    } else {
      result = await store.crearProveedor({ ...form })
    }

    if (result && result.success) {
      router.push({ name: 'Proveedores' })
    } else {
      errorLocal.value = store.error || 'Error al guardar el proveedor'
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
.material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; backdrop-filter: blur(4px); font-family: 'DM Sans', sans-serif; }
.modal-content { background: white; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem 2rem 1.5rem; border-bottom: 1.5px solid #f0f0ed; }
.modal-title { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; margin-bottom: 0.25rem; }
.modal-subtitle { font-size: 0.85rem; color: #6b7280; font-weight: 500; }
.btn-close { padding: 8px; background: transparent; border: none; border-radius: 8px; cursor: pointer; color: #9ca3af; transition: all 0.2s; }
.btn-close:hover { background: #f5f5f5; color: #1a1a1a; }
.modal-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: #374151; }
.form-label .material-symbols-outlined { font-size: 1rem; color: #4c9a4c; }
.form-label.required::after { content: '*'; color: #dc2626; margin-left: 4px; }
.form-input, .form-select { padding: 0.75rem; border: 1.5px solid #e5e7eb; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; transition: all 0.2s; width: 100%; background: white; }
.form-input:focus, .form-select:focus { outline: none; border-color: #4c9a4c; background: #f0f9f0; }
.form-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.modal-footer { display: flex; gap: 12px; padding-top: 1rem; border-top: 1.5px solid #f0f0ed; }
.btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0.85rem; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn--primary { background: #4c9a4c; color: white; }
.btn--primary:hover:not(:disabled) { background: #3d7a3d; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(76, 154, 76, 0.3); }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--secondary { background: #f5f5f5; color: #374151; }
.btn--secondary:hover { background: #e5e7eb; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .modal-body { padding: 1.5rem; } }
</style>
