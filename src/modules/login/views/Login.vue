<template>
  <div class="login-root">

    <!-- Panel izquierdo: visual -->
    <div class="panel-left">
      <div class="panel-left__overlay"></div>

      <!-- Círculos decorativos -->
      <div class="deco-circles">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>

      <!-- Brand arriba -->
      <div class="brand">
        <span class="material-symbols-outlined brand__icon">grass</span>
        <span class="brand__name">Finca Valerio</span>
      </div>

      <!-- Headline centro -->
      <div class="panel-left__headline">
        <h1>Gestión<br/>inteligente<br/>de tu finca.</h1>
        <p>Control total de bovinos, producción,<br/>visitas veterinarias y más.</p>
      </div>

      <!-- Stats abajo -->
      <div class="stats-row">
        <div class="stat">
          <span class="stat__num">256</span>
          <span class="stat__label">Animales</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat__num">98%</span>
          <span class="stat__label">Supervivencia</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat__num">42</span>
          <span class="stat__label">Nacimientos</span>
        </div>
      </div>
    </div>

    <!-- Panel derecho: formulario -->
    <div class="panel-right">
      <div class="form-wrapper">

        <!-- Logo mobile -->
        <div class="brand brand--mobile">
          <span class="material-symbols-outlined brand__icon brand__icon--green">grass</span>
          <span class="brand__name brand__name--dark">Finca Valerio</span>
        </div>

        <div class="form-header">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert-error">
          <span class="material-symbols-outlined">error</span>
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="form" novalidate>

          <!-- Usuario -->
          <div class="field" :class="{ 'field--error': errors.usuario, 'field--focus': focus.usuario }">
            <label for="usuario">Usuario</label>
            <div class="field__input-wrap">
              <span class="material-symbols-outlined field__icon">person</span>
              <input
                id="usuario"
                v-model="form.usuario"
                type="text"
                placeholder="Tu nombre de usuario"
                autocomplete="username"
                @focus="focus.usuario = true"
                @blur="focus.usuario = false"
              />
            </div>
            <span v-if="errors.usuario" class="field__msg">{{ errors.usuario }}</span>
          </div>

          <!-- Contraseña -->
          <div class="field" :class="{ 'field--error': errors.contrasena, 'field--focus': focus.contrasena }">
            <label for="contrasena">Contraseña</label>
            <div class="field__input-wrap">
              <span class="material-symbols-outlined field__icon">lock</span>
              <input
                id="contrasena"
                v-model="form.contrasena"
                :type="showPass ? 'text' : 'password'"
                placeholder="Tu contraseña"
                autocomplete="current-password"
                @focus="focus.contrasena = true"
                @blur="focus.contrasena = false"
              />
              <button type="button" class="field__toggle" @click="showPass = !showPass" tabindex="-1">
                <span class="material-symbols-outlined">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <span v-if="errors.contrasena" class="field__msg">{{ errors.contrasena }}</span>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :disabled="cargando">
            <span v-if="!cargando" class="btn-submit__content">
              <span>Ingresar</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </span>
            <span v-else class="btn-submit__spinner"></span>
          </button>

        </form>

        <p class="form-footer">
          ¿Problemas para ingresar? Contacta al administrador.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/core/api/axios.js'

const router = useRouter()

const form      = reactive({ usuario: '', contrasena: '' })
const errors    = reactive({ usuario: '', contrasena: '' })
const focus     = reactive({ usuario: false, contrasena: false })
const error     = ref('')
const cargando  = ref(false)
const showPass  = ref(false)

function validar() {
  errors.usuario   = ''
  errors.contrasena = ''
  let ok = true
  if (!form.usuario.trim())   { errors.usuario   = 'El usuario es obligatorio';   ok = false }
  if (!form.contrasena.trim()){ errors.contrasena = 'La contraseña es obligatoria'; ok = false }
  return ok
}

async function handleLogin() {
  error.value = ''
  if (!validar()) return
  cargando.value = true
  try {
    const { data } = await api.post('/login', {
      Usuario: form.usuario,
      Contrasena: form.contrasena
    })
    localStorage.setItem('usuario',      data.usuario)
    localStorage.setItem('tipo_usuario', data.tipo)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al iniciar sesión'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
}

/* ── Root layout ──────────────────────────── */
.login-root {
  display: flex;
  min-height: 100dvh;
  font-family: 'Manrope', sans-serif;
}

/* ── Panel izquierdo ──────────────────────── */
.panel-left {
  position: relative;
  flex: 0 0 52%;
  background: linear-gradient(155deg, #1a3a1a 0%, #2d5a2d 45%, #4c9a4c 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  min-height: 100dvh;
}

.panel-left__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 15% 15%, rgba(76,154,76,0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 85%, rgba(110,66,12,0.2)  0%, transparent 50%);
  pointer-events: none;
}

/* Círculos decorativos */
.deco-circles { position: absolute; inset: 0; pointer-events: none; }
.circle { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.07); }
.c1 { width: 500px; height: 500px; top: -160px; right: -160px; }
.c2 { width: 300px; height: 300px; top: -60px;  right: -60px;  border-color: rgba(255,255,255,0.11); }
.c3 { width: 200px; height: 200px; bottom: 100px; left: -70px; }

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.brand__icon {
  font-size: 1.9rem;
  color: #a8d5a8;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.brand__icon--green  { color: #4c9a4c; }

.brand__name {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.brand__name--dark { color: #1a1a1a; }

.brand--mobile { display: none; }

/* Headline */
.panel-left__headline {
  position: relative;
  z-index: 1;
}

.panel-left__headline h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.4rem, 3.8vw, 3.4rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 1.1rem;
  letter-spacing: -0.02em;
}

.panel-left__headline p {
  font-size: 0.93rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  font-weight: 500;
}

/* Stats */
.stats-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
}

.stat { display: flex; flex-direction: column; gap: 3px; }

.stat__num {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat__label {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-divider {
  width: 1px;
  height: 34px;
  background: rgba(255,255,255,0.15);
  flex-shrink: 0;
}

/* ── Panel derecho ────────────────────────── */
.panel-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fafaf8;
}

.form-wrapper { width: 100%; max-width: 420px; }

.form-header { margin-bottom: 2rem; }

.form-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.1rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.form-header p {
  font-size: 0.88rem;
  color: #6b7280;
  font-weight: 500;
}

/* Alert error */
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.83rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.2rem;
}
.alert-error .material-symbols-outlined { font-size: 1rem; }

/* Form */
.form { display: flex; flex-direction: column; gap: 1.2rem; }

/* Field */
.field { display: flex; flex-direction: column; gap: 6px; }

.field label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.field__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field__icon {
  position: absolute;
  left: 14px;
  font-size: 1rem;
  color: #b0b8c1;
  pointer-events: none;
  transition: color 0.2s;
}

.field__input-wrap input {
  width: 100%;
  padding: 0.85rem 3rem 0.85rem 2.75rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.875rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.88rem;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field__input-wrap input::placeholder { color: #d1d5db; }

.field--focus .field__input-wrap input {
  border-color: #4c9a4c;
  box-shadow: 0 0 0 3px rgba(76,154,76,0.1);
}
.field--focus .field__icon { color: #4c9a4c; }

.field--error .field__input-wrap input {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
}

.field__msg {
  font-size: 0.73rem;
  font-weight: 600;
  color: #ef4444;
  padding-left: 4px;
}

.field__toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #b0b8c1;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}
.field__toggle:hover { color: #4c9a4c; }
.field__toggle .material-symbols-outlined { font-size: 1rem; }

/* Submit */
.btn-submit {
  margin-top: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4c9a4c 0%, #3d7a3d 100%);
  color: white;
  border: none;
  border-radius: 0.875rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 14px rgba(76,154,76,0.3);
  overflow: hidden;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(76,154,76,0.4);
}
.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.btn-submit__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-submit__content .material-symbols-outlined { font-size: 1rem; }

.btn-submit__spinner {
  display: block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.76rem;
  color: #9ca3af;
  font-weight: 500;
}

/* ── Responsive ───────────────────────────── */
@media (max-width: 768px) {
  .login-root { flex-direction: column; }
  .panel-left  { display: none; }
  .panel-right { background: #fff; min-height: 100dvh; padding: 2.5rem 1.5rem; }
  .brand--mobile { display: flex; margin-bottom: 2rem; }
}
</style>
