import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { FiPackage, FiShoppingCart, FiActivity, FiLogOut, FiHome } from 'react-icons/fi'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import StockHistory from './pages/StockHistory'

function App() {
    const { user, logout, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        )
    }

    // Show login page if not authenticated
    if (!user && location.pathname !== '/') {
        return <Login />
    }

    return (
        <div>
            {/* Navigation */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <span className="navbar-brand-icon">📦</span>
                        Stock Tracker Pro
                    </Link>

                    {user && (
                        <>
                            <div className="navbar-nav">
                                <Link
                                    to="/"
                                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                >
                                    <FiHome />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/products"
                                    className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
                                >
                                    <FiPackage />
                                    Products
                                </Link>
                                <Link
                                    to="/orders"
                                    className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
                                >
                                    <FiShoppingCart />
                                    Orders
                                </Link>
                            </div>

                            <div className="navbar-actions">
                                {user.avatar && (
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                )}
                                <span className="text-secondary">{user.name}</span>
                                <button onClick={logout} className="btn btn-ghost btn-sm">
                                    <FiLogOut />
                                </button>
                            </div>
                        </>
                    )}

                    {!user && (
                        <a
                            href="/oauth2/authorization/google"
                            className="btn btn-primary btn-sm"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/oauth2/authorization/google'; }}
                        >
                            Sign In
                        </a>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Routes>
                    <Route path="/" element={user ? <Dashboard /> : <Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/products/:productId/history" element={<StockHistory />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
