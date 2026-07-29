import type { Request, Response } from 'express'
import User from '../models/user.js'

type UserRequestBody = {
  firstName?: string
  lastName?: string
  email?: string
}

type UserParams = {
  id: string
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error'

const isEmptyObject = (value: object): boolean => Object.keys(value).length === 0

export const createUser = async (
  req: Request<Record<string, never>, unknown, UserRequestBody>,
  res: Response
) => {
  const user = req.body

  if (!user || isEmptyObject(user)) {
    return res.status(400).json({ message: 'User data is required' })
  }

  try {
    const newUser = await User.create(user)
    return res.status(201).json({ message: 'User created successfully', newUser })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const getUserById = async (req: Request<UserParams>, res: Response) => {
  const userId = req.params.id

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const updateUser = async (
  req: Request<UserParams, unknown, UserRequestBody>,
  res: Response
) => {
  const userId = req.params.id
  const user = req.body

  if (!user || isEmptyObject(user)) {
    return res.status(400).json({ message: 'Update user data is required' })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User updated successfully', updatedUser })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const deleteUser = async (req: Request<UserParams>, res: Response) => {
  const userId = req.params.id

  try {
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}
