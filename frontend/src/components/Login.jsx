import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    })

    const [isRegistering, setIsRegistering] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const toggleMode = () => {
        setIsRegistering(!isRegistering)
        setError('')
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'user'
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const endpoint = isRegistering ? '/register' : '/login'

            const requestData = isRegistering
                ? formData
                : { email: formData.email, password: formData.password }

            const response = await axios.post(
                `http://localhost:5000/api/auth${endpoint}`,
                requestData
            )

            if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))

                onLogin(response.data.user)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-shell flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bubble lg" style={{ top: "-8%", left: "-6%", animationDuration: "26s" }} />
            <div className="bubble md" style={{ top: "6%", right: "-8%", animationDuration: "22s", animationDelay: "-4s" }} />
            <div className="bubble sm" style={{ top: "18%", left: "12%", animationDuration: "20s", animationDelay: "-6s" }} />
            <div className="bubble md" style={{ top: "30%", right: "18%", animationDuration: "28s", animationDelay: "-8s" }} />
            <div className="bubble lg" style={{ top: "46%", left: "-10%", animationDuration: "30s", animationDelay: "-10s" }} />
            <div className="bubble sm" style={{ top: "58%", right: "-6%", animationDuration: "24s", animationDelay: "-2s" }} />
            <div className="bubble md" style={{ bottom: "18%", left: "8%", animationDuration: "27s", animationDelay: "-12s" }} />
            <div className="bubble lg" style={{ bottom: "-12%", right: "6%", animationDuration: "32s", animationDelay: "-14s" }} />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <motion.h2
                        className="text-4xl font-extrabold bg-gradient-to-r from-amber-700 to-stone-700 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {isRegistering ? 'Join Halleyx' : 'Welcome Back'}
                    </motion.h2>
                    <motion.p
                        className="mt-2 text-lg text-stone-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {isRegistering ? 'Create your account to get started' : 'Sign in to access your dashboard'}
                    </motion.p>
                </motion.div>

                <motion.div
                    layout
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <AnimatePresence mode="wait">
                    <motion.form
                            key={isRegistering ? 'register' : 'login'}
                            initial={{ opacity: 0, x: isRegistering ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRegistering ? -50 : 50 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {isRegistering && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Username
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                name="username"
                                                type="text"
                                                required
                                                placeholder="Choose a username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Email Address
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Password
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full px-4 py-3 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <AnimatePresence>
                                    {isRegistering && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Account Type
                                            </label>
                                            <motion.select
                                                whileFocus={{ scale: 1.02 }}
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className="appearance-none relative block w-full px-4 py-3 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="user">Regular User</option>
                                                <option value="admin">Administrator</option>
                                            </motion.select>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-700 to-stone-700 hover:from-amber-800 hover:to-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    isRegistering ? 'Create Account' : 'Sign In'
                                )}
                            </motion.button>

                            <div className="text-center">
                                <motion.button
                                    drag
                                    dragConstraints={{ left: -50, right: 50, top: 0, bottom: 0 }}
                                    dragElastic={0.1}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    whileDrag={{ scale: 1.1 }}
                                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-amber-700 hover:text-stone-700 text-sm font-medium transition-colors duration-200 cursor-grab active:cursor-grabbing"
                                >
                                    {isRegistering
                                        ? 'Already have an account? Sign in'
                                        : 'Need an account? Register'}
                                </motion.button>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Login 
