import { describe, it, expect, vi, beforeEach } from 'vitest'

const queryMock = vi.fn()

// config/database.ts does `import pg from 'pg'; const { Pool } = pg`, so the
// mock has to shape itself as a default export.
vi.mock('pg', () => ({
  default: {
    // Pool is called with `new Pool(...)` in config/database.ts, so the mock
    // has to be constructible - an arrow function can't be `new`ed.
    Pool: vi.fn(function Pool() {
      return { query: queryMock }
    }),
  },
}))

const { createUser, findAllUsers, findUserById, updateUserById, deleteUserById } = await import(
  '../../models/user.js'
)

const row = {
  id: '11111111-1111-1111-1111-111111111111',
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-02T00:00:00.000Z'),
}

const mappedUser = {
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}

describe('user model', () => {
  beforeEach(() => {
    queryMock.mockReset()
  })

  it('createUser inserts a row and maps it to camelCase', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await createUser({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    })

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['Ada', 'Lovelace', 'ada@example.com']
    )
    expect(result).toEqual(mappedUser)
  })

  it('findAllUsers returns every row mapped to camelCase', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await findAllUsers()

    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'))
    expect(result).toEqual([mappedUser])
  })

  it('findUserById returns the mapped user when found', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await findUserById(row.id)

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('WHERE id = $1'),
      [row.id]
    )
    expect(result).toEqual(mappedUser)
  })

  it('findUserById returns null when no row is found', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })

    const result = await findUserById('missing-id')

    expect(result).toBeNull()
  })

  it('updateUserById only sets provided fields', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await updateUserById(row.id, { firstName: 'Ada' })

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('SET first_name = $1'),
      ['Ada', row.id]
    )
    expect(result).toEqual(mappedUser)
  })

  it('updateUserById falls back to findUserById when there is nothing to update', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await updateUserById(row.id, {})

    expect(queryMock).toHaveBeenCalledTimes(1)
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM users WHERE id = $1'),
      [row.id]
    )
    expect(result).toEqual(mappedUser)
  })

  it('deleteUserById returns the deleted user when found', async () => {
    queryMock.mockResolvedValueOnce({ rows: [row] })

    const result = await deleteUserById(row.id)

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM users WHERE id = $1'),
      [row.id]
    )
    expect(result).toEqual(mappedUser)
  })

  it('deleteUserById returns null when nothing was deleted', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })

    const result = await deleteUserById('missing-id')

    expect(result).toBeNull()
  })
})
