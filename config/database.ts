import pg from 'pg'

const { Pool } = pg

type DatabaseEnvKey = 'POSTGRES_USER' | 'POSTGRES_PASSWORD' | 'POSTGRES_DB' | 'POSTGRES_HOST' | 'POSTGRES_PORT'

const getRequiredEnv = (key: DatabaseEnvKey): string => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`${key} is required to connect to PostgreSQL`)
  }

  return value
}

export const pool = new Pool({
  user: getRequiredEnv('POSTGRES_USER'),
  password: getRequiredEnv('POSTGRES_PASSWORD'),
  database: getRequiredEnv('POSTGRES_DB'),
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
})

const createUsersTable = async (): Promise<void> => {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
}

export default async function connectDB(): Promise<void> {
  await pool.query('SELECT 1')
  await createUsersTable()
  console.log('PostgreSQL connected')
}
