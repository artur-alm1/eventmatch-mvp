# 🎤 EventMatch – Technical Platform for Cultural Events

EventMatch is a web platform connecting **cultural event producers** with **technical service providers** (sound, lighting, setup, etc.), featuring:

- Event registration
- Technical position applications
- Work protocol generation
- Public portfolios
- Ratings & reviews
- Secure 1:1 chat

---

## 🌍 Architecture & Deployment

| Layer     | Platform  | Technologies                  |
|-----------|-----------|-------------------------------|
| Frontend  | [Vercel](https://vercel.com/)    | Vite + React + Tailwind        |
| Backend   | [Railway](https://railway.app/)  | Node.js + Express + PostgreSQL |
| Database  | Railway (PostgreSQL) | Prisma ORM, container-hosted |

## 🧱 Project Structure (Monorepo)

```bash
eventmatch/
├── frontend/     # React + Tailwind + Vite
└── backend/      # Node.js + Express + Prisma + Docker
```

---

## ⚙️ Environments and Installation

### 🔧 Global Installations (System-wide)

These tools should be installed **once** on **Ubuntu 22.04 LTS**:

| Tool                                                                       | Verification Command          | Project Usage                                                                  |
|----------------------------------------------------------------------------|-------------------------------|--------------------------------------------------------------------------------|
| [Git](https://git-scm.com/)                                               | `git --version`              | Code versioning with GitHub integration                                        |
| [NVM – Node Version Manager](https://github.com/nvm-sh/nvm)              | `nvm --version`              | Per-user Node.js version manager                                               |
| [Node.js (LTS)](https://nodejs.org/en/)                                   | `node -v`                    | Backend execution (Express) and frontend (Vite + React)                        |
| npm (included with Node.js)                                               | `npm -v`                     | JavaScript dependency management                                               |
| [Docker](https://docs.docker.com/engine/install/ubuntu/)                 | `docker --version`           | Containers for PostgreSQL and backend services                                 |
| [Docker Compose](https://docs.docker.com/compose/install/)               | `docker-compose --version`   | Local multi-container orchestration                                            |
| [Prisma CLI](https://www.prisma.io/docs/getting-started)                 | `prisma -v`                  | ORM for PostgreSQL modeling and database access                                |
| [Visual Studio Code](https://code.visualstudio.com/)                     | `code --version`             | Primary code editor with extensions (Tailwind, Prisma, etc.)                   |

---

## 📦 Local Dependencies by Environment

Dependencies below are installed locally within their respective folders (`frontend/` and `backend/`) using `npm install`.

---

### 🖼️ Frontend – React + Vite + Tailwind

📁 Path: `eventmatch/frontend/`

#### 🔧 Installation

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom react-hook-form zod react-hot-toast
```

---

### 🛠️ Backend – Node.js + Express + Prisma

📁 Path: `eventmatch/backend/`

#### 🔧 Installation

```bash
npm install express prisma @prisma/client cors dotenv jsonwebtoken bcryptjs multer socket.io
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/socket.io
npx prisma init
```

---

## 🛠️ Current Status – **Backend Version 4.0**

### ✅ Implemented Features:

- [x] Monorepo structure: `frontend/` and `backend/`
- [x] Global and local installations separated
- [x] PostgreSQL database connection via Railway
- [x] Prisma with schema generation and migrations working
- [x] User registration (`/auth/register`)
- [x] Login with JWT generation (`/auth/login`)
- [x] Authentication middleware (`auth.middleware.ts`)
- [x] Protected route `GET /users/me` working in Postman with JWT

### 🔒 Login Response Example:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-generated",
    "name": "Artur Luna",
    "email": "artur@example.com"
  }
}
```

---

## 🚀 Getting Started

1. Clone the repository
2. Install global dependencies (see table above)
3. Install frontend dependencies: `cd frontend && npm install`
4. Install backend dependencies: `cd backend && npm install`
5. Set up environment variables (`.env` files)
6. Run Prisma migrations: `npx prisma migrate dev`
7. Start development servers

---

## 📝 License



## 👥 Contributors

Artur Luna