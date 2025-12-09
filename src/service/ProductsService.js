/**
 * Servicio para gestionar operaciones CRUD de productos
 * Conecta con la API de MockAPI para realizar operaciones de productos
 * Utiliza Axios para las peticiones HTTP
 * @module ProductsService
 */

import axios from 'axios'

const API_URL = 'https://69374c69f8dc350aff33e5a4.mockapi.io/api/v1/products'

export const ProductsService = {
  /**
   * Obtiene todos los productos disponibles
   * @returns {Promise<Array>} Array de objetos de productos
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
   * Obtiene un producto específico por su ID
   * @param {string|number} id - ID del producto a buscar
   * @returns {Promise<Object>} Objeto del producto encontrado
   * @throws {Error} Si el producto no existe o la petición falla
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
   * Crea un nuevo producto en la base de datos
   * @param {Object} product - Objeto con los datos del producto
   * @param {string} product.name - Nombre del producto
   * @param {number} product.price - Precio del producto
   * @param {string} [product.image] - URL de la imagen del producto
   * @param {string} [product.description] - Descripción del producto
   * @returns {Promise<Object>} Producto creado con su ID asignado
   * @throws {Error} Si la creación falla
   */
  async create(product) {
    try {
      const response = await axios.post(API_URL, product)
      return response.data
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  },

  /**
   * Actualiza un producto existente
   * @param {string|number} id - ID del producto a actualizar
   * @param {Object} product - Objeto con los datos actualizados del producto
   * @returns {Promise<Object>} Producto actualizado
   * @throws {Error} Si la actualización falla
   */
  async update(id, product) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, product)
      return response.data
    } catch (error) {
      console.error('Error en update:', error)
      throw error
    }
  },

  /**
   * Elimina un producto de la base de datos
   * @param {string|number} id - ID del producto a eliminar
   * @returns {Promise<Object>} Producto eliminado
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
  }
}
