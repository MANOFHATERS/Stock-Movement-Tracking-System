import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX, FiShoppingCart, FiXCircle, FiTrash2 } from 'react-icons/fi'
import { productApi, orderApi } from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                orderApi.getAll(),
                productApi.getAll()
            ])
            setOrders(ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            setProducts(productsRes.data)
        } catch (error) {
            toast.error('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateOrder = async (e) => {
        e.preventDefault()

        // Validate items
        const validItems = orderItems.filter(item => item.productId && item.quantity > 0)
        if (validItems.length === 0) {
            toast.error('Please add at least one item to the order')
            return
        }

        try {
            await orderApi.create({ items: validItems })
            toast.success('Order created successfully')
            fetchData()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create order')
        }
    }

    const handleCancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order? Stock will be restored.')) return
        try {
            await orderApi.cancel(orderId)
            toast.success('Order cancelled successfully')
            fetchData()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel order')
        }
    }

    const handleDeleteOrder = async (orderId) => {
        if (!confirm('Are you sure you want to delete this order?')) return
        try {
            await orderApi.delete(orderId)
            toast.success('Order deleted successfully')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete order')
        }
    }

    const addOrderItem = () => {
        setOrderItems([...orderItems, { productId: '', quantity: 1 }])
    }

    const removeOrderItem = (index) => {
        if (orderItems.length === 1) return
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const updateOrderItem = (index, field, value) => {
        const newItems = [...orderItems]
        newItems[index][field] = value
        setOrderItems(newItems)
    }

    const openModal = () => {
        setOrderItems([{ productId: '', quantity: 1 }])
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const getProductById = (id) => products.find(p => p.productId === id)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="page-title">Orders</h1>
                            <p className="page-subtitle">Manage your orders and track stock movements</p>
                        </div>
                        <button onClick={openModal} className="btn btn-primary">
                            <FiPlus />
                            Create Order
                        </button>
                    </div>
                </motion.div>

                {/* Orders Table */}
                {orders.length > 0 ? (
                    <motion.div
                        className="table-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <motion.tr
                                        key={order.orderId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>
                                            <code style={{
                                                background: 'var(--bg-tertiary)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {order.orderId?.substring(0, 8)}...
                                            </code>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-sm">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-sm">
                                                        <span className="badge badge-neutral">{item.quantity}x</span>
                                                        <span>{item.productName || 'Product'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <strong>${(order.totalAmount || 0).toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            {order.status === 'COMPLETED' ? (
                                                <span className="badge badge-success">Completed</span>
                                            ) : order.status === 'CANCELLED' ? (
                                                <span className="badge badge-danger">Cancelled</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                        </td>
                                        <td className="text-muted">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td>
                                            <div className="flex gap-sm">
                                                {order.status === 'COMPLETED' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        className="btn btn-danger btn-sm"
                                                        title="Cancel Order"
                                                    >
                                                        <FiXCircle />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteOrder(order.orderId)}
                                                    className="btn btn-secondary btn-sm"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🛒</div>
                        <h3>No orders yet</h3>
                        <p>Create your first order to start tracking stock movements</p>
                        <button onClick={openModal} className="btn btn-primary mt-md">
                            <FiPlus /> Create Order
                        </button>
                    </div>
                )}

                {/* Create Order Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                        >
                            <motion.div
                                className="modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ maxWidth: 600 }}
                            >
                                <div className="modal-header">
                                    <h3 className="modal-title">
                                        <FiShoppingCart style={{ marginRight: 8 }} />
                                        Create New Order
                                    </h3>
                                    <button onClick={closeModal} className="modal-close">×</button>
                                </div>
                                <form onSubmit={handleCreateOrder}>
                                    <div className="modal-body">
                                        <p className="text-secondary mb-lg">
                                            Add products to this order. Stock will be automatically reduced.
                                        </p>

                                        {orderItems.map((item, index) => (
                                            <div key={index} className="flex gap-md items-end mb-md" style={{ flexWrap: 'wrap' }}>
                                                <div className="form-group" style={{ flex: 2, minWidth: 200, marginBottom: 0 }}>
                                                    <label className="form-label">Product</label>
                                                    <select
                                                        className="form-input"
                                                        value={item.productId}
                                                        onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select product...</option>
                                                        {products.map(product => (
                                                            <option
                                                                key={product.productId}
                                                                value={product.productId}
                                                                disabled={product.availableQuantity === 0}
                                                            >
                                                                {product.name} ({product.availableQuantity} in stock)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group" style={{ flex: 1, minWidth: 100, marginBottom: 0 }}>
                                                    <label className="form-label">Qty</label>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        value={item.quantity}
                                                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        max={getProductById(item.productId)?.availableQuantity || 999}
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeOrderItem(index)}
                                                    className="btn btn-ghost btn-icon"
                                                    disabled={orderItems.length === 1}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addOrderItem}
                                            className="btn btn-secondary w-full mt-md"
                                        >
                                            <FiPlus /> Add Another Item
                                        </button>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={closeModal} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            <FiShoppingCart /> Create Order
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Orders
