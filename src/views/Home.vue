<!--
/**
 * Vista Home - Página principal de la tienda
 * Muestra los 3 productos más vendidos con funcionalidad de compra para usuarios
 * y edición/eliminación para administradores
 * @component Home
 */
-->
<template>
  <div>
    <HeaderNav />
    <BanerHome />
    
    <main class="main-content">
      <h2>Lo Más Vendido</h2>
      <div v-if="loading" class="loading">Cargando productos...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in featuredProducts" 
          :key="product.id + '-' + componentKey"
          :product="product"
          :isAdmin="userRole === 'admin'"
          @buy="handleBuy"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </main>

    <!-- Modal para editar producto -->
    <div v-if="showEditModal" class="modal" @click.self="closeEditForm">
      <div class="modal-content">
        <h3>Editar Producto</h3>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Precio</label>
            <input v-model="form.price" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="form.description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>URL de Imagen</label>
            <input v-model="form.image" type="text" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-save">Guardar</button>
            <button type="button" @click="closeEditForm" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showConfirmModal" class="modal" @click.self="cancelDelete">
      <div class="modal-content confirm-modal">
        <h3>{{ confirmMessage }}</h3>
        <div class="form-actions">
          <button @click="confirmAction" class="btn-save">Confirmar</button>
          <button @click="cancelDelete" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de alerta -->
    <div v-if="showAlertModal" class="modal" @click.self="closeAlert">
      <div class="modal-content alert-modal">
        <h3>{{ alertMessage }}</h3>
        <button @click="closeAlert" class="btn-save">Aceptar</button>
      </div>
    </div>

    <CallToAction />
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import BanerHome from '../components/BanerHome.vue'
import ProductCard from '../components/ProductCard.vue'
import CallToAction from '../components/CallToAction.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { ProductsService } from '../service/ProductsService.js'

// Estado de productos
const products = ref([]) // Todos los productos
const featuredProducts = ref([]) // Los 3 productos destacados
const loading = ref(false) // Indicador de carga
const error = ref(null) // Mensaje de error

// Estado de usuario y autenticación
const userRole = ref('') // Rol del usuario actual
const componentKey = ref(0) // Clave para forzar re-renderizado de componentes

// Estado de modales
const showEditModal = ref(false) // Mostrar modal de edición
const showConfirmModal = ref(false) // Mostrar modal de confirmación
const showAlertModal = ref(false) // Mostrar modal de alerta
const confirmMessage = ref('') // Mensaje del modal de confirmación
const alertMessage = ref('') // Mensaje del modal de alerta
const pendingAction = ref(null) // Acción pendiente a ejecutar tras confirmación

// Estado del formulario de edición
const editingProduct = ref(null) // Producto siendo editado
const form = ref({
  name: '',
  price: '',
  description: '',
  image: ''
})

/**
 * Computed property que determina si el usuario actual es administrador
 */
const isAdmin = computed(() => {
  console.log('isAdmin computed, userRole:', userRole.value)
  return userRole.value === 'admin'
})

// Observar cambios en el estado de admin
watch(isAdmin, (newVal) => {
  console.log('isAdmin changed to:', newVal)
})

/**
 * Verifica si el usuario actual tiene rol de administrador
 * Detecta admin tanto por campo 'role' como por username === 'admin'
 */
const checkAdmin = () => {
  const user = localStorage.getItem('user')
  console.log('checkAdmin called, user:', user)
  if (user) {
    const userData = JSON.parse(user)
    console.log('userData:', userData)
    // Detectar admin por role o por username
    userRole.value = userData.role || (userData.username === 'admin' ? 'admin' : '')
  } else {
    userRole.value = ''
  }
  componentKey.value++ // Forzar recarga de componentes
}

/**
 * Carga los productos desde la API y selecciona los 3 primeros como destacados
 */
const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    products.value = await ProductsService.getAll()
    featuredProducts.value = products.value.slice(0, 3)
  } catch (err) {
    error.value = 'Error al cargar los productos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * Maneja el evento de compra de un producto
 * @param {Object} product - Producto a comprar
 */
const handleBuy = (product) => {
  console.log('Comprar producto:', product)
  showAlert(`Producto "${product.name}" agregado al carrito`)
}

/**
 * Abre el modal de edición con los datos del producto seleccionado
 * @param {Object} product - Producto a editar
 */
const handleEdit = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image
  }
  showEditModal.value = true
}

/**
 * Muestra confirmación antes de eliminar un producto
 * @param {string|number} id - ID del producto a eliminar
 */
const handleDelete = (id) => {
  confirmMessage.value = '¿Estás seguro de eliminar este producto?'
  pendingAction.value = async () => {
    try {
      await ProductsService.delete(id)
      await loadProducts()
    } catch (err) {
      showAlert('Error al eliminar producto')
      console.error(err)
    }
  }
  showConfirmModal.value = true
}

/**
 * Guarda los cambios del producto editado
 */
const saveProduct = async () => {
  try {
    await ProductsService.update(editingProduct.value.id, form.value)
    await loadProducts()
    closeEditForm()
    showAlert('Producto actualizado exitosamente')
  } catch (err) {
    showAlert('Error al actualizar producto')
    console.error(err)
  }
}

/**
 * Cierra el modal de edición y limpia el formulario
 */
const closeEditForm = () => {
  showEditModal.value = false
  editingProduct.value = null
  form.value = {
    name: '',
    price: '',
    description: '',
    image: ''
  }
}

/**
 * Ejecuta la acción pendiente tras confirmación del usuario
 */
const confirmAction = () => {
  showConfirmModal.value = false
  if (pendingAction.value) {
    pendingAction.value()
    pendingAction.value = null
  }
}

/**
 * Cancela la acción pendiente y cierra el modal de confirmación
 */
const cancelDelete = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}

/**
 * Muestra un mensaje de alerta al usuario
 * @param {string} message - Mensaje a mostrar
 */
const showAlert = (message) => {
  alertMessage.value = message
  showAlertModal.value = true
}

/**
 * Cierra el modal de alerta
 */
const closeAlert = () => {
  showAlertModal.value = false
}

// Ciclo de vida: al montar el componente
onMounted(() => {
  checkAdmin()
  loadProducts()
  // Escuchar cambios en el storage para actualizar el estado
  window.addEventListener('storage', checkAdmin)
})
</script>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem;
}

h2 {
  margin-bottom: 2rem;
  color: #333;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-save {
  background: #333;
  color: white;
}

.btn-save:hover {
  background: #555;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.confirm-modal,
.alert-modal {
  text-align: center;
}

.confirm-modal h3,
.alert-modal h3 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.2rem;
}

.alert-modal button {
  width: 100%;
}
</style>