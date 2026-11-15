# Bookstore UI Design

The design of the web client: who uses it, how it is split, the screens per role, how they behave, and what the API still lacks to support them. It is a design, not a specification of pixels; visual details are settled while building.

Sources: [Specification_Bookstore_IS.md](Specification_Bookstore_IS.md) (users 3.1, scenarios 3.1–3.12, NFR Usability, Performance, Compatibility, constraints 7.1) and the server API in `src/server` (documented with Swagger at `/swagger` in development).

---

## 1. Principles

- **The till comes first.** A sale must be done without unnecessary screens, by keyboard and barcode scanner alone (NFR Usability). The cashier mode is its own focused screen, not a page of the back office.
- **One action, one screen.** Each scenario from the spec maps to one screen or one dialog, with the next allowed actions shown as buttons, by role and status (scenario 3.11).
- **Show what the server decides.** Rights, prices, discounts, availability and allowed transitions come from the API. The client never computes a price or decides a permission on its own; it hides what the user cannot do and still handles a `403`.
- **Status is always visible.** Every document shows its status, the time and person of the last change, and a warning when it is overdue or has a problem (scenario 3.11).
- **Never post twice.** A command that changes stock or money carries an idempotency key that is kept across retries (risk "double posting", constraint "Internet in stores").
- **Simple for mixed skills.** Plain language, confirmation before irreversible actions, hints in empty states (constraint "different user skill levels").

## 2. Applications

One React + TypeScript single-page application with two shells that share the API client, components and design tokens:

| Shell | Path | Users | Sign-in |
|---|---|---|---|
| **Online shop** | `/` | customers | none for now (see [API gaps](#9-api-gaps)) |
| **Staff workspace** | `/staff` | every employee role | session token from `POST /auth/login` |

Inside the staff workspace, the **till** (`/staff/till`) is a full-screen mode with no side navigation.

One app is enough at the chain's size; the shop can be split out later if it needs server rendering for search engines.

## 3. Technology

| Concern | Choice | Why |
|---|---|---|
| Build | Vite 8 + React 19 + TypeScript 7 (strict) | the stack the spec names; fast builds |
| Routing | React Router 8 | nested layouts for the two shells |
| Server state | TanStack Query | caching, refetch on focus, retries, mutation states |
| API client | generated from the OpenAPI document (`openapi-typescript` + `openapi-fetch`); the generator runs with its own TypeScript 5 through `npm exec`, since it does not support TypeScript 7 | request and response types stay in step with the server |
| Components | Mantine 9 | tables, forms, modals, notifications and keyboard hotkeys out of the box |
| Forms | react-hook-form + zod | fast forms, validation messages next to fields |
| Tables | Mantine React Table (TanStack Table) | sorting, filtering, column choice for long lists |
| Charts | Recharts | report dashboards |
| Language | i18next, Ukrainian first, English second | the chain works in Ukrainian |
| Tests | Vitest + Testing Library for components; Playwright for a few smoke flows | |

## 4. Cross-cutting behavior

### Session and rights

- After login the token is kept in `sessionStorage` (it dies with the tab) and sent as `Authorization: Bearer …`. A `401` from any call sends the user to the login screen and keeps the page they were on.
- The workspace builds its navigation and location switcher from `GET /auth/me`: the user's login, the permission codes of all their roles, and the active locations they may work in. It is read after login and again when a `403` suggests rights have changed, since the server applies rights changes immediately.
- Navigation items, buttons and fields are shown only when the user has the permission behind them. A `403` still shows a clear "you do not have the right to do this" message.

### Working location

Most staff work in one store or the warehouse at a time. The header has a **location switcher** listing the user's locations; the chosen one is remembered per browser and used by every screen that is per location (stock, orders, transfers, the till). Users with one location never see the switcher.

### Errors

The API answers with problem details. The client maps them as follows:

| Status | Shown as |
|---|---|
| `401` | back to login |
| `403` | inline message, the action stays disabled |
| `404` | "not found" page or empty card |
| `422` | the server's message next to the form (business rule, e.g. "Not enough available stock") |
| `402` | "payment declined", the till offers another payment method |
| network failure | "No connection" banner; commands keep their idempotency key and can be retried safely |

### Idempotency at the till

The till creates the key when a receipt is opened (`till-{location}-{uuid}`) and keeps it until the receipt is completed. A retry after a lost connection sends the same key, so the server returns the same sale instead of a second one.

### Lists and documents

- Lists default to **open documents** (the API does the same) with a status filter for the rest.
- A document card has a header (number, status badge, last change), the lines, a **History** tab (status changes, and the audit log for users with `audit.view`) and the allowed next actions as buttons.
- Status badges use one color scale everywhere: new/draft grey, in progress blue, ready green, done neutral, cancelled/problem red, overdue amber.

## 5. Online shop (customer)

| Screen | What it does | API |
|---|---|---|
| **Catalog / search** | search by title, author, ISBN, category; filter "available in my store" | `GET /books` |
| **Book page** | card, price, availability per store, price history chart | `GET /books/{id}`, `GET /books/{id}/prices` |
| **Cart** | items and quantities | `POST /customers/{id}/cart/items` |
| **Checkout** | pickup store or delivery address, place order; shows the pickup code | `POST /orders` |
| **Track order** | status and its changes by pickup code | `GET /orders/track/{code}` |

Search results may lag up to 30 seconds (server cache); the book page always shows live availability, so the "Add to cart" decision is made on fresh data.

## 6. Staff workspace

### 6.1 Navigation by role

The side navigation is built from the user's permissions; each role sees only its part.

| Area | Screens | Permission | Typical role |
|---|---|---|---|
| **Till** | sale, return at the till | `sales.create`, `returns.create` | cashier |
| **Orders** | order board, order card | `orders.manage` | store administrator |
| **Stock** | stock list, reservations, minimum stock, adjustments, write-offs | `stock.adjust`, `writeoff.create` | store administrator, warehouse keeper |
| **Transfers** | transfer list, new transfer, transfer card | `transfers.manage` | warehouse keeper, store administrator |
| **Inventory counts** | open count, count sheet, approve | `inventory.count`, `inventory.approve` | store administrator |
| **Purchasing** | purchase orders, late deliveries, suppliers, missing-book requests | `purchasing.manage` | purchasing manager |
| **Receiving** | expected deliveries, receive delivery | `receiving.confirm` | warehouse keeper |
| **Returns** | returns waiting for confirmation | `returns.confirm` | store administrator |
| **Catalog** | books, authors, publishers, categories, prices | `catalog.edit`, `catalog.price` | commercial manager |
| **Customers** | customer card, segments | `crm.manage` | CRM manager, cashier (card only) |
| **Promotions** | promotions | `promotions.manage` | marketing |
| **Reports** | management report, CSV export | `reports.view` (+ `reports.chain`) | chain manager, store administrator |
| **Administration** | users, roles, locations, integrations, audit log | `users.manage`, `locations.manage`, `integrations.manage`, `audit.view` | system administrator |

Each role lands on its start page after login (scenario 3.1): cashier → till, store administrator → order board, warehouse keeper → transfers, purchasing manager → late deliveries, commercial manager → catalog, chain manager → reports, system administrator → users.

### 6.2 Till (scenario 3.5)

A full-screen layout made for a scanner and a keyboard:

```
┌──────────────────────────────────────────────────────────────┐
│ Store A · cashier.a                      ● online   [F12 Exit]│
├───────────────────────────────────────┬──────────────────────┤
│ [ Scan or search…               ] F2  │ Customer   F4        │
│                                       │ Olena K. · Basic     │
│  #  Item              Qty  Price  Sum │ Bonuses: 7           │
│  1  Kobzar             1   300   300  │                      │
│  2  Dune  -10% promo   1   450   405  │ Total        705.00  │
│                                       │                      │
│                                       │ [F8 Cash] [F9 Card]  │
│                                       │ [F10 Gift cert.]     │
└───────────────────────────────────────┴──────────────────────┘
```

- The scan field always has focus. A barcode scanner types the code and Enter; the item is found and added. Typing letters searches by title.
- Keys: `F2` search, `F4` customer by card, `+`/`-` quantity of the selected line, `Del` remove line, `F8`/`F9`/`F10` pay, `Esc` cancel the dialog, `F12` leave the till.
- Promotions and the total are what the server returns. **This needs a new pricing call** before payment (see [API gaps](#9-api-gaps)); until then the till shows catalog prices and the server's total arrives with the completed sale.
- Payment splits (cash + bonuses + gift certificate) are entered in one dialog that shows what is still left to pay.
- After completion: a receipt summary, a new receipt key, focus back on the scan field.

### 6.3 Order board (scenarios 3.8, 3.11)

A board with one column per status: New, Confirmed, Picking, Ready. Each card shows the order number, customer, item count, time since the last change, and a warning when it has waited too long.

- The button on a card moves the order to the next allowed status (`POST /orders/{id}/status`); Cancel is in the card's menu with a confirmation.
- Opening a card shows lines, total, fulfilment, pickup code and the history.
- Issued orders leave the board; they are found through the list with the status filter.

### 6.4 Transfers (scenario 3.7)

- **List** per location, both directions, with a red badge on transfers with unresolved discrepancies.
- **New transfer:** choose the destination and items; available quantities at the sender are shown and checked.
- **Card:** the step buttons follow the status and the side of the route: the sender approves and ships, the receiver enters what arrived. Receiving pre-fills the shipped quantities, so only differences need typing. Discrepancies are listed with expected and actual quantities.

### 6.5 Receiving (scenario 3.9)

The keeper picks an expected delivery (a sent purchase order) or "unplanned delivery". Lines show ordered, already received and now received; scanning a barcode adds one to its line. Differences are highlighted before confirmation.

### 6.6 Inventory count (scenario 3.10, FR-13)

A count sheet per location: scan or type counted quantities line by line; lines with differences are highlighted; "Complete" then "Approve" (by a user with `inventory.approve`) posts the adjustments.

### 6.7 Catalog and prices (scenarios 3.2–3.4)

- **Book list** with search and filters; the book form for add and edit; author, publisher and category pickers with "create new" inline.
- **Price change** in a dialog that shows the old and new price and asks for confirmation (scenario 3.3), with the price history chart under it.
- **Remove** asks the server: it either deletes or deactivates, and the result is shown ("deactivated because it has open orders").

### 6.8 Reports (scenario 3.12)

Filters: period (presets: today, week, month, custom), stores, category, book. The dashboard shows revenue, margin, receipts, average check and days of stock as tiles; top books and ABC analysis as tables; stores and categories as bar charts; shortages and slow-moving books as lists. "Export CSV" downloads the same report.

### 6.9 Administration

Users (create, block, unblock, roles and locations), roles (name and permission checklist grouped by area), locations, integrations (enable, disable, status) and the audit log (filters by subject, action and period). Rights changes ask for confirmation and show what will change.

## 7. Project structure

```
src/client/
  src/
    api/            generated OpenAPI types, client, query keys
    app/            router, providers, the two shells
    auth/           login, session, permission checks
    components/     shared UI: status badge, document card, data table, money, hotkeys
    features/
      shop/         catalog, book page, cart, checkout, tracking
      till/
      orders/
      stock/
      transfers/
      counts/
      purchasing/
      receiving/
      returns/
      catalog/
      customers/
      promotions/
      reports/
      admin/
    i18n/           uk, en
```

Each feature folder holds its routes, screens, hooks and components; features talk to each other only through routes.

## 8. Delivery order

1. Skeleton: Vite app, generated API client, login, staff shell, location switcher, permission-driven navigation.
2. Till (the most used and most demanding screen).
3. Order board and order card; the online shop's search, book page, cart, checkout and tracking.
4. Stock, transfers, receiving.
5. Catalog, purchasing, returns, customers.
6. Reports.
7. Administration, inventory counts, promotions.

## 9. API gaps

What the screens above need and the server does not offer yet:

| Need | Proposal | Used by |
|---|---|---|
| Price a receipt before payment (promotions, total) | `POST /sales/quote` with the same lines as a sale | till |
| Find a book by barcode | `barcode` filter on `GET /books` | till, receiving, counts |
| Lists of reference data | `GET` lists for authors, publishers, categories, suppliers, locations, roles, users, segments, promotions, integrations | pickers and administration |
| Lists of documents | `GET` lists for returns (pending), inventory counts, write-offs, sales of a day | returns, counts, stock, till |
| Customer search | by name or phone, not only by card | customers |
| Customer sign-in | accounts for the online shop; until then the shop works with a customer id and the pickup code | online shop |
| Same origin in production | serve the built client and the API from one origin (e.g. one reverse proxy); development already uses the Vite proxy for `/api`, so no CORS is needed | all |
