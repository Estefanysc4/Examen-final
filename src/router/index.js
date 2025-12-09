/**
 * Configuración de Vue Router para la aplicación Conde Style
 * Define las rutas principales y protege rutas que requieren autenticación
 * @module router
 */

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Users from '../views/Users.vue'

/**
 * Definición de rutas de la aplicación
 * @type {Array<Object>}
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/productos',
    name: 'Products',
    component: Products
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true } // Ruta protegida: requiere autenticación
  }
]

/**
 * Instancia del router con historial web
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Guardia de navegación global
 * Protege rutas con meta.requiresAuth verificando la existencia de usuario en localStorage
 * Redirige a /login si no hay sesión activa
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = localStorage.getItem('user')
    if (!user) {
      // No hay sesión activa, redirigir al login
      next('/login')
    } else {
      // Usuario autenticado, permitir acceso
      next()
    }
  } else {
    // Ruta pública, permitir acceso
    next()
  }
})

export default router
