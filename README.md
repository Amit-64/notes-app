# Notes App Backend

A robust, secure RESTful API backend for a personal notes management application built with Node.js, Express, and MongoDB.

---

## Features

- **Authentication & Authorization**: Secure user registration, login, session checking, and logout using JWT stored in HTTP-only cookies and passwords hashed with bcrypt.
- **User Scoping & Data Isolation**: All notes are strictly scoped to the authenticated user. Users cannot view, update, or delete notes created by other users.
- **Data Validation & Sanitization**: Strict input validation and field length limits using Mongoose schemas.
- **Indexing & Performance**: Compound indexing on `(user, updatedAt)` for fast retrieval and ordering of notes.
- **Error Handling**: Centralized global error handling and standard 404 response handler for undefined API routes.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, and `cookie-parser`
- **Environment Management**: `dotenv`

---

## Project Structure

```
notes-app/
├── middleware/
│   └── authMiddleware.js   # JWT authentication verification middleware
├── models/
│   ├── Note.js             # Mongoose schema and model for Notes
│   └── User.js             # Mongoose schema and model for Users
├── routes/
│   ├── auth.js             # Authentication routes (register, login, logout, me)
│   └── notes.js            # User-scoped Note CRUD routes
├── public/                 # Static frontend assets
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Example environment configuration template
├── package.json            # Project manifest and scripts
├── server.js               # Application entry point and server setup
└── README.md               # Project documentation
```

---

## Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/notes-app.git
cd notes-app
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your configuration:
```bash
cp .env.example .env
```

Example `.env` configuration:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/notesapp
JWT_SECRET=your_secret_here_generate_with_openssl_rand_hex_32
```

### 4. Running the Application

- **Production mode:**
  ```bash
  npm start
  ```

- **Development mode (with Node watch mode):**
  ```bash
  npm run dev
  ```

Server will be running at `http://localhost:3000`.

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No | `{ "name": "...", "email": "...", "password": "..." }` | `201 Created` |
| `POST` | `/api/auth/login` | Login & set HTTP-only cookie | No | `{ "email": "...", "password": "..." }` | `200 OK` (Sets cookie) |
| `POST` | `/api/auth/logout` | Logout & clear cookie | No | None | `200 OK` (Clears cookie) |
| `GET` | `/api/auth/me` | Check authenticated user session | Yes (Cookie) | None | `200 OK` `{ "userId": "..." }` |

### Notes (`/api/notes`)
*All notes endpoints require an authenticated user session cookie.*

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all notes belonging to the logged-in user | None | `200 OK` (Array of notes sorted newest first) |
| `POST` | `/api/notes` | Create a new note for the logged-in user | `{ "title": "...", "content": "..." }` | `201 Created` (Created note) |
| `GET` | `/api/notes/:id` | Get a specific note by ID | None | `200 OK` / `404 Not Found` |
| `PUT` | `/api/notes/:id` | Update a note by ID | `{ "title": "...", "content": "..." }` | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/notes/:id` | Delete a note by ID | None | `200 OK` / `404 Not Found` |
