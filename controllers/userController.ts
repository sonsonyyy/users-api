import type { Request, Response } from 'express'
import * as userModel from '../models/user.js'

type UserRequestBody = {
  firstName?: string
  lastName?: string
  email?: string
}

type UserParams = {
  id: string
}

type PgError = {
  code?: string
  message?: string
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error'

const isEmptyObject = (value: object): boolean => Object.keys(value).length === 0

// Postgres error code for a unique constraint violation (e.g. duplicate email)
const isUniqueViolation = (error: unknown): boolean => (error as PgError)?.code === '23505'

// Postgres error code for an invalid input syntax (e.g. malformed UUID)
const isInvalidInput = (error: unknown): boolean => (error as PgError)?.code === '22P02'

export const createUser = async (
  req: Request<Record<string, never>, unknown, UserRequestBody>,
  res: Response
) => {
  const user = req.body

  if (!user || isEmptyObject(user)) {
    return res.status(400).json({ message: 'User data is required' })
  }

  if (!user.firstName || !user.lastName || !user.email) {
    return res
      .status(400)
      .json({ message: 'firstName, lastName and email are required' })
  }

  try {
    const newUser = await userModel.createUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
    return res.status(201).json({ message: 'User created successfully', newUser })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: 'A user with this email already exists' })
    }
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.findAllUsers()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const getUserById = async (req: Request<UserParams>, res: Response) => {
  const userId = req.params.id

  try {
    const user = await userModel.findUserById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    if (isInvalidInput(error)) {
      return res.status(404).json({ message: 'User not found' })
    }
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
    const updatedUser = await userModel.updateUserById(userId, user)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User updated successfully', updatedUser })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: 'A user with this email already exists' })
    }
    if (isInvalidInput(error)) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}

export const deleteUser = async (req: Request<UserParams>, res: Response) => {
  const userId = req.params.id

  try {
    const deletedUser = await userModel.deleteUserById(userId)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    if (isInvalidInput(error)) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(500).json({ message: 'Server error', error: getErrorMessage(error) })
  }
}
