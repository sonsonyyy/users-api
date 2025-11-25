import express from 'express'
import env from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from './config/database.js'
// import usersRouter from './routes/userRoutes.js' // Uncomment this line to enable users routes
// import errorMiddleware from './middlewares/errorMiddleware.js' // Uncomment this line to enable error handling middleware

env.config()

const app = express()
const PORT = process.env.API_PORT || 8080

// Setup CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

// Middleware
app.use(bodyParser.json())

// Connect to the database
connectDB()

// Routes
// app.use('/users', usersRouter) // Uncomment this line to enable users routes/

// Error Middleware
// app.use(errorMiddleware) // Uncomment this line to enable error handling middleware

// Home route
app.get('/', (req, res) => {
    res.send('Users API is running')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})