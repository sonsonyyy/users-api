# Users API

**Author:** Erick Salangsang  
**Version:** 1.0.0  

A simple API for managing users using **Express.js v5.x** and **TypeScript**.

---

## Getting Started

1. Clone the repository:  
```
git clone https://github.com/yourusername/users-api.git
```

2. Go into the project folder:
```
cd users-api
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file based on `.env.example`:
```
cp .env.example .env
```

5. Update the `.env` file with your values:
You'll need a running PostgreSQL instance. The easiest way is via Docker (see below), or install PostgreSQL locally.
```
API_PORT=8081
CLIENT_URL=http://localhost:3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
```
The `users` table is created automatically on startup if it doesn't already exist.

6. Start the server in development mode:
```
npm run dev
```
Server will run on the port specified in `.env` (default: 8081).

7. Type-check the project:
```
npm run typecheck
```

8. Build and start the compiled app:
```
npm run build
npm start
```

---

## Running with Docker

This spins up both the API and a PostgreSQL database:
```
docker compose up --build
```
The API will be available on the port specified by `API_PORT` (default: 8081), and PostgreSQL data persists in a named Docker volume. PostgreSQL itself is reachable on the host at `POSTGRES_PORT` (default: 5433) to avoid clashing with other local Postgres instances.

## API Endpoints

- `GET /users` – Get all users
- `GET /users/:id` – Get a user by ID
- `POST /users` – Add a new user
- `PUT /users/:id` – Update a user
- `DELETE /users/:id` – Delete a user

---

## License

ISC License
