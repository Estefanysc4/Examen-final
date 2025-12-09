<!--
/**
 * Componente HeaderNav - Navegación principal
 * Barra de navegación fija en la parte superior con links a las páginas principales
 * Muestra estado de sesión, nombre de usuario y opciones de login/logout
 * Condiciona la visibilidad del link "Usuarios" solo para usuarios autenticados
 * @component HeaderNav
 */
-->
<template>
  <header class="header">
    <div class="header-content">
      <div class="left-section">
        <h1 class="store-name">Conde Style</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <router-link to="/productos" class="nav-link">Productos</router-link>
          <router-link v-if="isLoggedIn" to="/users" class="nav-link">Usuarios</router-link>
        </nav>
      </div>
      <div class="right-section">
        <span v-if="isLoggedIn" class="user-name">Hola, {{ userName }}</span>
        <button v-if="isLoggedIn" @click="logout" class="btn-logout">Cerrar Sesión</button>
        <router-link v-else to="/login" class="btn-login">Iniciar Sesión</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado de autenticación y usuario
const isAdmin = ref(false) // Si el usuario actual es administrador
const isLoggedIn = ref(false) // Si hay una sesión activa
const userName = ref('') // Nombre del usuario actual

/**
 * Verifica el estado de autenticación del usuario desde localStorage
 * Actualiza el estado de admin, login y nombre de usuario
 */
const checkUserStatus = () => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    isLoggedIn.value = true
    userName.value = userData.name || userData.username
    // Detectar admin por role o por username
    isAdmin.value = userData.role === 'admin' || userData.username === 'admin'
  } else {
    isLoggedIn.value = false
    userName.value = ''
    isAdmin.value = false
  }
}

/**
 * Cierra la sesión del usuario actual
 * Elimina datos de localStorage, actualiza estado y redirige al inicio
 */
const logout = () => {
  localStorage.removeItem('user')
  checkUserStatus()
  router.push('/').then(() => {
    window.location.reload()
  })
}

// Ciclo de vida: verificar sesión al montar componente
onMounted(() => {
  checkUserStatus()
  // Escuchar cambios en el storage para actualizar el estado
  window.addEventListener('storage', checkUserStatus)
})

// Exponer la función para que pueda ser llamada desde otros componentes
defineExpose({ checkUserStatus })
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem 2rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.store-name {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 2px;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.nav-link:hover {
  color: #666;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #333;
  font-weight: 500;
}

.btn-login,
.btn-logout {
  background: #333;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-login:hover,
.btn-logout:hover {
  background: #555;
}
</style>