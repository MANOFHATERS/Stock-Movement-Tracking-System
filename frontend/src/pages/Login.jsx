import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Login = () => {
    const { loginWithGoogle, loginWithGithub } = useAuth()

    return (
        <div className="login-container">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="login-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    📦
                </motion.div>

                <h1 className="login-title">Stock Tracker Pro</h1>
                <p className="login-subtitle">
                    Track your inventory movements with precision.
                    <br />
                    Sign in to get started.
                </p>

                <div className="oauth-buttons">
                    <motion.button
                        className="oauth-btn google"
                        onClick={loginWithGoogle}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FcGoogle className="oauth-icon" />
                        Continue with Google
                    </motion.button>

                    <motion.button
                        className="oauth-btn github"
                        onClick={loginWithGithub}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaGithub className="oauth-icon" />
                        Continue with GitHub
                    </motion.button>
                </div>

                <div className="login-divider">
                    <span>Secure OAuth Authentication</span>
                </div>

                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    )
}

export default Login
