<template>
  <div class="dashboard">
    <!-- Bienvenida -->
    <div class="welcome-banner card">
      <div class="welcome-content">
        <h1>Bienvenido, Administrador 👋</h1>
        <p>Sistema de gestión de Finca Valerio. Seleccione un módulo para comenzar.</p>
      </div>
      <div class="welcome-icon">🐄</div>
    </div>

    <!-- Tarjetas de módulos -->
    <div class="modules-grid">
      <RouterLink to="/bovinos" class="module-card">
        <div class="module-icon">🐄</div>
        <div class="module-info">
          <h3>Bovinos</h3>
          <p>Registro y gestión del ganado</p>
        </div>
        <div class="module-arrow">→</div>
      </RouterLink>

      <RouterLink to="/visitas" class="module-card">
        <div class="module-icon">🩺</div>
        <div class="module-info">
          <h3>Visitas Veterinarias</h3>
          <p>Control de visitas y tratamientos</p>
        </div>
        <div class="module-arrow">→</div>
      </RouterLink>
      <RouterLink to="/ciclos" class="module-card">
  <div class="module-icon">🔄</div>
  <div class="module-info">
    <h3>Ciclo Celo</h3>
    <p>Control y seguimiento del ciclo reproductivo</p>
  </div>
  <div class="module-arrow">→</div>
</RouterLink>
    </div>
  </div>
</template>

<script setup>
// Dashboard sin lógica adicional por ahora
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ─ Banner ─ */
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-soft) 100%);
  border: none;
  color: white;
}

.welcome-content h1 {
  color: white;
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.welcome-content p {
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
}

.welcome-icon {
  font-size: 4rem;
  opacity: 0.6;
}

/* ─ Módulos ─ */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.module-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.module-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.module-icon {
  font-size: 2.2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
  border-radius: 12px;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
}

.module-info h3 {
  margin-bottom: 4px;
  font-size: 1rem;
}

.module-info p {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.module-arrow {
  font-size: 1.2rem;
  color: var(--text-muted);
  transition: var(--transition);
}

.module-card:hover .module-arrow {
  color: var(--color-primary);
  transform: translateX(4px);
}
</style>