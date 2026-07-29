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
If you don't have a MongoDB account yet, create one here: https://www.mongodb.com/cloud/atlas/register

Then create a Cluster, Database User, and Connection String to fill in the values below:
```
API_PORT=8080
CLIENT_URL=http://localhost:3000
MONGODB_USER=your_mongodb_user
MONGODB_PASSWORD=your_mongodb_password
MONGODB_DBNAME=your_database_name
```

6. Start the server in development mode:
```
npm run dev
```
Server will run on the port specified in `.env` (default: 8080).

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

## API Endpoints

- `GET /users` – Get all users
- `GET /users/:id` – Get a user by ID
- `POST /users` – Add a new user
- `PUT /users/:id` – Update a user
- `DELETE /users/:id` – Delete a user

---

## License

ISC License
