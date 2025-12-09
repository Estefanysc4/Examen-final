<!--
/**
 * Componente BanerHome - Banner principal de la página de inicio
 * Banner llamativo con gradiente oscuro que destaca precios especiales
 * Se muestra en la parte superior de la página Home
 * @component BanerHome
 */
-->
<template>
  <div class="banner">
    <div class="banner-content">
      <h1 class="banner-title">PRECIOS ESPECIALES</h1>
      <p class="banner-subtitle">Ropa de moda con ofertas increíbles</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 0rem;
  margin-top: 4rem;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
}

.banner-title {
  font-size: 4rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 1.5rem;
  margin: 0;
  opacity: 0.9;
}
</style>