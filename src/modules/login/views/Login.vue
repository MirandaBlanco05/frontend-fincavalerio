<template>
  <div class="login-root">

    <!-- Card centrada -->
    <div class="login-card">

      <!-- Panel verde izquierdo -->
      <div class="panel-verde">
        <div class="brand">
          <div class="logo-box-small">
            <img src="@/assets/logo.png" alt="Logo" class="brand-logo-small" />
          </div>
          <span class="brand-text">Finca Valerio</span>
        </div>

        <h2 class="hero-title">Gestión inteligente de tu finca.</h2>
        <p class="hero-desc">
          Optimiza el rendimiento y control de tu propiedad rural con tecnología de 
          vanguardia y análisis en tiempo real.
        </p>

        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">ANIMALES</p>
            <p class="stat-value">{{ totalAnimales !== null ? totalAnimales : '...' }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">HECTÁREAS</p>
            <p class="stat-value">1,420</p>
          </div>
        </div>
      </div>

      <!-- Panel blanco derecho -->
      <div class="panel-blanco">
        <div class="form-wrapper">

          <div class="form-header">
            <h3 class="form-title">Bienvenido</h3>
            <p class="form-subtitle">Ingresa tus credenciales para acceder al panel de control.</p>
          </div>

          <!-- Alerta error -->
          <div v-if="error" class="alert-error">
            <span class="material-symbols-outlined">error</span>
            {{ error }}
          </div>

          <form @submit.prevent="iniciarSesion">

            <!-- Usuario -->
            <div class="form-group">
              <label class="form-label">USUARIO</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">person</span>
                <input 
                  v-model="form.usuario" 
                  type="text" 
                  placeholder="ej. jvalerio"
                  class="form-input"
                  required
                  :disabled="cargando"
                />
              </div>
            </div>

            <!-- Contraseña -->
            <div class="form-group">
              <div class="label-row">
                <label class="form-label">CONTRASEÑA</label>
                <button type="button" class="link-forgot">¿Olvidaste tu contraseña?</button>
              </div>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">lock</span>
                <input 
                  v-model="form.contrasena"
                  :type="mostrarPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="form-input"
                  required
                  :disabled="cargando"
                />
                <button 
                  type="button" 
                  @click="mostrarPassword = !mostrarPassword"
                  class="btn-toggle-password">
                  <span class="material-symbols-outlined">
                    {{ mostrarPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

          
            <!-- Botón -->
            <button type="submit" :disabled="cargando" class="btn-submit">
              <span v-if="cargando" class="spinner"></span>
              {{ cargando ? 'Iniciando...' : 'INICIAR SESIÓN' }}
            </button>

          </form>

          <p class="copyright">© 2024 FINCA VALERIO. TODOS LOS DERECHOS RESERVADOS.</p>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/core/api/axios.js'

const router = useRouter()
const cargando = ref(false)
const error = ref('')
const mostrarPassword = ref(false)
const recordarSesion = ref(false)
const totalAnimales = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/bovino/listar')
    if (Array.isArray(data)) {
      totalAnimales.value = data.length
    }
  } catch (err) {
    console.warn('No se pudo cargar el total de animales:', err)
  }
})

const form = reactive({
  usuario: '',
  contrasena: ''
})

async function iniciarSesion() {
  error.value = ''
  cargando.value = true

  try {
    const { data } = await api.post('/login', {
      usuario: form.usuario,
      contrasena: form.contrasena
    })

    localStorage.setItem('usuario', data.usuario)
    localStorage.setItem('tipo_usuario', data.tipo)

    router.push('/dashboard')

  } catch (err) {
    error.value = err.response?.data?.error || 'Usuario o contraseña incorrectos'
    console.error('Error login:', err)
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%);
  font-family: 'DM Sans', sans-serif;
  padding: 2rem;
}

.login-card {
  display: flex;
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.08),
    0 4px 16px rgba(0,0,0,0.04);
}

/* ── Panel Verde ───────────────────────── */
.panel-verde {
  flex: 1;
  background: linear-gradient(165deg, #2d5a2d 0%, #3d7a3d 50%, #4c9a4c 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  color: white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
}

.logo-box-small {
  background: #fcfcfc;
  border-radius: 8px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.brand-logo-small {
  height: 35px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-size: 1.1rem;
  font-weight: 700;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 3rem;
}

.stat-card {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(8px);
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

/* ── Panel Blanco ──────────────────────── */
.panel-blanco {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  background: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Alerta */
.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.85rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #b91c1c;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.alert-error .material-symbols-outlined {
  font-size: 1.1rem;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #374151;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-forgot {
  font-size: 0.8rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s;
}

.link-forgot:hover {
  color: #4c9a4c;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1.2rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #1a1a1a;
  transition: border-color 0.2s;
  background: #fafafa;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #4c9a4c;
  background: white;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-toggle-password:hover {
  background: #f3f4f6;
  color: #4c9a4c;
}

.btn-toggle-password .material-symbols-outlined {
  font-size: 1.1rem;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4c9a4c;
}

.checkbox-label {
  font-size: 0.85rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
}

/* Botón submit */
.btn-submit {
  width: 100%;
  padding: 0.95rem;
  background: #4c9a4c;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #3d7a3d;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.form-footer {
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 1.5rem;
}

.link-register {
  background: none;
  border: none;
  color: #4c9a4c;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
}

.link-register:hover {
  color: #3d7a3d;
}

.copyright {
  text-align: center;
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 2rem;
  letter-spacing: 0.03em;
}

/* ── Responsive ────────────────────────── */
@media (max-width: 968px) {
  .login-card {
    flex-direction: column;
  }

  .panel-verde {
    padding: 2.5rem 2rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .stats-grid {
    margin-top: 2rem;
  }

  .panel-blanco {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 640px) {
  .login-root {
    padding: 1rem;
  }

  .panel-verde {
    padding: 2rem 1.5rem;
  }

  .panel-blanco {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }
}
</style>