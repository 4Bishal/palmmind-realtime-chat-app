# PalmMind-Task

Brief: Simple chat app (Node/Express/MongoDB + React + Socket.IO).

Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB running (local or remote)

Backend (server)
1. Copy `backend/.env.example` to `backend/.env` and fill values.
2. Install and run:

```bash
cd backend
npm install
npm run dev   # or `node src/server.js` depending on scripts
```

Important env vars (see `backend/.env.example`):
- `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`

Frontend (client)
1. Copy `frontend/.env.example` to `frontend/.env` if you need to override socket URL.
2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Features implemented
- User registration and login (JWT)
- Protected API endpoints
- Socket.IO authentication and presence
- Save chat messages to MongoDB
- Endpoints for messages and stats
- Frontend: live chat UI, user list, optimistic messages

Notes for interview / evaluation
- Backend: CRUD for users (read/update/delete) with authorization — implemented in `backend/src/controllers/usersController.js` and routes in `backend/src/routes/usersRoute.js`.
- Socket: messages persisted (`Message` model) and emitted via `message:receive` — see `backend/src/socket/handlers/chatHandler.js`.
- Stats: totals endpoint at `/api/stats`.

See `backend/.env.example` and `frontend/.env.example` for environment variables.
