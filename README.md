# Seidrum Dashboard

React/TypeScript management UI for the [Seidrum](https://github.com/seidrum) AI agent platform. Provides a web interface for monitoring plugins, traces, conversations, knowledge graph entities, API keys, and user administration.

## Prerequisites

- Node.js 20+
- A running [Seidrum API gateway](https://github.com/seidrum/seidrum) (default: `http://localhost:3030`)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start dev server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Seidrum API gateway base URL | `http://localhost:3030/api/v1` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite 8** for bundling and dev server
- **Tailwind CSS 4** — dark theme by default
- **TanStack React Query** for data fetching and caching
- **React Router 7** for client-side routing
- **Lucide React** for icons

## Project Structure

```
src/
  api/           API client and endpoint modules
  hooks/         React Query hooks
  contexts/      Auth context (JWT stored in memory)
  components/    UI components organized by feature
  pages/         Route-level page components
  types/         TypeScript interfaces
  lib/           Utility helpers
```

## Auth

The dashboard authenticates against `POST /auth/token` with username and password. The JWT is stored in memory (not localStorage) and attached as a `Bearer` token on all API requests.
