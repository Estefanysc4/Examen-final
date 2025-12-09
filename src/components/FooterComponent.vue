<!--
/**
 * Componente FooterComponent - Pie de página
 * Footer con información de la tienda, enlaces de navegación y datos de contacto
 * Organizado en 3 columnas con información institucional, enlaces y contacto
 * @component FooterComponent
 */
-->
<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Conde Style</h3>
        <p>Tu tienda de moda y ropa con estilo</p>
      </div>
      <div class="footer-section">
        <h3>Enlaces</h3>
        <ul>
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/productos">Productos</router-link></li>
          <li><router-link to="/login">Iniciar Sesión</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Contacto</h3>
        <p>Email: contacto@condestyle.com</p>
        <p>Tel: (123) 456-7890</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; Conde Style. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #333;
  color: white;
  padding: 3rem 2rem 1rem 2rem;
  margin-top: 4rem;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.footer-section p {
  margin: 0.5rem 0;
  color: #ccc;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 0.5rem 0;
}

.footer-section a {
  color: #ccc;
  text-decoration: none;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #555;
  color: #999;
}

.footer-bottom p {
  margin: 0;
}
</style>
