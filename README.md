# Bharathraj S: Interactive 3D Book Portfolio

React + React Three Fiber frontend, Spring Boot (Java 21) backend, PostgreSQL.

Status: Phase 1 (foundation) and Phase 2 (3D book and front cover) complete.

## Quick start

```bash
./setup.sh                      # generates base projects, installs deps, starts Postgres
cd backend && ./mvnw spring-boot:run
cd frontend && npm run build    # type-check
cd frontend && npm run dev
```

## Phase 1 checks

1. `docker ps` shows `portfolio-db` running.
2. `curl localhost:8080/actuator/health` returns `{"status":"UP"}`.
3. `curl -i localhost:8080/api/admin/anything` returns 401 or 403.

## Phase 2 checks

1. `npm run build` finishes with no TypeScript errors.
2. `http://localhost:5173` shows a royal-blue hardcover with gold foil text, visible page edges and a soft shadow.
3. Mouse movement tilts the book; clicking it or the Open Book button gives a brief lean-in.
4. `http://localhost:5173/?nowebgl` shows the flat fallback cover.
5. Emulate `prefers-reduced-motion: reduce`: sway and sparkles stop.
6. Phone-width viewport keeps the whole book in frame.

Tuning constants: top of `frontend/src/components/book/Book.tsx`; light panels in `BookScene.tsx`.

Set `DB_PASSWORD` in your environment to override the local default database password.
# profolio
