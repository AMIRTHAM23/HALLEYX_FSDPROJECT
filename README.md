
**DEMO VIDEO : https://www.youtube.com/watch?v=LFNnr-sYc4I**

# Custom Dashboard Builder (MERN)

Full-stack MERN application for building custom dashboards from Customer Order data.

## Features
- JWT authentication with roles (admin, user)
- Customer Orders CRUD with validation and totals
- Dashboard builder with fixed-size widgets
- KPI, Charts, Pie, Table widgets
- Dashboard layout saved per user
- Admin user management and full access
- Responsive UI for desktop, tablet, and mobile

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (Vite), Tailwind CSS
- Auth: JWT

## Folder Structure
```
backend/
  controllers/
  models/
  routes/
  seed/
  server.js
  .env
frontend/
  src/
    components/
    pages/
    services/
```

## Setup

### Backend
1. Install dependencies:
```
cd backend
npm install
```

2. Create `.env`:
```
MONGO_URI=mongodb://localhost:27017/custom-dashboard
JWT_SECRET=supersecret
```

3. Seed sample data (optional):
```
npm run seed
```

4. Start server:
```
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend
1. Install dependencies:
```
cd frontend
npm install
```

2. Start frontend:
```
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Sample Accounts
Seed script creates:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## API Routes

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Users (admin)
- `GET /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

Orders
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

Dashboards
- `GET /api/dashboard`
- `GET /api/dashboard/:id`
- `POST /api/dashboard`
- `PUT /api/dashboard/:id`
- `DELETE /api/dashboard/:id`
- `GET /api/dashboard/load`
- `POST /api/dashboard/save`
- `POST /api/dashboard/:id/share`

## Notes
- The UI uses fixed-size widgets in Configure mode.
- The Table widget spans the full row on desktop.
- Dashboard dropdown labels show role and owner name.
