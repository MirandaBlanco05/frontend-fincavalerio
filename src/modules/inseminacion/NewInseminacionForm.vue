<template>
  <div class="modal-overlay">
    <div class="modal-content">

      <!-- Encabezado -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">{{ modoEdicion ? 'Editar' : 'Nueva' }} Inseminación</h3>
          <p class="modal-subtitle">Complete los detalles técnicos de la inseminación</p>
        </div>
        <button type="button" @click="router.push('/inseminaciones')" class="btn-close">
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
      <form id="form-inseminacion" @submit.prevent="guardar" class="modal-body">

        <div class="form-grid">
          <!-- Veterinario -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">medical_services</span>
              Veterinario
            </label>
            <select v-model="form.id_veterinario" required class="form-select">
              <option value="">Seleccione...</option>
              <option v-for="vet in veterinarians" :key="vet.id_veterinario" :value="vet.id_veterinario">
                {{ vet.nombre }}
              </option>
            </select>
          </div>

          <!-- Ciclo -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">cycle</span>
              Ciclo de Celo
            </label>
            <select v-model="form.id_ciclo" required class="form-select">
              <option value="">Seleccione...</option>
              <option v-for="c in cycles" :key="c.id_ciclo_celo" :value="c.id_ciclo_celo">
                #{{ c.id_ciclo_celo }} - {{ c.bovino?.nombre || 'Bovino' }} ({{ formatDateShort(c.fecha_inicio) }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Fecha -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">event</span>
              Fecha
            </label>
            <input
              v-model="form.fecha"
              type="date"
              required
              class="form-input"
            />
          </div>

          <!-- Tipo Inseminación -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">science</span>
              Tipo Inseminación
            </label>
            <select v-model="form.tipo_inseminacion" required class="form-select">
              <option value="">Seleccione...</option>
              <option value="Artificial">Artificial</option>
              <option value="Monta natural">Monta natural</option>
              <option value="Asistida">Asistida</option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <!-- Resultado / Estatus -->
          <div class="form-group">
            <label class="form-label required">
              <span class="material-symbols-outlined">info</span>
              Estatus
            </label>
            <select v-model="form.resultado" required class="form-select">
              <option value="Pendiente">Pendiente</option>
              <option value="Efectiva">Efectiva</option>
              <option value="Inefectiva">Inefectiva</option>
            </select>
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-footer">
          <button type="button" @click="router.push('/inseminaciones')" class="btn btn--secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="cargando" class="btn btn--primary">
            <span class="material-symbols-outlined">save</span>
            {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar Registro' : 'Guardar Registro') }}
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
import { useCeloStore } from '@/modules/celo/store/celo.store.js'
import { useVeterinarioStore } from '@/modules/veterinario/store/veterinario.store.js'

const router = useRouter()
const route  = useRoute()
const celoStore = useCeloStore()
const vetStore = useVeterinarioStore()

const modoEdicion = computed(() => !!route.params.id)
const cargando    = ref(false)
const errorLocal  = ref('')
const cycles      = ref([])
const veterinarians = ref([])

const form = reactive({
  id_veterinario: '',
  id_ciclo:      '',
  fecha:         '',
  tipo_inseminacion: '',
  resultado:     'Pendiente'
})

onMounted(async () => {
  cargando.value = true
  try {
    // Cargar dependencias
    await Promise.all([
      celoStore.cargarCiclos(),
      vetStore.cargarVeterinarios()
    ])
    cycles.value = celoStore.ciclos
    veterinarians.value = vetStore.veterinarios

    if (modoEdicion.value) {
      const { data } = await api.get(`/inseminacion/listar/${route.params.id}`)
      form.id_veterinario = data.id_veterinario
      form.id_ciclo      = data.id_ciclo
      form.fecha         = data.fecha ? data.fecha.split('T')[0] : ''
      form.tipo_inseminacion = data.tipo_inseminacion
      form.resultado     = data.resultado
    }
  } catch (e) {
    errorLocal.value = 'No se pudieron cargar los datos necesarios.'
    console.error(e)
  } finally {
    cargando.value = false
  }
})

function formatDateShort(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit' })
}

async function guardar() {
  errorLocal.value = ''
  cargando.value   = true

  try {
    const payload = { ...form }

    if (modoEdicion.value) {
      await api.put(`/inseminacion/actualizar/${route.params.id}`, payload)
    } else {
      await api.post('/inseminacion/crear', payload)
    }

    router.push('/inseminaciones')

  } catch (error) {
    console.error('Error al guardar inseminación:', error)
    errorLocal.value = error.response?.data?.error
      || error.response?.data?.mensaje
      || 'Error desconocido en el servidor'
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
.form-select {
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
.form-select:focus {
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