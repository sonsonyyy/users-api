import mongoose from 'mongoose'

mongoose.set('bufferCommands', false)

type DatabaseEnvKey = 'MONGODB_USER' | 'MONGODB_PASSWORD' | 'MONGODB_DBNAME'

const getRequiredEnv = (key: DatabaseEnvKey): string => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`${key} is required to connect to MongoDB`)
  }

  return value
}

const buildMongoURI = (): string => {
  const dbUser = encodeURIComponent(getRequiredEnv('MONGODB_USER'))
  const dbPassword = encodeURIComponent(getRequiredEnv('MONGODB_PASSWORD'))
  const dbName = encodeURIComponent(getRequiredEnv('MONGODB_DBNAME'))

  return `mongodb+srv://${dbUser}:${dbPassword}@dev-users.9mtcsr2.mongodb.net/${dbName}?retryWrites=true&w=majority`
}

export default async function connectDB(): Promise<void> {
  await mongoose.connect(buildMongoURI())
  console.log('MongoDB connected')
}
