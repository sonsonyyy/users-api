import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const modelMock = {
  createUser: vi.fn(),
  findAllUsers: vi.fn(),
  findUserById: vi.fn(),
  updateUserById: vi.fn(),
  deleteUserById: vi.fn(),
}

// Mocked with a factory (rather than vi.mock('../../models/user.js') +
// vi.mocked) so the real model.ts - and its import of config/database.ts -
// never loads at all. That keeps these tests fast and DB-free.
vi.mock('../../models/user.js', () => modelMock)

const { default: app } = await import('../../app.js')

const user = {
  id: '11111111-1111-1111-1111-111111111111',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
}

describe('User routes', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('POST /users', () => {
    it('creates a user and returns 201', async () => {
      modelMock.createUser.mockResolvedValue(user)

      const res = await request(app).post('/users').send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      })

      expect(res.status).toBe(201)
      expect(res.body.newUser).toEqual(user)
      expect(modelMock.createUser).toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      })
    })

    it('returns 400 when the body is empty', async () => {
      const res = await request(app).post('/users').send({})

      expect(res.status).toBe(400)
      expect(modelMock.createUser).not.toHaveBeenCalled()
    })

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app).post('/users').send({ firstName: 'Ada' })

      expect(res.status).toBe(400)
      expect(modelMock.createUser).not.toHaveBeenCalled()
    })

    it('returns 409 when the email already exists', async () => {
      modelMock.createUser.mockRejectedValue({ code: '23505' })

      const res = await request(app).post('/users').send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      })

      expect(res.status).toBe(409)
    })

    it('returns 500 on an unexpected error', async () => {
      modelMock.createUser.mockRejectedValue(new Error('boom'))

      const res = await request(app).post('/users').send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      })

      expect(res.status).toBe(500)
    })
  })

  describe('GET /users', () => {
    it('returns the list of users', async () => {
      modelMock.findAllUsers.mockResolvedValue([user])

      const res = await request(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([user])
    })
  })

  describe('GET /users/:id', () => {
    it('returns a user when found', async () => {
      modelMock.findUserById.mockResolvedValue(user)

      const res = await request(app).get(`/users/${user.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual(user)
    })

    it('returns 404 when not found', async () => {
      modelMock.findUserById.mockResolvedValue(null)

      const res = await request(app).get('/users/does-not-exist')

      expect(res.status).toBe(404)
    })

    it('returns 404 for a malformed id instead of a 500', async () => {
      modelMock.findUserById.mockRejectedValue({ code: '22P02' })

      const res = await request(app).get('/users/not-a-uuid')

      expect(res.status).toBe(404)
    })
  })

  describe('PUT /users/:id', () => {
    it('updates a user and returns 200', async () => {
      modelMock.updateUserById.mockResolvedValue(user)

      const res = await request(app)
        .put(`/users/${user.id}`)
        .send({ firstName: 'Grace' })

      expect(res.status).toBe(200)
      expect(res.body.updatedUser).toEqual(user)
    })

    it('returns 400 when the body is empty', async () => {
      const res = await request(app).put(`/users/${user.id}`).send({})

      expect(res.status).toBe(400)
      expect(modelMock.updateUserById).not.toHaveBeenCalled()
    })

    it('returns 404 when the user does not exist', async () => {
      modelMock.updateUserById.mockResolvedValue(null)

      const res = await request(app)
        .put(`/users/${user.id}`)
        .send({ firstName: 'Grace' })

      expect(res.status).toBe(404)
    })

    it('returns 409 when the new email is already taken', async () => {
      modelMock.updateUserById.mockRejectedValue({ code: '23505' })

      const res = await request(app)
        .put(`/users/${user.id}`)
        .send({ email: 'taken@example.com' })

      expect(res.status).toBe(409)
    })
  })

  describe('DELETE /users/:id', () => {
    it('deletes a user and returns 200', async () => {
      modelMock.deleteUserById.mockResolvedValue(user)

      const res = await request(app).delete(`/users/${user.id}`)

      expect(res.status).toBe(200)
    })

    it('returns 404 when the user does not exist', async () => {
      modelMock.deleteUserById.mockResolvedValue(null)

      const res = await request(app).delete(`/users/${user.id}`)

      expect(res.status).toBe(404)
    })
  })
})
