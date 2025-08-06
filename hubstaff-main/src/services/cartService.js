import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const cartService = {
  // Get user's cart
  async getCart(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      return response.data.items;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  async addToCart(userId, product) {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/${userId}/add`, {
        product
      });
      return response.data.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update item quantity
  async updateQuantity(userId, productId, quantity) {
    try {
      const response = await axios.put(`${API_BASE_URL}/cart/${userId}/update`, {
        productId,
        quantity
      });
      return response.data.cart;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(userId, productId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/${userId}/remove/${productId}`);
      return response.data.cart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  async clearCart(userId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/${userId}/clear`);
      return response.data.cart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Regular checkout (if you still want this)
  // async checkout(userId, totalAmount) {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/cart/${userId}/checkout`, {
  //       totalAmount
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error during checkout:', error);
  //     throw error;
  //   }
  // },

  // Stripe Checkout
  async checkoutWithStripe(cartItems, userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, {
        cartItems,
        userId
      });
      
      return response.data.url; // Stripe session URL
    } catch (error) {
      console.error('Error initiating Stripe checkout:', error);
      throw error;
    }
  }
};