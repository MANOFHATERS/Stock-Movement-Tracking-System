import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// Products API
export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
    getStockHistory: (id) => api.get(`/products/${id}/stock-history`),
    restock: (id, quantity, description) =>
        api.post(`/products/${id}/restock`, { quantity, description }),
    search: (name) => api.get(`/products/search?name=${name}`),
    getLowStock: (threshold = 10) => api.get(`/products/low-stock?threshold=${threshold}`)
}

// Orders API
export const orderApi = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    getByStatus: (status) => api.get(`/orders/status/${status}`),
    create: (order) => api.post('/orders', order),
    cancel: (id) => api.post(`/orders/${id}/cancel`),
    delete: (id) => api.delete(`/orders/${id}`)
}

// Auth API
export const authApi = {
    getUser: () => api.get('/auth/user'),
    logout: () => api.post('/auth/logout')
}

export default api
