# Virelio

Virelio is an invoice and expense tracker built as a pnpm workspace with:

- a NestJS backend
- a Vue 3 + Vite frontend
- Prisma for database access and migrations

## Requirements

- Node.js `>=24 <26`
- pnpm `11.x`
- PostgreSQL

## Project Structure

- `backend/` - NestJS API and Prisma schema
- `frontend/` - Vue application

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up the backend environment:

```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your database connection string.

4. Run the database migration workflow from the backend package:

```bash
pnpm prisma:migrate:dev
```

## Running the App

Start the backend:

```bash
pnpm dev:backend
```

Start the frontend:

```bash
pnpm dev:frontend
```

## Useful Scripts

From the repository root:

```bash
pnpm build
pnpm lint
pnpm format
pnpm test
pnpm typecheck
```

Prisma helpers:

```bash
pnpm prisma:format
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:dev
pnpm prisma:migrate:deploy
```

## Backend Notes

The backend exposes REST endpoints for managing vendors and related expense data. It uses Prisma migrations and a PostgreSQL database configured through `DATABASE_URL`.

## Frontend Notes

The frontend is a Vue 3 app powered by Vite.
