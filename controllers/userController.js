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