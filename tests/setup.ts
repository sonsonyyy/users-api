// Some modules (config/database.ts) read required Postgres env vars at
// import time. Tests never talk to a real database - the pg Pool and the
// model layer are mocked - but the env vars still need to exist so those
// imports don't throw. Real values from .env are left untouched if set.
process.env.POSTGRES_USER ??= 'test_user'
process.env.POSTGRES_PASSWORD ??= 'test_password'
process.env.POSTGRES_DB ??= 'test_db'
process.env.POSTGRES_HOST ??= 'localhost'
process.env.POSTGRES_PORT ??= '5433'
