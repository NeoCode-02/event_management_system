Event Management Frontend

Run locally:

- Install Node 18+ or use Docker from project root
- Dev server: `npm install && npm run dev` inside `frontend/`

Environment:
- Vite dev server runs on port 3000
- API proxy `/api` -> `http://localhost:8000`

Available pages:
- `/events` list of events
- `/events/:id` event detail + public registration
- `/login`, `/register`, `/verify` auth flow
- `/dashboard` create and manage your events


