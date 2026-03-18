const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password, role } = req.body
            const existingUser = await User.findOne({
                $or: [{ email: email.toLowerCase() }, { username }]
            })

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists'
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = new User({
                username,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'user'
            })

            await user.save()

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            )

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            console.error('Registration error:', error)
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email: email.toLowerCase() })
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                })
            }

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                })
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated'
                })
            }

            user.lastLogin = new Date()
            await user.save()

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            )

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin
                }
            })
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            })
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.userId).select('-password')
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                })
            }

            res.json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            })
        } catch (error) {
            console.error('Get profile error:', error)
            res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            })
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token'
                })
            }
            req.user = user
            next()
        })
    },

    requireAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            })
        }
        next()
    }
}

module.exports = authController
