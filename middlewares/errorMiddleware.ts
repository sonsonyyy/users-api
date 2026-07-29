import type { ErrorRequestHandler } from 'express'

const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error'

  res.status(500).json({ message: 'Server error', error: message })
}

export default errorMiddleware
