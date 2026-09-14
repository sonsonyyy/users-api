import env from 'dotenv'
import app from './app.js'
import connectDB from './config/database.js'

env.config()

const PORT = process.env.API_PORT ?? 8080

const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server')
    console.error(error)
    process.exit(1)
  }
}

await startServer()
