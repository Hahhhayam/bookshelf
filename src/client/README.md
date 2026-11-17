# Bookshelf client

The web client of «Полиця»: online shop at `/`, staff workspace at `/staff`, full-screen till at `/staff/till`.

- Behaviour: [UI_Design.md](../../UI_Design.md) · Look: [design/README.md](../../design/README.md) (canvas link and tokens)
- Code rules (Feature-Sliced Design, SOLID): [CONVENTIONS.md](CONVENTIONS.md)
- What the API lacks and how the client works around it: [API_GAPS.md](API_GAPS.md)
- Client technical debt (moves to lower layers, client-side flaws): [REFACTORING.md](REFACTORING.md)

```bash
npm install
npm run dev        # http://localhost:5173; /api is proxied to the API on http://localhost:8080
npm run typecheck
npm test
npm run build
```

Whole system in Docker (database, cache, API and this client behind nginx), from `src/server` with `.env` made
from `.env.example`: `docker compose up -d --build`, then open http://localhost:8081 (the API stays on :8080) and sign in at `/staff/login` as `root` / `root`.
Demo stores, staff, catalog and documents: [src/server/Seed](../server/Seed/README.md).

`VITE_SHOP_CUSTOMER_ID` (optional, in `.env.local`; for Docker, in `src/server/.env`) sets the customer the shop acts for; customers have no login
(the report gives them none), so without it the shop asks for the customer number once, on the first «У кошик».
