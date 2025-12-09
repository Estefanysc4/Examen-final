<!--
/**
 * Vista Products - Catálogo completo de productos
 * Muestra todos los productos disponibles con funcionalidad de compra para usuarios
 * y CRUD completo (crear, editar, eliminar) para administradores
 * @component Products
 */
-->
<template>
  <div>
    <HeaderNav />
    
    <main class="main-content">
      <div class="header-section">
        <h2>Todos los Productos</h2>
        <button v-if="userRole === 'admin'" @click="showCreateModal" class="btn btn-dark">Crear Producto</button>
      </div>
      <div v-if="loading" class="text-center py-4">Cargando productos...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in products" 
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
    <div v-if="showEditModal" class="modal d-block" style="background: rgba(0,0,0,0.5);" @click.self="closeEditForm">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingProduct ? 'Editar Producto' : 'Crear Producto' }}</h5>
            <button type="button" class="btn-close" @click="closeEditForm"></button>
          </div>
          <form @submit.prevent="saveProduct">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input v-model="form.price" type="number" step="0.01" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea v-model="form.description" rows="3" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">URL de Imagen</label>
                <input v-model="form.image" type="text" class="form-control" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancelar</button>
              <button type="submit" class="btn btn-dark">Guardar</button>
            </div>
          </form>
        </div>
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

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import ProductCard from '../components/ProductCard.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { ProductsService } from '../service/ProductsService.js'

// Estado de productos
const products = ref([]) // Lista completa de productos
const loading = ref(false) // Indicador de carga
const error = ref(null) // Mensaje de error

// Estado de usuario
const userRole = ref('') // Rol del usuario actual
const componentKey = ref(0) // Clave para forzar re-renderizado

// Estado de modales
const showEditModal = ref(false) // Modal de crear/editar
const showConfirmModal = ref(false) // Modal de confirmación
const showAlertModal = ref(false) // Modal de alerta
const confirmMessage = ref('') // Mensaje de confirmación
const alertMessage = ref('') // Mensaje de alerta
const pendingAction = ref(null) // Acción pendiente

// Estado del formulario
const editingProduct = ref(null) // Producto en edición (null si es creación)
const form = ref({
  name: '',
  price: '',
  description: '',
  image: ''
})

/**
 * Computed property para verificar si el usuario es administrador
 */
const isAdmin = computed(() => userRole.value === 'admin')

/**
 * Verifica el rol del usuario desde localStorage
 */
const checkAdmin = () => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    // Detectar admin por role o por username
    userRole.value = userData.role || (userData.username === 'admin' ? 'admin' : '')
  } else {
    userRole.value = ''
  }
  componentKey.value++ // Forzar recarga de componentes
}

/**
 * Carga todos los productos desde la API
 */
const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    products.value = await ProductsService.getAll()
  } catch (err) {
    error.value = 'Error al cargar los productos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * Maneja la compra de un producto
 * @param {Object} product - Producto a comprar
 */
const handleBuy = (product) => {
  console.log('Comprar producto:', product)
  showAlert(`Producto "${product.name}" agregado al carrito`)
}

/**
 * Abre el modal de edición con los datos del producto
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
 * Solicita confirmación antes de eliminar un producto
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
 * Guarda el producto (crea uno nuevo o actualiza existente)
 */
const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await ProductsService.update(editingProduct.value.id, form.value)
      showAlert('Producto actualizado exitosamente')
    } else {
      await ProductsService.create(form.value)
      showAlert('Producto creado exitosamente')
    }
    await loadProducts()
    closeEditForm()
  } catch (err) {
    showAlert('Error al guardar producto')
    console.error(err)
  }
}

/**
 * Abre el modal para crear un nuevo producto
 */
const showCreateModal = () => {
  editingProduct.value = null
  form.value = {
    name: '',
    price: '',
    description: '',
    image: ''
  }
  showEditModal.value = true
}

/**
 * Cierra el modal de edición/creación y limpia el formulario
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
 * Ejecuta la acción pendiente tras confirmación
 */
const confirmAction = () => {
  showConfirmModal.value = false
  if (pendingAction.value) {
    pendingAction.value()
    pendingAction.value = null
  }
}

/**
 * Cancela la acción pendiente
 */
const cancelDelete = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}

/**
 * Muestra un mensaje de alerta
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

// Ciclo de vida: cargar datos al montar el componente
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-section h2 {
  margin: 0;
}

.btn-create {
  background: #333;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-create:hover {
  background: #555;
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