import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const orderService = {
  async getAllOrders() {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  },
  // Add to orderService
async updateOrderStatus(orderId, status) {
  const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
  return response.data;
}

};
