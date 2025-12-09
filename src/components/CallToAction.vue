<!--
/**
 * Componente CallToAction - Llamada a la acción
 * Sección que invita a los usuarios a explorar el catálogo completo de productos
 * Incluye un botón que redirige a la página de productos
 * @component CallToAction
 */
-->
<template>
  <div class="cta-banner">
    <div class="cta-content">
      <h2 class="cta-title">Descubre Toda Nuestra Colección</h2>
      <p class="cta-subtitle">Explora nuestra moda y encuentra tu estilo</p>
      <router-link to="/productos" class="cta-button">Ver Todos los Productos</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.cta-banner {
  background: #f5f5f5;
  padding: 4rem 2rem;
  text-align: center;
  margin: 3rem 0;
}

.cta-content {
  max-width: 1200px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  color: #333;
}

.cta-subtitle {
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  color: #666;
}

.cta-button {
  display: inline-block;
  background: #333;
  color: white;
  text-decoration: none;
  padding: 1.2rem 3rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background 0.3s;
}

.cta-button:hover {
  background: #555;
}
</style>
