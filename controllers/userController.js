import User from '../models/user.js'

export const createUser = async (req, res) => {
    const user = req.body ?? ''
    if (!user || Object.keys(user).length === 0) {
        return res.status(400).json({ message: 'User data is required' })
    }

    try {
        const newUser = await User.create(user)
        return res.status(201).json({ message: 'User created successfully', newUser })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getUserById = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const updateUser = async (req, res) => {
    const userId = req.params.id
    const user = req.body ?? ''

    if (!user || Object.keys(user).length === 0) {
        return res.status(400).json({ message: 'Update user data is required' })
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User updated successfully', updatedUser })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}