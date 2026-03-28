/**
 * Backend origin (no trailing slash). Set VITE_API_URL in Railway/Vercel/etc.
 * Example: https://scheduler-api-production.up.railway.app
 * Local dev: leave unset → http://localhost:8000
 */
const origin = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
    /\/$/,
    ""
);

export const API_ROOT = `${origin}/api`;
