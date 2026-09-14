import { pool } from '../config/database.js'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type NewUser = {
  firstName: string
  lastName: string
  email: string
}

export type UserUpdate = Partial<NewUser>

type UserRow = {
  id: string
  first_name: string
  last_name: string
  email: string
  created_at: Date
  updated_at: Date
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const createUser = async (data: NewUser): Promise<User> => {
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (first_name, last_name, email)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.firstName, data.lastName, data.email],
  )

  return toUser(rows[0])
}

export const findAllUsers = async (): Promise<User[]> => {
  const { rows } = await pool.query<UserRow>(
    'SELECT * FROM users ORDER BY created_at ASC',
  )

  return rows.map(toUser)
}

export const findUserById = async (id: string): Promise<User | null> => {
  const { rows } = await pool.query<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id],
  )

  return rows[0] ? toUser(rows[0]) : null
}

export const updateUserById = async (
  id: string,
  data: UserUpdate,
): Promise<User | null> => {
  const fieldMap: Record<keyof UserUpdate, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
  }

  const entries = Object.entries(data).filter(
    ([, value]) => value !== undefined,
  ) as Array<[keyof UserUpdate, string]>

  if (entries.length === 0) {
    return findUserById(id)
  }

  const setClauses = entries.map(
    ([key], index) => `${fieldMap[key]} = $${index + 1}`,
  )
  const values = entries.map(([, value]) => value)

  const { rows } = await pool.query<UserRow>(
    `UPDATE users
     SET ${setClauses.join(', ')}, updated_at = now()
     WHERE id = $${values.length + 1}
     RETURNING *`,
    [...values, id],
  )

  return rows[0] ? toUser(rows[0]) : null
}

export const deleteUserById = async (id: string): Promise<User | null> => {
  const { rows } = await pool.query<UserRow>(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id],
  )

  return rows[0] ? toUser(rows[0]) : null
}
