<!--
/**
 * Componente ProductCard - Tarjeta de producto
 * Muestra la información de un producto con imagen, nombre, descripción y precio
 * Renderiza botones diferentes según el rol: "Comprar" para usuarios regulares,
 * "Editar" y "Eliminar" para administradores
 * @component ProductCard
 * @prop {Object} product - Datos del producto (name, price, description, image, id)
 * @prop {Boolean} isAdmin - Si el usuario actual es administrador
 * @emits buy - Emitido al hacer clic en Comprar (pasa el objeto product)
 * @emits edit - Emitido al hacer clic en Editar (pasa el objeto product)
 * @emits delete - Emitido al hacer clic en Eliminar (pasa el id del producto)
 */
-->
<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <span class="product-price">${{ product.price }}</span>
      </div>
      <button v-if="!isAdmin" @click="$emit('buy', product)" class="btn-buy">Comprar</button>
      <div v-else class="admin-actions">
        <button @click="$emit('edit', product)" class="btn-edit">Editar</button>
        <button @click="$emit('delete', product.id)" class="btn-delete">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

defineEmits(['buy', 'edit', 'delete'])
</script>

<style scoped>
.product-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.product-description {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.btn-buy {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background: #333;
  color: white;
}

.btn-buy:hover {
  background: #555;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-edit {
  background: #333;
  color: white;
}

.btn-edit:hover {
  background: #555;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}
</style>