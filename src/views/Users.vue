<!--
/**
 * Vista Users - Gestión de usuarios
 * Panel administrativo para realizar operaciones CRUD sobre usuarios
 * Solo accesible para usuarios autenticados (protegido por router guard)
 * @component Users
 */
-->
<template>
  <div>
    <HeaderNav />
    
    <main class="main-content">
      <h2>Gestión de Usuarios</h2>
      
      <button @click="showCreateForm = true" class="btn btn-dark mb-3">Crear Usuario</button>
      
      <div v-if="loading" class="text-center py-4">Cargando usuarios...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      
      <table v-else class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.password }}</td>
            <td>
              <button @click="editUser(user)" class="btn btn-sm btn-dark me-2">Editar</button>
              <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para crear/editar -->
      <div v-if="showCreateForm" class="modal d-block" style="background: rgba(0,0,0,0.5);" @click.self="closeForm">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}</h5>
              <button type="button" class="btn-close" @click="closeForm"></button>
            </div>
            <form @submit.prevent="saveUser">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Usuario</label>
                  <input v-model="form.username" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input v-model="form.password" type="password" class="form-control" :required="!editingUser" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeForm">Cancelar</button>
                <button type="submit" class="btn btn-dark">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="showConfirmModal" class="modal d-block" style="background: rgba(0,0,0,0.5);" @click.self="cancelDelete">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center py-4">
              <h5>{{ confirmMessage }}</h5>
            </div>
            <div class="modal-footer">
              <button @click="cancelDelete" class="btn btn-secondary">Cancelar</button>
              <button @click="confirmAction" class="btn btn-dark">Confirmar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de alerta -->
      <div v-if="showAlertModal" class="modal d-block" style="background: rgba(0,0,0,0.5);" @click.self="closeAlert">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center py-4">
              <h5>{{ alertMessage }}</h5>
            </div>
            <div class="modal-footer">
              <button @click="closeAlert" class="btn btn-dark w-100">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { UserService } from '../service/UserService.js'

// Estado de usuarios
const users = ref([]) // Lista de todos los usuarios
const loading = ref(false) // Indicador de carga
const error = ref(null) // Mensaje de error

// Estado de modales
const showCreateForm = ref(false) // Modal de crear/editar usuario
const showConfirmModal = ref(false) // Modal de confirmación
const showAlertModal = ref(false) // Modal de alerta
const confirmMessage = ref('') // Mensaje de confirmación
const alertMessage = ref('') // Mensaje de alerta
const pendingAction = ref(null) // Acción pendiente

// Estado del formulario
const editingUser = ref(null) // Usuario en edición (null si es creación)
const form = ref({
  username: '',
  password: ''
})

/**
 * Carga todos los usuarios desde la API
 */
const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    users.value = await UserService.getAll()
  } catch (err) {
    error.value = 'Error al cargar usuarios'
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * Abre el modal de edición con los datos del usuario
 * @param {Object} user - Usuario a editar
 */
const editUser = (user) => {
  editingUser.value = user
  form.value = {
    username: user.username,
    password: ''
  }
  showCreateForm.value = true
}

/**
 * Solicita confirmación antes de eliminar un usuario
 * @param {string|number} id - ID del usuario a eliminar
 */
const deleteUser = (id) => {
  confirmMessage.value = '¿Estás seguro de eliminar este usuario?'
  pendingAction.value = async () => {
    try {
      await UserService.delete(id)
      await loadUsers()
      showAlert('Usuario eliminado exitosamente')
    } catch (err) {
      showAlert('Error al eliminar usuario')
      console.error(err)
    }
  }
  showConfirmModal.value = true
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

/**
 * Guarda el usuario (crea uno nuevo o actualiza existente)
 */
const saveUser = async () => {
  try {
    if (editingUser.value) {
      await UserService.update(editingUser.value.id, form.value)
      showAlert('Usuario actualizado exitosamente')
    } else {
      await UserService.create(form.value)
      showAlert('Usuario creado exitosamente')
    }
    await loadUsers()
    closeForm()
  } catch (err) {
    showAlert('Error al guardar usuario')
    console.error(err)
  }
}

/**
 * Cierra el modal de crear/editar y limpia el formulario
 */
const closeForm = () => {
  showCreateForm.value = false
  editingUser.value = null
  form.value = {
    username: '',
    password: ''
  }
}

// Ciclo de vida: cargar usuarios al montar el componente
onMounted(() => {
  loadUsers()
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

.btn-create {
  background: #333;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2rem;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #ddd;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.users-table tbody tr:hover {
  background: #f9f9f9;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
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
.form-group select {
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