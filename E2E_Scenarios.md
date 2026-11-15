# End-to-end scenarios (draft for confirmation)

The most common sequences of use cases per role, to be covered by end-to-end tests through the HTTP API. Each scenario lists its role, the calls in order, and what the test asserts. Once confirmed, each becomes one test.

Sources: [Specification_Bookstore_IS.md](Specification_Bookstore_IS.md) (user scenarios 3.1–3.12, FR-01–FR-20) and [Bookstore_Domain.md](Bookstore_Domain.md).

**Seed data every scenario starts from:** two stores (Store A, Store B) and the central warehouse; roles cashier, store administrator, warehouse keeper, purchasing manager, commercial manager, chain manager and system administrator, with one user each; a category, an author, a publisher, a supplier; three books with stock in Store A and the warehouse; one registered customer with a card and a bonus account; one active promotion.

---

## 1. Customer: find a book and order it for pickup

*Role:* customer (anonymous). *Covers:* FR-03, FR-07, scenario 3.8 (customer side).

1. `GET books?text=…&availableAt={Store A}` → the book is listed with its availability in Store A.
2. `GET books/{id}` → card with price and availability per location.
3. *(Price history: no endpoint exists yet; see "Open questions".)*
4. `POST customers/{customer}/cart/items` for two books.
5. `POST orders` with pickup at Store A → order id.
6. `GET orders/track/{pickupCode}` → status `New`, no staff or personal data in the response.

**Asserts:** available quantity in Store A drops by the ordered amount (reserved); a second search within 30 s may still show the old availability (search cache), but `GET books/{id}` shows the new one (always live).

## 2. Store administrator: fulfil the online order

*Role:* store administrator of Store A. *Covers:* FR-07, FR-08, FR-18, scenarios 3.8 (staff side), 3.10, 3.11.

1. `POST auth/login` → token.
2. `GET locations/{Store A}/orders` → the order from scenario 1, status `New`.
3. `GET orders/{id}` → lines, total, empty history.
4. `POST orders/{id}/status` to `Confirmed`, then `Picking`, then `Ready`.
5. `POST orders/{id}/status` to `Issued`.
6. `GET orders/{id}` and `GET orders/track/{pickupCode}`.
7. `POST auth/logout`, then any staff call → `401`.

**Asserts:** history has four entries with times and this user; on `Ready` an "order ready" notification is sent; on `Issued` on-hand stock drops and the reservation is fulfilled; an illegal transition (e.g. `Issued` → `Picking`) returns an error; another store's administrator gets `403` on this order.

## 3. Cashier: sale with customer card, promotion and bonuses

*Role:* cashier of Store A. *Covers:* FR-04, FR-09, FR-14, FR-15, scenario 3.5, idempotency risk.

1. `POST auth/login`.
2. `GET customers?card={number}` → customer card with bonus balance.
3. `GET books?isbn=…` → the book.
4. `POST sales` with `Idempotency-Key`, the customer, two books (one covered by the promotion), cash payment.
5. Repeat step 4 with the same key.
6. `GET locations/{Store A}/stock?book=…` and `GET customers/{id}`.

**Asserts:** the promotion's discount is applied; the repeated request returns the same sale id and stock drops only once; the purchase appears in the customer's history and bonuses are accrued (1/3/5% by tier) in the same transaction; a sale of more than the available stock is rejected.

## 4. Cashier and store administrator: return

*Roles:* cashier (creates), store administrator (confirms). *Covers:* FR-05, NFR Audit, scenario 3.6.

1. Cashier: `POST returns` for one book of the sale from scenario 3, with reason and condition.
2. Cashier: `POST returns/{id}/confirm` → `403` (no right to confirm).
3. Administrator: `POST returns/{id}/confirm`.
4. `GET locations/{Store A}/stock?book=…`, `GET customers/{id}`, `GET audit?action=return.confirmed`.

**Asserts:** stock and bonuses change only after confirmation; bonuses are reversed proportionally; an audit record exists; returning more than sold minus earlier returns is rejected; a return after the 7-day period is rejected.

## 5. Commercial manager: change a price

*Role:* commercial manager. *Covers:* FR-02, FR-17, scenario 3.3, catalog cache.

1. `POST auth/login`.
2. `GET books/{id}` (fills the item cache).
3. `POST books/{id}/price` with a new price.
4. `GET books/{id}` → the new price straight away.
5. `GET audit?subject={bookId}&action=book.price-changed` → old and new price, this user.
6. *(Price history: see "Open questions".)*

**Asserts:** the cached card is replaced at once; a negative price is rejected; a user without `catalog.price` gets `403`.

## 6. Warehouse keeper and store administrator: transfer between locations

*Roles:* warehouse keeper (sender), store administrator of Store B (receiver). *Covers:* FR-10, scenario 3.7, status history.

1. Keeper: `POST transfers` from the warehouse to Store B, two books.
2. Keeper: `POST transfers/{id}/approve` → available stock at the warehouse drops (reserved).
3. Keeper: `POST transfers/{id}/ship` → on-hand stock at the warehouse drops.
4. Store B: `POST transfers/{id}/receive` with one book short.
5. Store B: `GET locations/{Store B}/transfers` and `GET transfers/{id}`.

**Asserts:** Store B's stock rises by what was actually received; a discrepancy is recorded and the list flags it; history has three entries with the acting users; a user with access to neither end gets `403`; shipping before approval is rejected.

## 7. Purchasing manager and warehouse keeper: order from a supplier and receive it

*Roles:* purchasing manager, warehouse keeper. *Covers:* FR-11, FR-12, FR-18, scenario 3.9.

1. Manager: `POST purchase-orders` with two lines and an expected date in the past.
2. Manager: `POST purchase-orders/{id}/send`.
3. Manager: `GET purchase-orders?overdue=true` → the order is listed as overdue.
4. Keeper: `POST deliveries` for part of the order.
5. Keeper: `POST deliveries` for the rest.
6. `GET purchase-orders/{id}` and `GET locations/{warehouse}/stock`.

**Asserts:** after the first delivery the order is `PartlyReceived`, after the second `Received`; stock rises by the received quantities; history shows Draft → Sent → PartlyReceived → Received; a received order no longer appears as overdue.

## 8. Chain manager: management report

*Roles:* chain manager (chain-wide), store administrator (own store only). *Covers:* FR-16, scenario 3.12.

1. Chain manager: `GET reports/management?from=…&to=…` (no stores → whole chain).
2. Chain manager: the same with `category=…`, then with `locations={Store A}`.
3. Chain manager: `GET reports/management.csv` for the same period.
4. Store administrator: `GET reports/management?…` without stores → `403`; with `locations={Store A}` → `200`.

**Asserts:** revenue, receipts and average check match the sales made in the scenario's setup; the category filter changes revenue to that category only; ABC classes and per-store figures add up; the CSV contains every section.

## 9. System administrator: users and access rights

*Role:* system administrator. *Covers:* FR-01, FR-19, NFR Security, NFR Audit, scenario 3.1.

1. `POST roles` with a set of permissions.
2. `POST users` with that role and access to Store A.
3. New user: `POST auth/login` → `200`; a call outside the role → `403`; a call for Store B → `403`.
4. Admin: `PUT users/{id}/access` adding Store B → the same Store B call now succeeds without logging in again.
5. Admin: `POST users/{id}/block` → the user's existing token stops working; login → blocked.
6. `GET audit?subject={userId}` → created, access changed and blocked records with values before and after.

**Asserts:** rights apply immediately (read on every request); a wrong password is rejected and logged without the password; a blocked user cannot log in.

---

## Decisions

- **Price history** is read through the public `GET books/{id}/prices`.
- **Customer identity:** customers have no login, so scenario 1 uses the seeded customer's id. Placing an order returns the pickup code the customer tracks it with.
- **Test setup** (`src/server/EndToEndTests`): `WebApplicationFactory` with a real SQL Server in a container (Testcontainers), one database per test, the in-memory distributed cache, the stub payment gateway, a notification sender that records what was sent, and a test clock that the scenario can move forward. The scheduled jobs are switched off.
- **Test shape:** each scenario is one class whose single test method reads as the scenario: `Preseed(Sample.Standard)` followed by a chain of steps (`Sells(cashier, …)`, `ConfirmsReturn(admin, …)`). How a step calls the API and checks the response lives in private methods of that class, or in the shared test base when several scenarios use it.
