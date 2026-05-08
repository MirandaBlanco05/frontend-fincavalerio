<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay-filtros" @click.self="cerrar">
      <div class="modal-filtros-container">
        <!-- Header -->
        <div class="modal-filtros-header">
          <h3 class="modal-filtros-title">{{ title }}</h3>
          <button @click="cerrar" class="modal-filtros-close">✕</button>
        </div>
        
        <!-- Body -->
        <div class="modal-filtros-body">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div class="modal-filtros-footer">
          <button @click="$emit('limpiar')" class="btn-limpiar">Limpiar</button>
          <button @click="$emit('aplicar')" class="btn-aplicar">Aplicar Filtros</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Filtrar' }
})

const emit = defineEmits(['update:modelValue', 'aplicar', 'limpiar'])

function cerrar() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay-filtros {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-filtros-container {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-filtros-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-filtros-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-filtros-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.modal-filtros-close:hover {
  background: #f3f4f6;
}

.modal-filtros-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-filtros-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-limpiar,
.btn-aplicar {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-limpiar {
  background: #f3f4f6;
  color: #374151;
}

.btn-limpiar:hover {
  background: #e5e7eb;
}

.btn-aplicar {
  background: #10b981;
  color: white;
}

.btn-aplicar:hover {
  background: #059669;
}

/* Estilos para inputs dentro del modal */
.modal-filtros-body :deep(label) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.modal-filtros-body :deep(input),
.modal-filtros-body :deep(select) {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.modal-filtros-body :deep(input:focus),
.modal-filtros-body :deep(select:focus) {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>