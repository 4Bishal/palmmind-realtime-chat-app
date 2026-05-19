# 💬 Real-Time Chat Backend (Node.js + Express + MongoDB + Socket.IO)

This project is a backend system built for real-time chat functionality using **Node.js, Express, MongoDB, JWT authentication, and Socket.IO**.

It supports:
- User authentication (JWT)
- Real-time messaging using Socket.IO
- Persistent chat history in MongoDB
- Online/offline user tracking
- System statistics (users + messages count)

---

# 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcrypt.js
- ES Modules

---

# ▶️ How to run (backend)

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/` or copy from `.env.example` and update values:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
```

4. Start the backend server in development mode:

```bash
npm run dev
```

5. The API and Socket.IO server will run on `http://localhost:5000` by default.

> If you want to use a different port, set `PORT` in `.env`.

---

# 🧠 System Architecture Overview

The system is divided into two layers:

### 1. REST API Layer (HTTP)
Handles:
- Authentication
- User management
- Chat history
- System stats

### 2. Real-Time Layer (Socket.IO)
Handles:
- Live messaging
- User presence (online/offline)
- Event broadcasting

---

# 🔐 Authentication Flow

1. User registers or logs in via REST API
2. Server generates JWT token
3. Token is sent to client
4. Socket.IO uses token during handshake
5. Server verifies token in socket middleware
6. User is attached to socket as `socket.user`

---

# 🌐 Socket.IO Flow

### Connection Flow:
- Client sends JWT in handshake
- Server validates token
- User joins personal room (`userId`)
- User is marked online

### Events:
- `user:online` → emitted when user connects
- `user:offline` → emitted when user disconnects
- `message:send` → send message
- `message:receive` → receive message in real time

---

# 💬 Chat System Flow

1. User sends message via socket event
2. Server validates sender using `socket.user`
3. Message is stored in MongoDB
4. Message is emitted to receiver’s room
5. Receiver gets real-time update

---

# 📊 API Endpoints

## 🔐 Auth Routes

### POST `/api/auth/register`
Register new user

### POST `/api/auth/login`
Login user and receive JWT

---

## 👤 User Routes

### GET `/api/users`
Get all registered users (protected)

---

## 💬 Message Routes

### GET `/api/messages/:userId`
Fetch chat history between two users (protected)

---

## 📊 Stats Routes

### GET `/api/stats`
Returns system metrics:
- totalUsers
- totalMessages

---

# 🔌 Socket Events

## Client → Server

### `message:send`
Send a chat message

```json
{
  "receiverId": "USER_ID",
  "message": "Hello"
}