import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiShoppingCart, FiTrendingDown, FiAlertCircle, FiPlus, FiArrowRight, FiActivity } from 'react-icons/fi'
import { productApi, orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        lowStockItems: 0,
        totalStock: 0
    })
    const [recentProducts, setRecentProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [productsRes, ordersRes, lowStockRes] = await Promise.all([
                productApi.getAll(),
                orderApi.getAll(),
                productApi.getLowStock(10)
            ])

            const products = productsRes.data
            const totalStock = products.reduce((sum, p) => sum + (p.availableQuantity || 0), 0)

            setStats({
                totalProducts: products.length,
                totalOrders: ordersRes.data.length,
                lowStockItems: lowStockRes.data.length,
                totalStock
            })

            setRecentProducts(products.slice(0, 5))
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
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
                    <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
                    <p className="page-subtitle">Here's what's happening with your inventory today.</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon primary">
                            <FiPackage />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon success">
                            <FiShoppingCart />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon warning">
                            <FiTrendingDown />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalStock.toLocaleString()}</h3>
                            <p>Total Stock Units</p>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" variants={itemVariants}>
                        <div className="stat-icon danger">
                            <FiAlertCircle />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.lowStockItems}</h3>
                            <p>Low Stock Alerts</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="card mt-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                        <Link to="/products" className="btn btn-primary">
                            <FiPlus />
                            Add Product
                        </Link>
                        <Link to="/orders" className="btn btn-success">
                            <FiShoppingCart />
                            Create Order
                        </Link>
                        <Link to="/products" className="btn btn-secondary">
                            <FiPackage />
                            View All Products
                        </Link>
                    </div>
                </motion.div>

                {/* Recent Products */}
                <motion.div
                    className="card mt-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="card-header">
                        <h3 className="card-title">Recent Products</h3>
                        <Link to="/products" className="btn btn-ghost btn-sm">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {recentProducts.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProducts.map(product => (
                                        <tr key={product.productId}>
                                            <td>
                                                <strong>{product.name}</strong>
                                            </td>
                                            <td>{product.category || 'Uncategorized'}</td>
                                            <td>{product.availableQuantity}</td>
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
                                                <Link
                                                    to={`/products/${product.productId}/history`}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    <FiActivity />
                                                    History
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <h3>No products yet</h3>
                            <p>Start by adding your first product to track inventory.</p>
                            <Link to="/products" className="btn btn-primary mt-md">
                                <FiPlus /> Add Product
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
