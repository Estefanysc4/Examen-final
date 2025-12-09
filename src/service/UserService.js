/**
 * Servicio para gestionar operaciones CRUD de usuarios y autenticación
 * Conecta con la API de MockAPI para realizar operaciones de usuarios
 * Utiliza Axios para las peticiones HTTP
 * @module UserService
 */

import axios from 'axios'

const API_URL = 'https://69374c69f8dc350aff33e5a4.mockapi.io/api/v1/users'

export const UserService = {
  /**
   * Obtiene todos los usuarios registrados
   * @returns {Promise<Array>} Array de objetos de usuarios
   * @throws {Error} Si la petición falla
   */
  async getAll() {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      console.error('Error en getAll:', error)
      throw error
    }
  },

  /**
   * Obtiene un usuario específico por su ID
   * @param {string|number} id - ID del usuario a buscar
   * @returns {Promise<Object>} Objeto del usuario encontrado
   * @throws {Error} Si el usuario no existe o la petición falla
   */
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error en getById:', error)
      throw error
    }
  },

  /**
   * Crea un nuevo usuario en el sistema
   * @param {Object} user - Objeto con los datos del usuario
   * @param {string} user.username - Nombre de usuario
   * @param {string} user.password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario creado con su ID asignado
   * @throws {Error} Si la creación falla
   */
  async create(user) {
    try {
      const response = await axios.post(API_URL, user)
      return response.data
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  },

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario a actualizar
   * @param {Object} user - Objeto con los datos actualizados del usuario
   * @returns {Promise<Object>} Usuario actualizado
   * @throws {Error} Si la actualización falla
   */
  async update(id, user) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, user)
      return response.data
    } catch (error) {
      console.error('Error en update:', error)
      throw error
    }
  },

  /**
   * Elimina un usuario del sistema
   * @param {string|number} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Usuario eliminado
   * @throws {Error} Si la eliminación falla
   */
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error en delete:', error)
      throw error
    }
  },

  /**
   * Autentica un usuario verificando sus credenciales
   * Busca el usuario por nombre de usuario o email y valida la contraseña
   * @param {string} username - Nombre de usuario o email
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario autenticado con sus datos
   * @throws {Error} Si las credenciales son inválidas
   */
  async login(username, password) {
    try {
      const users = await this.getAll()
      const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password
      )
      if (!user) throw new Error('Credenciales inválidas')
      return user
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }
}
