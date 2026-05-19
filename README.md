# Real-Time Chat Application

Submitted as part of the **Palm Mind AI** hiring task.  
A full-stack real-time chat system built with Node.js, Express, MongoDB, Socket.IO, and React.

---

## Tech Stack

| Layer     | Technologies                                      |
|-----------|---------------------------------------------------|
| Backend   | Node.js, Express.js, MongoDB, Mongoose, Socket.IO |
| Auth      | JWT, bcrypt.js                                    |
| Frontend  | React, Vite, Tailwind CSS, Axios, React Router    |
| Realtime  | Socket.IO (client + server)                       |

---

## Features

### Backend
- JWT-based Register / Login / Me endpoints
- Protected REST APIs with auth middleware
- One-to-one real-time messaging via Socket.IO
- Persistent chat history stored in MongoDB
- Online / offline user presence tracking
- Stats endpoint — total users & total messages

### Frontend
- Login & Register pages with protected routes
- Real-time user list with live online status indicators
- One-to-one chat with instant message delivery
- Chat history loaded on conversation open
- Optimistic UI updates for a smooth send experience
- Auto-scroll to the latest message

---

## Project Structure

```
backend/
└── src/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── socket/
    └── server.js

frontend/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── pages/
    ├── socket/
    └── main.jsx
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd project
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (reference `backend/.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file (reference `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint                  | Description              | Auth |
|--------|---------------------------|--------------------------|------|
| POST   | `/api/auth/register`      | Register a new user      | No   |
| POST   | `/api/auth/login`         | Login and receive token  | No   |
| GET    | `/api/auth/me`            | Get current user info    | Yes  |
| GET    | `/api/users`              | List all users           | Yes  |
| GET    | `/api/messages/:userId`   | Fetch chat history       | Yes  |
| GET    | `/api/stats`              | Total users & messages   | Yes  |

---

## Socket Events

| Direction        | Event             | Description                     |
|------------------|-------------------|---------------------------------|
| Client → Server  | `join`            | User joins their personal room  |
| Client → Server  | `message:send`    | Send a chat message             |
| Server → Client  | `message:receive` | Receive a real-time message     |
| Server → Client  | `user:online`     | A user came online              |
| Server → Client  | `user:offline`    | A user disconnected             |

---

## Architecture

```
React UI  →  Socket.IO Client  →  Express Server  →  MongoDB
                                         ↓
                                   Socket.IO Server
                                         ↓
                                    Other Clients
```

**Real-time message flow:**
```
User A → socket emit → Server → saves to DB → socket broadcast → User B
```

---

## Environment Variable Reference

### `backend/.env.example`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### `frontend/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Author

**Bishal**  
Submitted for Palm Mind AI — Full Stack Developer Hiring Task  
Date: May 2026