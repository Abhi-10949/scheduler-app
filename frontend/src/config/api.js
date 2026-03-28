/**
 * Single place for the API base (`.../api`).
 *
 * - `VITE_API_URL` (e.g. https://your-api.up.railway.app) — used when set (build-time).
 * - Local `npm run dev` / `npm run preview` — `/api` is proxied to the backend (vite.config.js).
 * - Production build without env — falls back to the hosted Render API below.
 */
const envBase = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

export const API_ROOT = envBase
    ? `${envBase}/api`
    : import.meta.env.DEV
      ? "/api"
      : "https://scheduler-app-backend-fdag.onrender.com/api";
