<!--
/**
 * Vista de Login - Autenticación de usuarios
 * Permite a los usuarios iniciar sesión con su nombre de usuario y contraseña
 * Almacena la sesión en localStorage y redirige a la página principal
 * @component Login
 */
-->
<template>
  <div class="login-container">
    <div class="login-card shadow">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <div class="mb-3">
          <label class="form-label">Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-control"
            placeholder="admin"
            required
            :disabled="loading"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control"
            placeholder="123"
            required
            :disabled="loading"
          />
        </div>
        <button type="submit" class="btn btn-dark w-100" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserService } from '../service/UserService.js'

const router = useRouter()

// Estado del formulario
const username = ref('') // Nombre de usuario ingresado
const password = ref('') // Contraseña ingresada
const error = ref('') // Mensaje de error para mostrar al usuario
const loading = ref(false) // Indicador de carga durante la petición

/**
 * Maneja el proceso de inicio de sesión
 * Valida los campos, autentica con la API y guarda la sesión en localStorage
 */
const handleLogin = async () => {
  // Validación básica de campos
  if (!username.value || !password.value) {
    error.value = 'Por favor complete todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Intentar autenticar con el servicio de usuarios
    const user = await UserService.login(username.value, password.value)
    
    // Guardar sesión en localStorage
    localStorage.setItem('user', JSON.stringify(user))
    
    // Disparar evento para que el header se actualice
    window.dispatchEvent(new Event('storage'))
    
    // Redirigir a la página principal
    router.push('/')
  } catch (err) {
    // Mostrar mensaje de error al usuario
    error.value = 'Usuario o contraseña incorrectos'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: white;
}

.login-card {
  background: white;
  padding: 3rem 4rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 450px;
}
</style>