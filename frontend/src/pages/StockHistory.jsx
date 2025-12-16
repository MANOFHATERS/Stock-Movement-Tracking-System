import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiPackage, FiTrendingUp, FiTrendingDown, FiRefreshCw, FiStar } from 'react-icons/fi'
import { productApi } from '../services/api'
import toast from 'react-hot-toast'

const StockHistory = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [productId])

    const fetchData = async () => {
        try {
            const [productRes, historyRes] = await Promise.all([
                productApi.getById(productId),
                productApi.getStockHistory(productId)
            ])
            setProduct(productRes.data)
            setHistory(historyRes.data)
        } catch (error) {
            toast.error('Failed to fetch stock history')
        } finally {
            setLoading(false)
        }
    }

    const getChangeTypeInfo = (type) => {
        switch (type) {
            case 'ORDER':
                return {
                    label: 'Order',
                    color: 'danger',
                    icon: FiTrendingDown,
                    dotClass: 'order'
                }
            case 'CANCEL':
                return {
                    label: 'Order Cancelled',
                    color: 'success',
                    icon: FiTrendingUp,
                    dotClass: 'cancel'
                }
            case 'RESTOCK':
                return {
                    label: 'Restocked',
                    color: 'primary',
                    icon: FiRefreshCw,
                    dotClass: 'restock'
                }
            case 'INITIAL_STOCK':
                return {
                    label: 'Initial Stock',
                    color: 'warning',
                    icon: FiStar,
                    dotClass: 'initial'
                }
            default:
                return {
                    label: type,
                    color: 'neutral',
                    icon: FiPackage,
                    dotClass: 'initial'
                }
        }
    }

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
                <p>Loading stock history...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <h3>Product not found</h3>
                        <p>The product you're looking for doesn't exist.</p>
                        <Link to="/products" className="btn btn-primary mt-md">
                            <FiArrowLeft /> Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link to="/products" className="btn btn-ghost mb-md">
                        <FiArrowLeft /> Back to Products
                    </Link>
                    <h1 className="page-title">Stock History</h1>
                    <p className="page-subtitle">
                        Viewing movement history for <strong>{product.name}</strong>
                    </p>
                </motion.div>

                {/* Product Info Card */}
                <motion.div
                    className="card mb-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-lg" style={{ flexWrap: 'wrap' }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem'
                        }}>
                            <FiPackage />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>{product.name}</h2>
                            <p className="text-secondary">{product.category || 'Uncategorized'}</p>
                        </div>
                        <div className="stat-card" style={{ margin: 0, flex: 'none' }}>
                            <div className="stat-content">
                                <h3>{product.availableQuantity}</h3>
                                <p>Current Stock</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Timeline */}
                {history.length > 0 ? (
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Movement History</h3>
                            <span className="badge badge-neutral">{history.length} entries</span>
                        </div>

                        <div className="timeline">
                            {history.map((entry, index) => {
                                const typeInfo = getChangeTypeInfo(entry.changeType)
                                const Icon = typeInfo.icon

                                return (
                                    <motion.div
                                        key={entry.id}
                                        className="timeline-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className={`timeline-dot ${typeInfo.dotClass}`}></div>
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <div className="flex items-center gap-sm">
                                                    <Icon className={`text-${typeInfo.color}`} />
                                                    <span className={`timeline-type text-${typeInfo.color}`}>
                                                        {typeInfo.label}
                                                    </span>
                                                </div>
                                                <span className="timeline-date">{formatDate(entry.createdAt)}</span>
                                            </div>
                                            <div className="timeline-body">
                                                <span className={`timeline-quantity ${entry.quantityChanged >= 0 ? 'positive' : 'negative'}`}>
                                                    {entry.quantityChanged >= 0 ? '+' : ''}{entry.quantityChanged}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                        {entry.previousQuantity} → {entry.newQuantity} units
                                                    </span>
                                                    {entry.description && (
                                                        <span className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                            {entry.description}
                                                        </span>
                                                    )}
                                                    {entry.referenceId && (
                                                        <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                            Ref: {entry.referenceId.substring(0, 8)}...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No history yet</h3>
                        <p>Stock movements will appear here when orders are placed or stock is adjusted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockHistory
