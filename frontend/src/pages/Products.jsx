import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiActivity, FiSearch, FiX, FiPackage } from 'react-icons/fi'
import { productApi } from '../services/api'
import toast from 'react-hot-toast'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showRestockModal, setShowRestockModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [restockProduct, setRestockProduct] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        availableQuantity: 0,
        price: 0
    })
    const [restockData, setRestockData] = useState({
        quantity: 0,
        description: ''
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await productApi.getAll()
            setProducts(response.data)
        } catch (error) {
            toast.error('Failed to fetch products')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingProduct) {
                await productApi.update(editingProduct.productId, formData)
                toast.success('Product updated successfully')
            } else {
                await productApi.create(formData)
                toast.success('Product created successfully')
            }
            fetchProducts()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save product')
        }
    }

    const handleRestock = async (e) => {
        e.preventDefault()
        try {
            await productApi.restock(restockProduct.productId, restockData.quantity, restockData.description)
            toast.success('Product restocked successfully')
            fetchProducts()
            closeRestockModal()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to restock product')
        }
    }

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            await productApi.delete(productId)
            toast.success('Product deleted successfully')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                description: product.description || '',
                category: product.category || '',
                availableQuantity: product.availableQuantity,
                price: product.price || 0
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: '',
                description: '',
                category: '',
                availableQuantity: 0,
                price: 0
            })
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingProduct(null)
    }

    const openRestockModal = (product) => {
        setRestockProduct(product)
        setRestockData({ quantity: 0, description: 'Manual restock' })
        setShowRestockModal(true)
    }

    const closeRestockModal = () => {
        setShowRestockModal(false)
        setRestockProduct(null)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const getStockLevel = (quantity) => {
        if (quantity > 50) return 'high'
        if (quantity > 10) return 'medium'
        return 'low'
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
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
                            <h1 className="page-title">Products</h1>
                            <p className="page-subtitle">Manage your product inventory</p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary">
                            <FiPlus />
                            Add Product
                        </button>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div
                    className="card mb-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex gap-md items-center">
                        <FiSearch className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="btn btn-ghost btn-sm">
                                <FiX />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Products Table */}
                {filteredProducts.length > 0 ? (
                    <motion.div
                        className="table-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <motion.tr
                                        key={product.productId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>
                                            <div className="flex items-center gap-md">
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '8px',
                                                    background: 'var(--bg-tertiary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <FiPackage className="text-muted" />
                                                </div>
                                                <div>
                                                    <strong>{product.name}</strong>
                                                    {product.description && (
                                                        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                            {product.description.substring(0, 50)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category || 'Uncategorized'}</td>
                                        <td>{product.price ? `$${product.price.toFixed(2)}` : '-'}</td>
                                        <td>
                                            <div className="stock-level">
                                                <span style={{ minWidth: 40 }}>{product.availableQuantity}</span>
                                                <div className="stock-bar">
                                                    <div
                                                        className={`stock-bar-fill ${getStockLevel(product.availableQuantity)}`}
                                                        style={{ width: `${Math.min(100, (product.availableQuantity / 100) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {product.availableQuantity > 20 ? (
                                                <span className="badge badge-success">In Stock</span>
                                            ) : product.availableQuantity > 0 ? (
                                                <span className="badge badge-warning">Low Stock</span>
                                            ) : (
                                                <span className="badge badge-danger">Out of Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-sm">
                                                <button
                                                    onClick={() => openRestockModal(product)}
                                                    className="btn btn-success btn-sm"
                                                    title="Restock"
                                                >
                                                    <FiPlus />
                                                </button>
                                                <Link
                                                    to={`/products/${product.productId}/history`}
                                                    className="btn btn-secondary btn-sm"
                                                    title="View History"
                                                >
                                                    <FiActivity />
                                                </Link>
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="btn btn-secondary btn-sm"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.productId)}
                                                    className="btn btn-danger btn-sm"
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
                        <div className="empty-state-icon">📦</div>
                        <h3>{searchTerm ? 'No products found' : 'No products yet'}</h3>
                        <p>{searchTerm ? 'Try a different search term' : 'Start by adding your first product'}</p>
                        {!searchTerm && (
                            <button onClick={() => openModal()} className="btn btn-primary mt-md">
                                <FiPlus /> Add Product
                            </button>
                        )}
                    </div>
                )}

                {/* Add/Edit Modal */}
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
                            >
                                <div className="modal-header">
                                    <h3 className="modal-title">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    <button onClick={closeModal} className="modal-close">×</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="form-label">Product Name *</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="Enter product name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-input"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Enter product description"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="grid grid-2">
                                            <div className="form-group">
                                                <label className="form-label">Category</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    placeholder="e.g., Electronics"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Price</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        {!editingProduct && (
                                            <div className="form-group">
                                                <label className="form-label">Initial Stock Quantity *</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={formData.availableQuantity}
                                                    onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || 0 })}
                                                    required
                                                    min="0"
                                                    placeholder="0"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={closeModal} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingProduct ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Restock Modal */}
                <AnimatePresence>
                    {showRestockModal && restockProduct && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeRestockModal}
                        >
                            <motion.div
                                className="modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3 className="modal-title">Restock: {restockProduct.name}</h3>
                                    <button onClick={closeRestockModal} className="modal-close">×</button>
                                </div>
                                <form onSubmit={handleRestock}>
                                    <div className="modal-body">
                                        <p className="text-secondary mb-lg">
                                            Current stock: <strong>{restockProduct.availableQuantity}</strong> units
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label">Quantity to Add *</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={restockData.quantity}
                                                onChange={(e) => setRestockData({ ...restockData, quantity: parseInt(e.target.value) || 0 })}
                                                required
                                                min="1"
                                                placeholder="Enter quantity"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Note (optional)</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={restockData.description}
                                                onChange={(e) => setRestockData({ ...restockData, description: e.target.value })}
                                                placeholder="e.g., Supplier delivery"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={closeRestockModal} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            Add Stock
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

export default Products
