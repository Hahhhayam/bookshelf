# API gaps

What the client needs from the API and works around. Every workaround in the code is a `stub('GAP-NN', …)` call
or a comment naming the gap, so `GAP-NN` finds all of them. Remove a stub when the server closes its gap.

- **Missing** — data or an endpoint the screens need that does not exist; the client stubs it or leaves the part out.
- **Redundant** — something the API or the client has that no screen needs.
- **Broken** — something that exists but cannot work as the screens need; the client stubs around it.

## Missing

| Id | Missing | Used by | Client workaround |
|---|---|---|---|
| GAP-01 | Read, change and remove cart lines (`GET/PUT/DELETE /customers/{id}/cart`); only "add" exists | shop cart, checkout | The cart lives in the browser (`entities/cart`) and is sent line by line right before `POST /orders` |
| GAP-02 | Customer sign-in for the shop | shop checkout, tracking | The shop acts for a customer id from `VITE_SHOP_CUSTOMER_ID` or entered once at checkout (`entities/shopper`) |
| GAP-03 | Lists of authors, publishers, categories, suppliers and all locations | catalog pickers, book form, references, suppliers, transfer destination, names in every list | The browser remembers what it created or saw (`shared/lib/remembered`, `entities/reference`); unseen ids show as `#xxxxxxxx` |
| GAP-04 | User names for user ids (history "by", "last changed by") | every document card and list | Shows the login for users remembered here, else a short id |
| GAP-05 | Pricing a receipt before payment (`POST /sales/quote`: promotions, discounts, total) | till | The till quotes catalog prices without promotions and marks the total as approximate; see B-01 |
| GAP-06 | Finding a book by shop barcode (`barcode` filter on `GET /books`) | till, receiving, counts | An ISBN-looking code goes to the `isbn` filter, anything else to text search |
| GAP-07 | Sales of a shift / day, and reading one sale (`GET /sales`, `GET /sales/{id}`) | cashier home "my receipts", returns | Receipts completed in this tab are remembered in session storage |
| GAP-08 | Reading inventory counts (`GET /inventory-counts`, `GET /inventory-counts/{id}` with expected quantities) | counts, count sheet | Counts started here are remembered; the sheet's expected quantities come from current stock |
| GAP-09 | Lists of write-offs and reservations | stock | Not shown; a write-off or reservation is confirmed by its id only |
| GAP-10 | Lists of users, roles and integrations | administration | Remembered when created here |
| GAP-11 | Customer search by name or phone | customers, till | Only by card number or id |
| GAP-12 | Lists of promotions and segments | promotions, segments, customer card | Remembered when created here |
| GAP-13 | Titles with book ids in lists (orders, transfers, purchase orders, reports), or a batch lookup | every list with books | One cached `GET /books/{id}` per book |
| GAP-14 | A public list of stores for pickup | shop checkout, book page | Stores are the locations that appear in a book's availability; names are not public, so they show as "Магазин #xxxx" unless remembered |
| GAP-15 | Order list with totals and item counts | order board | Cards show what the list returns; the total is on the order card |
| GAP-16 | Pending returns to confirm (`GET /returns?status=Pending`) | returns | Returns created in this browser are remembered |
| GAP-17 | Gift certificate balance check | till split payment | The balance is unknown until the server accepts or refuses the payment |
| GAP-18 | Failed-attempt count and lockout for login | login | The design's "2 attempts left" line is not shown |
| GAP-19 | Offline cash sales with a send queue | cashier shell, till | Offline banner only; a sale is retried by hand with the same operation key |
| GAP-20 | Reading goods receipts (deliveries) | receiving | Only the created delivery's id is shown |
| GAP-21 | Customer cancellation of their own order (by pickup code). `POST /orders/{id}/status` needs `OrdersManage` | shop confirmation («Скасувати замовлення»), checkout note | No cancel link; the checkout and confirmation tell the customer to cancel in the store with the pickup code |
| GAP-22 | Payment method choice for an online order (pay in store / card online) on `POST /orders` | shop checkout, section «Оплата» | Only «У магазині при отриманні» is shown, as text, no choice |
| GAP-23 | Delivery cost (a quote for a delivery order, or the cost in the order total) | shop checkout summary | Delivery line shows «за тарифом»; the total excludes delivery |
| GAP-24 | Shop showcase data on books: effective price after promotions (old price, promotion name and end date), author names, description, year, pages, language, cover image; facets for search (categories, publishers, price range), sort and paging on `GET /books` | catalog cards and filters, book page, cart | Catalog prices only, no strike-through price or promo badge; typographic covers coloured by book id; author/publisher/category names via remembered references (GAP-03); only the «available in my store» filter (`availableAt`); no sort or pages |
| GAP-25 | `POST /orders` returns only `id` and `pickupCode`; no anonymous read of the placed order (lines, total, store). `GET /orders/{id}` needs `OrdersManage`, `GET /orders/track/{code}` has no lines or total | shop confirmation, tracking («3 книжки», store, total) | The checkout hands its own summary (cart lines, client-summed total, chosen store) to the confirmation page in navigation state; a reload shows a link to tracking instead. Tracking shows status and history only |
| GAP-26 | A receipt number and fiscal number for a sale, and printing / e-mailing a receipt (`POST /sales` returns only `id`) | till closed receipt, cashier home "my receipts" | The short sale id (`shortId`) stands in for «Чек №»; the full id is shown under the payment summary; «Друкувати ще раз» and «Надіслати на e-mail» from the artboard are not shown |
| GAP-27 | Cashier shifts and registers (open/close a shift, its start time, register number «Каса 2») | till header, cashier home greeting | The header shows «Каса», store and login; the home page shows the date without «зміна з 09:00»; "my receipts" are the receipts of this browser tab (GAP-07) |
| GAP-28 | The completed sale's outcome: the total after promotions, promotions per line, bonuses accrued and the new balance | till closed receipt, line table «Акція» column, totals «Знижки за акціями» / «Буде нараховано бонусів» | The closed receipt shows the total the cashier paid and «Бонуси нарахує сервер»; the «Акція» column and the discount/bonus rows of the totals are left out until GAP-05 / GAP-28 exist |
| GAP-31 | Resolving transfer discrepancies with a reason (`POST /transfers/{id}/discrepancies/{d}/resolve`); the Document artboard has a reason per line and "Підтвердити розбіжності" | transfer card | Discrepancies are shown read-only (expected, actual, difference, open/closed); no resolve action, no stub, since faking success would hide a stock difference |
| GAP-32 | Line and unit counts and the expected arrival date in the transfer list (artboard columns "Позиції", "Очікується") | transfers | Columns not shown; counts are on the card |
| GAP-33 | Customer name and fulfilment kind (pickup / delivery, carrier) in the order list; the Kanban card shows both | order board | Cards show the customer's short id and the order type (Роздріб / B2B); fulfilment is on the order card |
| GAP-34 | Staff search of orders by phone or pickup code (artboard search "Номер, клієнт або телефон") | order board | Loaded cards are filtered locally by short order id or customer id |
| GAP-35 | Created at/by and the carrier waybill on the transfer card (artboard facts "Створено", "Накладна перевізника") | transfer card | "Відправлено" and "Отримано" are taken from the history; creation and waybill are not shown |
| GAP-36 | A human-readable purchase order number (the artboard shows `ЗП-2026-0318`) | purchase order list, card, receiving | `ЗП-` + the first block of the GUID (`purchaseOrderNumber`). Search by number matches that form only. |
| GAP-37 | Total, line count and creation date in `GET /purchase-orders` | purchase order list ("Сума" column, "Останні 30 днів" filter, search by ISBN) | The total comes from one `GET /purchase-orders/{id}` per row (`useOrderTotals`, shares the card cache). The period filter and ISBN search are not offered: search covers number and supplier only. |
| GAP-38 | "All statuses" on `GET /purchase-orders`: without `status` it returns open orders only | list filter "Статус: усі" (and the empty state's "Показати всі") | Three calls joined: open + `Received` + `Cancelled` (`stub('GAP-38', …)` in `features/purchasing-order-filters`) |
| GAP-39 | Cancelling a purchase order (`POST /purchase-orders/{id}/cancel`). The domain has `PurchaseOrder.Cancel`, but there is no endpoint | purchase order card actions | Not shown. A draft that is not needed stays a draft. |
| GAP-40 | Supplier confirmation and rejection of an order. The artboard has the statuses "Підтверджено" and "Відхилено частково" and the flag "Постачальник відхилив 4 позиції"; the API knows only Draft / Sent / PartlyReceived / Received / Cancelled | list "problem" rows, card | A row counts as a problem when its status tone in `purchaseOrderStatus` is `problem` (today only `Cancelled`, seen under "усі" or "скасовано"). There is no rejection flag text. |
| GAP-41 | Finding deactivated books (`status` / `includeInactive` filter on `GET /books`) and reactivating one (`PUT /books/{id}/active`) | catalog list, book form | The list shows active books only; a deactivated book opens only by its link and cannot be put back on sale (see B-41) |
| GAP-42 | Editing a customer's contact data (`PUT /customers/{id}`) and manual bonus accrual | customer card (artboard buttons «Редагувати», «Нарахувати бонуси вручну») | Buttons not shown; contacts are read-only after registration |
| GAP-43 | Changing or ending a promotion early (`PUT /promotions/{id}`, `POST /promotions/{id}/end`) | promotions | Create only; the list says promotions cannot be changed |
| GAP-44 | An audit entry when someone opens a customer card (the artboard says "viewing is recorded in the audit log"; `GetCustomerCardUseCase` records nothing) | customer card | The personal-data banner does not claim auditing; contacts are masked until «Показати» |
| GAP-45 | Fields the artboards show but the API does not have: book purchase price / margin, year, pages, annotation, cover; customer registration date, favourite store, birthday, mailing consent; book titles and receipt numbers in the purchase history | book form, customer card | Not shown; purchases show the sale's short id, the location name if remembered (GAP-03), and the total |
| GAP-46 | A role's description and the number of users who hold it (FormDialogs artboard: «Опис», «Роль мають 6 працівників») | roles | Not shown; the editor has the name and the permission checklist only |
| GAP-47 | Integration connection state (last exchange, last error); UI_Design 6.9 lists "status" | integrations | The status column shows enabled / disabled only, and the note says the server does not report the connection state |
| GAP-48 | Audit log: filter by user and by object type, the location of a change («Де»), server paging, CSV export, field-level before/after (they are free text) | audit | Filters by subject, action and period only; the whole answer is sorted and paged on the client (50 at a time); before/after are shown as text, collapsed to one line and expanded per row; no export button |
| GAP-49 | Management report: margin per book and authors in "top books", comparison with the previous period (the artboard's ▲/▼ figures), location / on hand / last sale for slow-moving books (only ids come back), days of stock per shortage (the API gives the minimum instead) | reports | Top books show title, sold and revenue; tiles show no trend; slow-moving books are titles only; shortages show on hand and minimum |
| GAP-50 | Address and active state of the user's own locations (`/auth/me` returns id, name and type only) | locations, users | Such a location shows the address as «невідома» and is assumed active until it is edited or (de)activated here |

## Redundant

| Id | What | Why |
|---|---|---|
| R-01 | OpenAPI-generated client types (`openapi-typescript` + `openapi-fetch`) | The controllers return anonymous objects through `IActionResult` without `[ProducesResponseType]`, so the OpenAPI document has no response schemas. The client types requests and responses by hand in `entities/*/api` instead, and the generator was removed. |
| R-02 | `shippedBy` / `receivedBy` on the transfer card | The same users are in the transfer's history. |
| R-03 | `POST /sales/{id}/payments/{payment}/confirm` | The stub payment gateway always captures, so no payment is ever pending. |
| R-36 | `supplier` in `POST /deliveries` when `purchaseOrder` is given | The server takes the supplier from the order. The client sends `null` in that case. |
| R-41 | «Діє з» (effective date) and «Причина» (reason) in the FormDialogs price dialog | FR-02: a price change applies at once, scheduled prices are not supported, and `POST /books/{id}/price` takes no reason. The dialog shows old/new price and the difference only. |
| R-42 | A separate barcode lookup for the catalog (GAP-06) | `GET /books?text=` already matches an exact barcode as well as the title (`CatalogSearch`), so the admin list's single "назва або штрихкод" field covers it; GAP-06 is effectively closed for exact codes and `bookApi.findByCode` could drop its ISBN branch for barcodes. |
| R-46 | Permission `integrations.report` | No endpoint requires it. The role editor still lists it («Звіт інтеграцій» under «Звіти») so a role can carry every server code. |
| R-47 | `stores[].margin`, `stores[].receipts`, `stores[].averageCheck` in `GET /reports/management` | The dashboard charts revenue per store only (Reports artboard); the extra figures reach the user through the CSV. |

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
| B-47 | `referenceApi.updateLocation` / `setLocationActive` (client, `entities/reference`) update the local copy only when the location was already remembered | Editing a location known only from `/auth/me` succeeds on the server but the list keeps the old name/state | `features/admin-locations` remembers the location (`rememberBeforeChange`) before changing it |
| B-48 | `useManagementReport` (client, `entities/report`) has no `enabled` flag | Mounted before `/auth/me` answers, it would ask for the whole chain (empty `locations`) and get 403 for a user without `reports.chain` | The reports page mounts the dashboard only after the viewer is loaded |

## Proposed moves

Code the area slices built for themselves because they could not edit lower layers. Each row is reuse waiting to happen; move it when a second screen needs it.

### Shop

| What | Now in | Move to | Why |
|---|---|---|---|
| `QuantityStepper` | `widgets/shop-kit/ui` | `shared/ui` | Generic − n + control; the till and receiving can reuse it |
| `AvailabilityNote` (dot + word in a status colour) | `widgets/shop-kit/ui` | `shared/ui` | Generic status text that is not a badge |
| `pluralBooks` | `widgets/shop-kit/lib` | `shared/lib/format.ts` (as a general `plural(n, forms)`) | Ukrainian plural forms are needed elsewhere too |
| Cover palette (`coverPalette`) | `widgets/shop-kit/model` | `tokens.cover` in `shared/config/tokens.ts` | Colours from the artboards belong with the tokens |
| `BookCover` | `widgets/shop-kit/ui` | `entities/book/ui` | Book presentation used by every shop page |
| `availabilitySummary`, `stockedLocations` | `features/shop-my-store/model` | `entities/book/model` | Pure functions over `Availability` |
| `useCartAvailability` (live availability for cart lines, one card per book) | `features/shop-place-order/model` | `entities/cart` or `entities/book` (`useBookCards(ids)`) | A batch card hook would serve `useBookTitles` too (GAP-13) |
| `PlacedOrderSummary` navigation-state contract | `features/shop-place-order/model` | stays until GAP-25 is closed, then removed | The confirmation should read the order from the API |

### Till, returns, staff home

| From (this slice) | To | Why |
|---|---|---|
| `features/till-payment/model/money.ts` (`toCents`, `fromCents`, `parseAmount`, `formatAmount`) | `shared/lib` | Kopeck arithmetic and parsing typed amounts is not till-specific |
| `features/till-return/model/pendingReturns.ts`, `queries.ts` | `entities/sale` (`returnApi`, `usePendingReturns`) | Returns are a sale-entity concern; other screens (store admin confirmations) need the same list |
| `features/till-receipt/model/stockCheck.ts` (`availableAt`, `elsewhere`) | `entities/book` | Reading a hit's availability per location is book knowledge |
| `features/till-scan/ui/TillScanInput.tsx` | `shared/ui/ScanField` (a `size="xl"` variant with key hints and an error frame) | Same behaviour as `ScanField`, only bigger |
| `features/till-scan/ui/BookHitList.tsx` | `entities/book/ui` | A keyboard-navigable list of book hits is reusable (receiving, counts) |
| `pages/staff-home/ui/HomeTile.tsx` | `shared/ui` | A generic start-page tile |

### Store operations

| What | Now in | Move to |
|---|---|---|
| `useCounts`, `useCount`, `countKeys`, `countStatus` (labels/tones) | `features/ops-inventory-count` | `entities/inventory-count` (query hooks and status map next to `countApi`) |
| `orderStepLabel`, `waitingNorm`, `isWaitingTooLong`, `orderTypeLabel`, `fulfilmentLabel` | `features/ops-order-status` | `entities/order/model/types.ts` |
| `transferStep`, `transferSide` | `features/ops-transfer-steps` | `entities/transfer/model/types.ts` |
| `formatWaited` («1 год 05 хв») | `features/ops-order-status` | `shared/lib/format.ts` |
| `DifferenceText`, `differenceRowStyle` (signed −/+ difference with tones) | `features/ops-difference` | `shared/ui` (receiving and purchase orders need the same) |
| `useLocationName`, `useKnownLocations`, `userName` | `features/ops-names` | `entities/reference` or `entities/viewer` (every list resolves names) |
| `DocumentCard`, `FactGrid` | `widgets/ops-document-card` | `widgets/document-card` (purchase order card, returns) |
| `LineEditor` (scan + quantity table) | `widgets/ops-line-editor` | `widgets/line-editor` (receiving, purchase order form) |
| Stock query key prefix (`['stock', location]`) used for invalidation via `stockKeys.location(...).slice(...)` | `features/ops-*` | `stockKeys.all` / `stockKeys.atLocation(location)` in `entities/stock` |

### Purchasing, receiving, suppliers

| What | Now in | Move to | Why |
|---|---|---|---|
| `purchaseOrderNumber(id)` | `widgets/purchasing-order-list/lib/labels.ts` | `entities/purchase-order` | The card and receiving pages import it from the list widget only because features and pages cannot share code sideways |
| `useUserLabel()`, `labelInitials()` | `widgets/purchasing-order-list/lib/labels.ts` | `entities/viewer` or `entities/reference` (GAP-04 helper) | Every "last changed by" column needs it; `HistoryTimeline.userName` too |
| `overdueText()` / `overdueDays()` with Ukrainian plural of «день» | `widgets/purchasing-order-list/lib/labels.ts` | `shared/lib/format.ts` (`pluralUk`) | Transfers and orders also show "late by N days". The same plural rule is copied in `ReceivingSummaryPanel` (`назва/назви/назв`). |
| `useOrderTotals(ids)` | `widgets/purchasing-order-list/model` | `entities/purchase-order` | It is a query over the entity (GAP-37 workaround) |
| `FilterChip` | `features/purchasing-order-filters/ui` | `shared/ui` | It is the list filter chip of the design system, which every list artboard uses |
| `BookLookup` (scan or search, choose among several hits) | `features/purchasing-book-lookup` | `entities/book/ui` or a shared `features/book-lookup` | Counts, transfers and returns need the same "scan, or pick one of several matches" |
| Row tint `color-mix(<status bg> 40%, surface)` | list table, card lines, receiving editor | `shared/config/tokens.ts` (`statusTone.*.row`) | The artboards' row backgrounds (`#FFFAF0`, `#FEF7F6`, `#F3F7FE`) are not tokens yet |
| `SupplierSelect` with inline create | `features/purchasing-manage-supplier` | stays, but `useReferenceList` could filter `active` | Every picker filters out inactive references by hand |

### Catalog and CRM

| What | Now in | Move to | Why |
|---|---|---|---|
| `BookStatusBadge` (sale status labels and tones) | `features/catalog-book-form` | `entities/book` (`saleStatus` row table like `orderStatus`) | Status labels are entity data; the catalog list and book page both use it |
| `isValidIsbn`, `compactIsbn` | `features/catalog-book-form/model/isbn.ts` | `entities/book` (next to `findByCode`'s `isbnLike`) | One ISBN rule for till, receiving and catalog |
| `toOptions` (picker options with unseen ids as `#xxxxxxxx`) | `features/catalog-pickers/model/options.ts` | `entities/reference` | Every picker over remembered lists (suppliers, locations, segments) needs it; `SegmentsPicker` repeats a smaller copy |
| `CreatableSelect` / `CreatableMultiSelect` | `features/catalog-pickers` | `shared/ui` | No business knowledge; suppliers and locations pickers could create inline too |
| `maskPhone`, `maskEmail`, `maskCard` | `pages/customer/ui/mask.ts` | `shared/lib/format.ts` | The till's customer lookup shows the same personal data |
| Create mutations for authors / publishers / categories | duplicated in `features/catalog-pickers` and `features/catalog-reference-manage` (same-layer slices cannot share) | `entities/reference` (e.g. `useCreateReference(kind)`) | One place to create and refresh the remembered list |
| `BookPicker` | `features/catalog-pickers` | `entities/book` UI or a `features/book-picker` slice | Purchasing, transfers and promotions all pick a book by search |

### Reports and administration

| What | Now | Should go to |
|---|---|---|
| `useKnownLocations` (viewer + remembered locations, `nameOf`) | `features/admin-location-lookup` | `entities/reference`, with viewer locations passed in — every screen that names a location needs it |
| `rememberBeforeChange` | `features/admin-locations` | Make `update()` in `entities/reference/api/referenceApi.ts` upsert instead (fixes B-47) |
| `downloadBlob` | `features/reports-export` | `shared/lib` |
| `enabled` parameter | — | `useManagementReport(filter, enabled)` in `entities/report` (fixes B-48) |
| `actionTone`, `actionLabel`, `actionOptions`, `subjectLabel` | `pages/audit/model/presentation.ts` | `entities/audit` (tones as data next to `auditActionLabel`) |
| Local-day helpers (`toInputDate`, day start/end) | duplicated in `pages/reports/model/period.ts` and `pages/audit/model/useAuditFilter.ts` | `shared/lib/format.ts` |
| `SimpleTable` (compact read-only table with empty line) | `pages/reports/ui` | `shared/ui` |

## Notes

### Till, returns, staff home

- B-01 handling: on a 422 the till shows the server message, explains that promotions may change the amount, and
  opens the split dialog with an editable «До сплати» so the cashier can enter the server's amount. The same
  operation key is resent.
- Voiding a receipt (Ctrl+Del) after an unanswered attempt starts a new key; if that attempt did reach the server,
  the sale stays posted. An offline queue (GAP-19) would close this.
- The stock check on scan uses the search result's availability (may lag 30 s); the server checks again.
