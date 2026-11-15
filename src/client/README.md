# Bookshelf client

The web client: online shop at `/`, staff workspace at `/staff`. Design: [UI_Design.md](../../UI_Design.md).

```bash
npm install
npm run dev            # http://localhost:5173, /api is proxied to the API on http://localhost:8080
npm run api:generate   # regenerate src/api/schema.d.ts (the API must run in Development, where Swagger is served)
npm test
npm run build
```
