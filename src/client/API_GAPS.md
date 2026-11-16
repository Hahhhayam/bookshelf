# API gaps

What the client needs from the API to do what the project report (`Звіт_Книжковий магаз.md`) asks, and how it works around
the lack. Every workaround in the code is a `stub('GAP-NN', …)` call
or a comment naming the gap, so `GAP-NN` finds all of them. Remove a stub when the server closes its gap.

- **Missing** — data or an endpoint the report requires that does not exist; the client stubs it or leaves the part out.
- **Redundant** — something the API or the client has that no screen needs.
- **Broken** — something that exists but cannot work as the screens need; the client stubs around it.

## Missing

| Id | Missing | Used by | Client workaround |
|---|---|---|---|
| GAP-01 | Read, change and remove cart lines (`GET/PUT/DELETE /customers/{id}/cart`); only "add" exists | shop cart, checkout | The cart lives in the browser (`entities/cart`) and is sent line by line right before `POST /orders` |
| GAP-03 | Lists of authors, publishers, categories, suppliers and all locations | catalog pickers, book form, references, suppliers, transfer destination, names in every list | The browser remembers what it created or saw (`shared/lib/remembered`, `entities/reference`); unseen ids show as `#xxxxxxxx` |
| GAP-04 | User names for user ids (history "by", "last changed by") | every document card and list | Shows the login for users remembered here, else a short id |
| GAP-05 | Pricing a receipt before payment (`POST /sales/quote`: promotions, discounts, total) | till | The till quotes catalog prices without promotions and marks the total as approximate; see B-01 |
| GAP-06 | Finding a book by shop barcode (`barcode` filter on `GET /books`) | till, receiving, counts | An ISBN-looking code goes to the `isbn` filter, anything else to text search |
| GAP-07 | Sales of a shift / day, and reading one sale (`GET /sales`, `GET /sales/{id}`) | cashier home "my receipts", returns | Receipts completed in this tab are remembered in session storage |
| GAP-08 | Reading inventory counts (`GET /inventory-counts`, `GET /inventory-counts/{id}` with expected quantities) | counts, count sheet | Counts started here are remembered; the sheet's expected quantities come from current stock |
| GAP-10 | Lists of users, roles and integrations | administration | Remembered when created here |
| GAP-12 | Lists of promotions and segments | promotions, segments, customer card | Remembered when created here |
| GAP-13 | Titles with book ids in lists (orders, transfers, purchase orders, reports), or a batch lookup | every list with books | One cached `GET /books/{id}` per book |
| GAP-14 | A public list of stores for pickup | shop checkout, book page | Stores are the locations that appear in a book's availability; names are not public, so they show as "Магазин #xxxx" unless remembered |
| GAP-16 | Pending returns to confirm (`GET /returns?status=Pending`) | returns | Returns created in this browser are remembered |
| GAP-17 | Gift certificate balance check | till split payment | The balance is unknown until the server accepts or refuses the payment |
| GAP-20 | Reading goods receipts (deliveries) | receiving | Only the created delivery's id is shown |
| GAP-24 | Search facets on `GET /books`: categories and publishers to filter by (FR-03, table 2.1 «Пошук») | shop catalog | Free text and the «available in my store» filter only |
| GAP-25 | `POST /orders` returns only `id` and `pickupCode`; no anonymous read of the placed order (lines, total, store). `GET /orders/{id}` needs `OrdersManage`, `GET /orders/track/{code}` has no lines or total | shop confirmation, tracking («3 книжки», store, total) | The checkout hands its own summary (cart lines, client-summed total, chosen store) to the confirmation page in navigation state; a reload shows a link to tracking instead. Tracking shows status and history only |
| GAP-27 | Opening and closing a cashier shift, and refusing a sale without an open shift (3.5 «Каса відкрита», table 1.1 store admin «Контролює зміни») | till header, cashier home | No shift: the till sells whenever the cashier is signed in |
| GAP-31 | Resolving transfer discrepancies with a reason (`POST /transfers/{id}/discrepancies/{d}/resolve`); the Document artboard has a reason per line and "Підтвердити розбіжності" | transfer card | Discrepancies are shown read-only (expected, actual, difference, open/closed); no resolve action, no stub, since faking success would hide a stock difference |
| GAP-34 | Finding an order by its pickup code to issue it (table 2.7 «Самовивіз… видача за номером або кодом») | order board | Loaded cards are filtered locally by short order id or customer id |
| GAP-38 | "All statuses" on `GET /purchase-orders`: without `status` it returns open orders only | list filter "Статус: усі" (and the empty state's "Показати всі") | Three calls joined: open + `Received` + `Cancelled` (`stub('GAP-38', …)` in `features/purchasing-order-filters`) |
| GAP-39 | Cancelling a purchase order (`POST /purchase-orders/{id}/cancel`). The domain has `PurchaseOrder.Cancel`, but there is no endpoint | purchase order card actions | Not shown. A draft that is not needed stays a draft. |
| GAP-41 | Finding deactivated books (`status` / `includeInactive` filter on `GET /books`) and reactivating one (`PUT /books/{id}/active`) | catalog list, book form | The list shows active books only; a deactivated book opens only by its link and cannot be put back on sale (see B-41) |
| GAP-42 | Editing a customer's contact data (`PUT /customers/{id}`; table 2.1 «Картка клієнта», scope «ведення клієнтської бази») | customer card | Contacts are read-only after registration |
| GAP-47 | Integration connection state (last exchange, last error); UI_Design 6.9 lists "status" | integrations | The status column shows enabled / disabled only, and the note says the server does not report the connection state |
| GAP-48 | Field-level before/after in the audit log (FR-17 «значення ключових полів до і після»); today they are free text | audit, history tabs | Before/after are shown as text, collapsed to one line and expanded per row |
| GAP-49 | Comparison with the previous period in the management report (table 1.1, Керівник мережі «порівняння періодів») | reports | Tiles show no trend |
| GAP-50 | Address and active state of the user's own locations (`/auth/me` returns id, name and type only) | locations, users | Such a location shows the address as «невідома» and is assumed active until it is edited or (de)activated here |
| GAP-51 | An effective moment for a price change on `POST /books/{id}/price` (3.3 «нова ціна стає активною з указаного моменту») | price dialog | The new price applies at once |
| GAP-52 | The buyer's bonus balance, tier and history in the shop (table 1.1 Покупець «отримує інформацію про … бонуси», FR-14); `GET /customers/{id}` is staff-only | shop | Not shown |
| GAP-53 | Personal offers: a promotion aimed at a segment or a customer (table 2.1 CRM, table 2.7 «персональні пропозиції»); `PromotionCondition` knows only book, category and quantity | promotions | Promotions apply to everybody |
| GAP-54 | Need forming: what to order, from stock below minimum and missing-book requests (table 2.1 «Формування потреби», table 1.1 «Прогноз потреби») | purchasing | Not shown; the purchasing manager picks lines by hand |

## Redundant

| Id | What | Why |
|---|---|---|
| R-01 | OpenAPI-generated client types (`openapi-typescript` + `openapi-fetch`) | The controllers return anonymous objects through `IActionResult` without `[ProducesResponseType]`, so the OpenAPI document has no response schemas. The client types requests and responses by hand in `entities/*/api` instead, and the generator was removed. |
| R-02 | `shippedBy` / `receivedBy` on the transfer card | The same users are in the transfer's history. |
| R-03 | `POST /sales/{id}/payments/{payment}/confirm` | The stub payment gateway always captures, so no payment is ever pending. |
| R-36 | `supplier` in `POST /deliveries` when `purchaseOrder` is given | The server takes the supplier from the order. The client sends `null` in that case. |
| R-42 | A separate barcode lookup for the catalog (GAP-06) | `GET /books?text=` already matches an exact barcode as well as the title (`CatalogSearch`), so the admin list's single "назва або штрихкод" field covers it; GAP-06 is effectively closed for exact codes and `bookApi.findByCode` could drop its ISBN branch for barcodes. |
| R-46 | Permission `integrations.report` | No endpoint requires it. The role editor still lists it («Звіт інтеграцій» under «Звіти») so a role can carry every server code. |

## Broken

| Id | What | Effect | Client workaround |
|---|---|---|---|
| B-01 | The till cannot learn the total after promotions before payment (GAP-05), while `POST /sales` requires payments to equal that total | A sale with a promoted book is refused with 422 | The till shows the server's message and lets the cashier correct the amount |
| B-02 | The server cart can only grow (GAP-01) | Removing an item in the shop would not reach the server | The cart is local until checkout (GAP-01) |
| B-21 | The server cart survives a failed `POST /orders` (it is cleared only on success) and can only grow (GAP-01, B-02) | Retrying checkout after a refusal (e.g. 422 «not enough stock») would add every line a second time, so the order would double | `features/shop-place-order` remembers per customer what it already sent and sends only the difference; if the customer lowered a quantity or removed a line that was already sent, checkout refuses with a message instead of placing a wrong order. The record is cleared after a successful order |
| B-22 | No public store list (GAP-14) also means no store type: a book's availability may include warehouses | A warehouse could be offered as a pickup store or chosen as the stock location for delivery | Not worked around; every location in availability is treated as a store. Needs `GET /stores` (or a type in availability) |
| B-26 | Business-rule messages (422) come in English (e.g. "Payments must add up to the receipt total.") while the interface is Ukrainian, and carry no machine-readable code | The cashier reads an English sentence; the client can recognise B-01 only by matching the text | `features/till-payment/model/failure.ts` matches `/add up|total/i` to show the B-01 explanation and the «Змінити суму оплати» path; the server text is shown as it is |
| B-27 | `POST /sales` requires payments to equal the total exactly, so cash handed over and change cannot be recorded | The server never learns the tendered cash | The till computes change locally and sends cash minus change (`toPayments`); the tendered amount is shown on the closed receipt only |
| B-31 | The client lets `writeoff.create` open "/staff/stock" and `inventory.approve` open "/staff/counts/:id", but `GET /locations/{id}/stock` does not accept either permission | A user with only one of those rights gets 403 on the stock list, and an approver sees no expected quantities on the count sheet | The pages show the 403 message from `QueryView`; server should add both codes to the stock read, or the route guards should drop them |
| B-36 | `POST /deliveries` takes no `Idempotency-Key`, yet it raises stock (CONVENTIONS: stock-changing commands keep their key across retries) | A retry after a lost answer receives the goods twice and doubles the stock | The confirm button is disabled after a success and the dialog stays open while the request is pending. A failed request is retried only by hand. |
| B-37 | A purchase order has no history entry for its creation; history starts at Draft → Sent | A fresh draft shows "Остання зміна: —" in the list and no history on the card | The card header says "Чернетка ще не відправлялась" instead of a last change |
| B-41 | `GET /books` filters to `SaleStatus.Active` for every caller, staff included | After «Видалити / деактивувати» returns `Deactivate`, the book vanishes from the staff catalog; the add form's "ISBN already exists" hint cannot see a deactivated duplicate (the server still refuses it with 422 on save) | The list footnote says deactivated books are not shown; the book page stays open after deactivation with a «Деактивована» badge and an explanation |
| B-46 | `GET /audit` applies a period only when both `from` and `to` are given, and silently ignores a half one | A filter "from 01.11" returns the whole history | The audit page sends a period only when both dates are valid, marks the inputs «Період не застосовано» otherwise, and asks for at least one filter before querying |
| B-51 | `POST /returns` takes no `Idempotency-Key` (constraint «Інтернет у магазинах»: cash operations must not repeat on resend) | A retry after a lost answer creates a second return | The confirm button is disabled while the request is pending |

## Notes

### Till, returns, staff home

- B-01 handling: on a 422 the till shows the server message, explains that promotions may change the amount, and
  opens the split dialog with an editable «До сплати» so the cashier can enter the server's amount. The same
  operation key is resent.
- Voiding a receipt (Ctrl+Del) after an unanswered attempt starts a new key; if that attempt did reach the server,
  the sale stays posted. An offline queue (GAP-19) would close this.
- The stock check on scan uses the search result's availability (may lag 30 s); the server checks again.

## Dropped

The mock-up artboards showed features the report does not ask for; the client no longer shows them, so their gaps are
closed: GAP-02 customer sign-in, GAP-09 write-off and reservation lists, GAP-11 customer search by name or phone,
GAP-15/32/33 extra list columns, GAP-18 login lockout, GAP-19 offline sale queue, GAP-21 customer cancellation,
GAP-22 online payment choice, GAP-23 delivery cost, GAP-26 receipt and fiscal numbers, GAP-28 sale outcome,
GAP-35 transfer waybill, GAP-36 purchase order numbers, GAP-37 purchase order totals in the list, GAP-40 supplier
confirmation, GAP-43 changing promotions, GAP-44 audit on viewing a customer, GAP-45 extra book and customer fields,
GAP-46 role descriptions. R-41 was wrong (3.3 asks for an effective moment, now GAP-51); R-47 was wrong (3.12 asks for
average check and margin, «ефективність магазинів»).

## Client work the report requires (the API already allows it)

Not API gaps: the endpoints exist, the screens do not use them yet.

- Till: a permitted manual discount (FR-04; `manualDiscount` on `POST /sales`), cancelling a posted sale with the
  rights check (table 2.1; `POST /sales/{id}/cancel`), selling a gift certificate (table 2.7; `POST /gift-certificates`),
  and the bonus write-off the customer is allowed (3.5 step 3).
- Purchasing: recording a missing-book request (table 2.7; `POST /missing-book-requests`).
- Catalog: an «Історія» tab on the book card (3.10, FR-17; `GET /audit` by subject), and publisher / store
  availability filters in the staff catalog (FR-03; `GET /books` takes `publisher` and `availableAt`).
- Order board: who made the last change on the board tiles, as the list view already shows (3.11 step 2).
- Reports: choosing which figures to show and drilling down from a figure to its details (3.12 steps 2 and 4).
