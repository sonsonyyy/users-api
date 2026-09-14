import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import usersRouter from './routes/userRoutes.js'

// import errorMiddleware from './middlewares/errorMiddleware.js' // Uncomment this line to enable error handling middleware

const app = express()

// Setup CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)

// Middleware
app.use(bodyParser.json())

// Routes
app.use('/users', usersRouter)

// Error Middleware
// app.use(errorMiddleware) // Uncomment this line to enable error handling middleware

// Home route
app.get('/', (_req, res) => {
  res.send('Users API is running')
})

export default app
