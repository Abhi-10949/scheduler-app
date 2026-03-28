/**
 * API base path.
 *
 * - If `VITE_API_URL` is set (e.g. https://your-app.up.railway.app), requests go there.
 *   Required for production when the frontend is on a different host than the API.
 *
 * - If unset, uses `/api` so Vite dev + preview can proxy to the local backend (see vite.config.js).
 *   Run the backend on port 8000, then `npm run dev` or `npm run preview`.
 */
const envBase = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

export const API_ROOT = envBase ? `${envBase}/api` : "/api";
