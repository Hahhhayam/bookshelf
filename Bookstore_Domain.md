# Bookstore Domain Model

A Domain-Driven Design view of the bookstore chain information system: bounded contexts, aggregates, entities, value objects and domain events. This is a conceptual model, so it has descriptions only — no fields or methods.

Sources: [Звіт_Книжковий магаз.md](Звіт_Книжковий%20магаз.md) (source of truth) and [Specification_Bookstore_IS.md](Specification_Bookstore_IS.md). The bounded contexts follow the modules of the chosen modular monolith ([report 4.1.3](Звіт_Книжковий%20магаз.md#413-модульний-моноліт-з-подієвими-інтеграціями), [report 4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).

**Notation**

- **Aggregate** — a consistency boundary. It is changed only through its root, and one transaction changes one aggregate. The one exception, required by the report, is that a sale and its stock deduction complete in one transaction.
- **Entity** — has an identity and a lifecycle inside an aggregate.
- **Value object** — defined only by its values, immutable, no identity.
- **Domain event** — a fact that already happened, handled by other modules in the same transaction that saves the aggregate ([report 4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).

---

## Contents

1. [Shared Kernel](#1-shared-kernel)
2. [Catalog](#2-catalog)
3. [Inventory](#3-inventory)
4. [Sales](#4-sales)
5. [Online Orders](#5-online-orders)
6. [Purchasing](#6-purchasing)
7. [CRM and Loyalty](#7-crm-and-loyalty)
8. [Administration](#8-administration)
9. [Reporting](#9-reporting)
10. [Domain Events](#10-domain-events)
11. [Context Map](#11-context-map)

---

## 1. Shared Kernel

Value objects used by several contexts. Each context refers to aggregates from other contexts only by their identifier, never by direct object reference.

- **Money** — an amount together with its currency, rounded to two decimals. Arithmetic and comparison work only between amounts in the same currency. Used for prices, discounts, payments and totals.
- **CurrencyCode** — a three-letter ISO 4217 code such as UAH or USD. Both it and Money are value objects, so currencies have no table of their own. Exchange rates are not part of the model; they come from a currency converter port.
- **Quantity** — a non-negative number of units of an item.
- **Period** — a time interval with a start and an end. Used for promotion validity, reservation time and report periods.
- **Identifiers** — typed IDs such as BookId, LocationId, CustomerId, UserId and SupplierId. Each one belongs to the context that owns its aggregate; other contexts use it to refer to that aggregate.
- **IdempotencyKey** — a unique operation key attached to commands. It stops a repeated request, for example a POS resend after a connection drop, from posting twice ([report 2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).

---

## 2. Catalog

Owns the single catalog shared by physical stores and the online shop: books, non-ISBN goods, reference data and base prices. See [FR-02](Specification_Bookstore_IS.md#fr-02), [FR-03](Specification_Bookstore_IS.md#fr-03) and [report 1.2.2](Звіт_Книжковий%20магаз.md#122-проектні-припущення).

### Aggregate: Book (catalog item)

The root is a sellable catalog item. It is usually a book, but it can also be a product without an ISBN, such as stationery or a gift set. It holds descriptive attributes, references to authors, the publisher and the category, the sale status and the current price. The price history is not part of this aggregate (see PriceEntry below).

- **Value objects**
  - **Price** — the current base price, a Money value.
  - **ISBN** — a validated book identifier. It is optional, because non-ISBN goods exist.
  - **Barcode** — the code a cashier scans to find the item.
  - **SaleStatus** — whether the item is active or deactivated.
  - **ItemType** — whether the item is a book or another kind of product.
- **Rules**
  - The ISBN must be unique across the catalog.
  - An item is deactivated instead of deleted when it has active orders, reservations or unfulfilled deliveries ([scenario 3.4](Звіт_Книжковий%20магаз.md#34-видалення-або-деактивація-книги)).
  - A price cannot be negative. A price change raises the PriceChanged event with the old and the new value, and the old value is kept in the price history ([scenario 3.3](Звіт_Книжковий%20магаз.md#33-редагування-ціни)). A change takes effect at once, or from a chosen future moment through a ScheduledPrice (below).
  - A deactivated item can be put back on sale.
  - Creating an item raises the BookAdded event with its initial price.

### Aggregate: PriceEntry (price history)

One price a catalog item had from a given moment, with the user who set it. The history of an item is the set of its entries. Keeping it out of the Book aggregate means loading a book for a sale or an order does not load its whole price history.

- **Rules**
  - Entries are append-only and are never changed or deleted. They stay when the item is deleted.
  - An entry refers to its item only by BookId, with no database foreign key.
  - Entries are created by a handler of BookAdded and PriceChanged, not by the Book itself, in the same transaction as the price change. The entry takes the identifier of the event that caused it.

### Aggregate: ScheduledPrice

A price decided now that becomes the item's price from a future moment ([scenario 3.3](Звіт_Книжковий%20магаз.md#33-редагування-ціни): «нова ціна стає активною з указаного моменту»). It is kept apart from Book so the current price stays simple to read.

- **Rules**
  - An item has at most one scheduled price; deciding again replaces it. The moment must be in the future.
  - When the moment comes, a scheduled job applies it as an ordinary price change dated at that moment, so the price history and the audit get their entries then. Scheduling it is audited on its own.

### Aggregate: Author

Reference data for a person who wrote one or more books. It can be deactivated instead of deleted.

### Aggregate: Publisher

Reference data for a publishing house. It can be deactivated instead of deleted.

### Aggregate: Category

A genre or category used to classify books, search for them and slice reports.

---

## 3. Inventory

Owns stock at every location, plus every document that moves goods: reservations, transfers, inventory counts, write-offs and adjustments. See [FR-06](Specification_Bookstore_IS.md#fr-06), [FR-09](Specification_Bookstore_IS.md#fr-09), [FR-10](Specification_Bookstore_IS.md#fr-10) and [FR-13](Specification_Bookstore_IS.md#fr-13).

### Aggregate: StockItem

The stock of one catalog item at one location. There is exactly one StockItem per location–book pair ([report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)).

- **Entities**
  - **Reservation** — a quantity held for a customer order or a transfer. A manual hold for a customer lasts a defined time and ends when it runs out; a hold made by an order or a transfer lasts until that document releases it. When the goods are handed over, it becomes an actual write-off.
  - **StockMovement** — a record of one change to the stock (sale, return, receipt, transfer, write-off or adjustment) with the document that caused it. Together, the movements are the stock history.
- **Value objects**
  - **StockLevel** — the on-hand, reserved and available quantities. Available equals on hand minus reserved.
  - **MinimumStock** — the threshold below which a low-stock notification is raised.
  - **AdjustmentReason** — why stock was changed manually.
- **Rules**
  - A reserved quantity cannot be sold to another online customer.
  - A change to stock happens in the same transaction as the document that causes it.
  - A manual adjustment needs a reason and is audited.

### Aggregate: Transfer

A document that moves goods from one location to another.

- **Entities**
  - **TransferLine** — an item with its shipped quantity and its received quantity.
  - **Discrepancy** — a separate record raised when the received quantity differs from the shipped quantity, so someone can review it. It is closed with a reason, the user who closed it and the time; stock does not change.
- **Value objects**
  - **TransferStatus** — the stage of the document: created, approved (goods reserved), shipped or received.
  - **Route** — the sending and receiving locations.
- **Rules**
  - The sender and the receiver confirm shipment and receipt separately.
  - Goods are reserved once the transfer is approved.

### Aggregate: TransferStatusChange (transfer status history)

One status transition of a transfer, with its time and the responsible user. The history of a transfer is the set of its entries ([report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)). It is kept out of the Transfer aggregate, so loading a transfer to change it does not load its history.

- **Rules**
  - Entries are append-only and refer to their transfer only by TransferId, with no database foreign key.
  - Entries are created by a handler of TransferStatusChanged, in the same transaction as the transition, and take the identifier of that event.

### Aggregate: InventoryCount

An inventory count at one location, started at a recorded moment.

- **Entities**
  - **CountLine** — an item with its expected quantity (the stock when the count started) and its counted quantity.
- **Value objects**
  - **CountStatus** — the stage of the count: open, counted, approved or posted.
- **Rules**
  - Stock adjustments are generated only after the count is approved.

### Aggregate: WriteOff

A document that removes goods from stock, for example damaged books, together with the reason.

- **Entities**
  - **WriteOffLine** — an item and the quantity written off.
- **Value objects**
  - **WriteOffReason** — why the goods were removed.

---

## 4. Sales

Owns retail operations at the till: receipts, payments, returns and gift certificates. See [FR-04](Specification_Bookstore_IS.md#fr-04), [FR-05](Specification_Bookstore_IS.md#fr-05), [scenario 3.5](Звіт_Книжковий%20магаз.md#35-оформлення-продажу) and [scenario 3.6](Звіт_Книжковий%20магаз.md#36-повернення-товару).

### Aggregate: Sale (receipt)

A completed retail sale at a store, optionally linked to a customer.

- **Entities**
  - **SaleLine** — one item on the receipt with its quantity, price and applied discount.
  - **Payment** — a payment with its method and status. Card payments go through the external payment service, and the system stores no card details. A cash payment also records the change given, so the cash tendered is known.
- **Value objects**
  - **Discount** — an allowed manual discount or one produced by a promotion.
  - **PaymentMethod** — how the customer paid.
  - **PaymentStatus** — a separate payment state, so the sale can handle a payment service that is unavailable ([report 2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).
  - **ReceiptTotal** — the total amount of the receipt after discounts.
  - **IdempotencyKey** — makes sure a resent sale is posted only once.
- **Rules**
  - Confirming a sale and deducting the stock happen in one transaction.
  - A sale needs an open shift at its store ([scenario 3.5](Звіт_Книжковий%20магаз.md#35-оформлення-продажу): «Каса відкрита»).
  - A receipt can be priced before payment (promotions, permitted discount, allowed bonus write-off) with the same rules the sale uses, so the till knows the exact total. Payments must cover that total.
  - A cancellation is allowed only for a user with the right to cancel.

### Aggregate: Return

A return of goods based on an original sale.

- **Entities**
  - **ReturnLine** — the returned item and its quantity.
- **Value objects**
  - **ReturnReason** — why the customer returned the item.
  - **ItemCondition** — the condition of the returned book.
- **Rules**
  - The returned quantity cannot exceed the sold quantity minus earlier returns.
  - Stock and money change only after the return is confirmed.
  - The user's rights are checked, and every return is audited.
  - A return carries an IdempotencyKey, so a resent return is created only once.

### Aggregate: Shift

A cashier shift at a store: who opened it and when, and who closed it and when. The store administrator controls shifts ([report 1.3](Звіт_Книжковий%20магаз.md#13-характеристика-користувачів)).

- **Rules**
  - A store has at most one open shift. A closed shift cannot be closed again.

### Aggregate: GiftCertificate

A gift certificate that is sold and then spent. It tracks its remaining balance ([report 2.2.4](Звіт_Книжковий%20магаз.md#224-продукти-та-послуги)).

- **Value objects**
  - **CertificateBalance** — the remaining value of the certificate.
- **Rules**
  - A certificate is issued under the number printed on it, which must be unique, with a positive value. The customer pays for it like any other payment at the till.
  - A purchase cannot spend more than the remaining balance.

---

## 5. Online Orders

Owns omnichannel orders: the cart, reservations through Inventory, the order lifecycle, pickup or delivery, and B2B orders. See [FR-07](Specification_Bookstore_IS.md#fr-07), [FR-08](Specification_Bookstore_IS.md#fr-08) and [scenario 3.8](Звіт_Книжковий%20магаз.md#38-онлайн-замовлення-і-зміна-статусу).

### Aggregate: Cart

The customer's selection of items before they place the order.

- **Entities**
  - **CartLine** — an item and its quantity.
- **Rules**
  - Lines can be added, changed and removed. The cart is cleared only when an order is placed from it, so a failed checkout can be retried without doubling it.

### Aggregate: Order

A customer order placed through the website, or a large B2B order from a school, company or library.

- **Entities**
  - **OrderLine** — an ordered item with its quantity and price.
- **Value objects**
  - **OrderStatus** — one of New, Confirmed, Picking, Ready, Issued or Cancelled.
  - **FulfilmentMethod** — pickup at a chosen store or delivery.
  - **PickupCode** — the order number or code used to hand the order over.
  - **OrderType** — retail or B2B with special terms.
- **Rules**
  - Only allowed status transitions can happen.
  - Placing an order reserves the stock. When the order is Issued, the reservation becomes a write-off; when it is Cancelled, the reservation is released.

### Aggregate: OrderStatusChange (order status history)

One status transition of an order, with its time and the responsible user. The history of an order is the set of its entries ([report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)). It is kept out of the Order aggregate, so loading an order to change it does not load its history.

- **Rules**
  - Entries are append-only and refer to their order only by OrderId, with no database foreign key.
  - Entries are created by a handler of OrderStatusChanged, in the same transaction as the transition, and take the identifier of that event.

---

## 6. Purchasing

Owns suppliers, supplier orders, receiving goods, and the recorded demand for missing books. See [FR-11](Specification_Bookstore_IS.md#fr-11), [FR-12](Specification_Bookstore_IS.md#fr-12) and [scenario 3.9](Звіт_Книжковий%20магаз.md#39-приймання-поставки).

### Aggregate: Supplier

A publisher or distributor that supplies goods. It can be deactivated instead of deleted.

### Aggregate: PurchaseOrder

An order placed with one supplier.

- **Entities**
  - **PurchaseOrderLine** — an item with its quantity and purchase price.
- **Value objects**
  - **ExpectedDate** — when the delivery is expected. It is used to flag overdue deliveries.
  - **PurchaseOrderStatus** — the stage of the order, including partly and fully received.
- **Rules**
  - A delivery that is late against its expected date raises a notification.
  - A draft or sent order can be cancelled.

### Aggregate: PurchaseOrderStatusChange (purchase order status history)

One status transition of a purchase order, with its time and the responsible user. The history of a purchase order is the set of its entries ([report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)). It is kept out of the PurchaseOrder aggregate, so loading an order to change it does not load its history.

- **Rules**
  - Entries are append-only and refer to their purchase order only by PurchaseOrderId, with no database foreign key.
  - Entries are created by a handler of PurchaseOrderStatusChanged, in the same transaction as the transition, and take the identifier of that event. The history starts with an entry for the creation of the order. A receipt that leaves the status unchanged adds no entry.

### Aggregate: GoodsReceipt

Receiving a delivery against a purchase order, or an allowed unplanned delivery.

- **Entities**
  - **ReceiptLine** — an item with its ordered quantity and its actually received quantity.
  - **Discrepancy** — a separate record of the difference between ordered and received quantities.
- **Rules**
  - Stock increases only after the receiving document is confirmed, which records who confirmed it and when.
  - A receipt carries an IdempotencyKey, so a resent delivery is received only once.
  - Confirming the receipt updates the status of the purchase order.

### Aggregate: MissingBookRequest

A recorded demand for an item the chain does not have, so it can be ordered later ([report 2.2.4](Звіт_Книжковий%20магаз.md#224-продукти-та-послуги)).

---

## 7. CRM and Loyalty

Owns customers, the bonus program, segments and promotions. See [FR-14](Specification_Bookstore_IS.md#fr-14) and [FR-15](Specification_Bookstore_IS.md#fr-15).

### Aggregate: Customer

A customer with minimal contact data, a loyalty tier and segment membership. Only permitted roles can see their personal data ([report 2.2.2](Звіт_Книжковий%20магаз.md#222-аналіз-обмежень)).

- **Value objects**
  - **ContactInfo** — the customer's contact details.
  - **LoyaltyTier** — the customer's level in the loyalty program.
  - **CustomerCard** — the card number used to identify the customer at the till.

### Aggregate: BonusAccount

The customer's bonus balance.

- **Entities**
  - **BonusTransaction** — one accrual or redemption of bonuses, linked to the sale or return that caused it.
- **Value objects**
  - **BonusBalance** — the current number of bonuses.
- **Rules**
  - The balance can never be negative.
  - Bonuses are accrued by a handler of SaleCompleted, in the same transaction as the sale.

### Aggregate: Promotion

A discount rule. It is created by marketing and applied automatically during a sale.

- **Value objects**
  - **Period** — when the promotion is valid.
  - **PromotionCondition** — when the promotion applies: an item or category, a minimum quantity, and optionally a segment or a single customer (a personal offer).
  - **Priority** — which rule wins when several promotions overlap.
- **Rules**
  - A promotion applies only inside its validity period. When several apply, the one with the higher priority wins.
  - A personal offer applies only to a sale for a customer in its segment, or for that customer.

### Aggregate: Segment

A group of customers used for personal offers and analysis.

---

## 8. Administration

Owns users, roles, locations, integration settings and the audit log. See [FR-01](Specification_Bookstore_IS.md#fr-01), [FR-17](Specification_Bookstore_IS.md#fr-17), [FR-19](Specification_Bookstore_IS.md#fr-19) and [FR-20](Specification_Bookstore_IS.md#fr-20).

### Aggregate: User

An employee account.

- **Value objects**
  - **UserStatus** — whether the account is active or blocked.
  - **PasswordHash** — the password stored as a strong hash.
  - **LocationAccess** — the stores and warehouses the user may work in.
- **Rules**
  - A blocked user cannot log in.
  - A failed login is logged without the password.

### Login session (not an aggregate)

A successful login starts a session for the user. It is infrastructure data, not part of the domain model, and it raises no events. It has a random token (only its hash is stored), an issue time, an expiry time and an optional revocation time.

- A session is valid until it expires, is revoked by logout, or its user is blocked.
- The rights of a request come from the user's roles and location access at that moment, not from values copied into the session.
- A user can end only their own session.

### Aggregate: Role

A named set of permissions, such as cashier, store administrator or warehouse keeper, assigned to users (RBAC).

### Aggregate: Location

A store, warehouse or the central warehouse. New locations are added by configuration, without code changes ([report 1.2.2](Звіт_Книжковий%20магаз.md#122-проектні-припущення)).

- **Value objects**
  - **LocationType** — whether the location is a store or a warehouse.
  - **Address** — where the location is.

### Aggregate: Integration

The settings and health of one external connection: the payment service, the online shop, accounting, or e-mail/SMS. Each one is reached through an adapter. There can be several connections of the same kind (for example two payment providers), so an integration is identified by its own identifier, not by its kind, and an adapter reports failures for the integration it was configured with.

- **Rules**
  - The integration keeps its health: the last successful exchange, and the last error with its time. A failure raises IntegrationFailed.

### Aggregate: AuditRecord

An immutable record of one critical action: who did it, when, the action type and the key fields that changed, each with its value before and after ([FR-17](Specification_Bookstore_IS.md#fr-17)). It is append-only.

- **Value objects**
  - **FieldChange** — one field with its value before and after. A field whose value did not change is left out.

---

## 9. Reporting

Owns no aggregates. It builds read models (projections and materialized views) from the events of the other contexts, and uses them for sales, margin, average check, turnover, shortage, surplus, ABC analysis and store performance reports. For now the reports read the sales, stock and purchase data directly and compute the figures from it; no projections are built yet. See [FR-16](Specification_Bookstore_IS.md#fr-16) and [report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних).

---

## 10. Domain Events

Events are handled in-process: when the aggregates are saved, the handlers of their events run first, and whatever they change is saved in the same transaction. A failing handler aborts the save. Reactions that may happen later and outside the transaction, such as publishing to RabbitMQ, would need a transactional outbox, which is not built yet ([report 4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).

- **SaleCompleted** — leads to bonus accrual, an analytics update and export to accounting.
- **ReturnConfirmed** — leads to bonus reversal, an analytics update and export to accounting.
- **OrderPlaced** and **OrderStatusChanged** — lead to the reservation or its release in Inventory. OrderStatusChanged also leads to an order status history entry.
- **TransferStatusChanged** and **PurchaseOrderStatusChanged** — lead to a status history entry.
- **OrderReady** — leads to a notification to the customer.
- **StockBelowMinimum** — leads to a low-stock notification.
- **TransferShipped** and **TransferReceived** — update stock at the sending and receiving locations; a mismatch raises a discrepancy for review.
- **GoodsReceived** — increases stock and updates the purchase order status.
- **PurchaseOrderOverdue** — leads to an overdue delivery notification.
- **BookAdded** — leads to the first price history entry.
- **PriceChanged** — leads to a price history entry, an audit record and a catalog cache refresh.
- **IntegrationFailed** — leads to a critical error notification for administrators.

---

## 11. Context Map

- **Catalog → all contexts.** Catalog is the upstream for item data. The other contexts refer to items by BookId and read their prices and attributes.
- **Sales → Inventory.** A sale deducts stock in the same transaction (the transactional exception). A return adds stock back once it is confirmed.
- **Sales → CRM and Loyalty.** Sales applies promotions and bonus redemption while the sale is in progress. Bonus accrual happens afterwards, through events.
- **Online Orders → Inventory.** Placing an order creates a reservation; status changes turn the reservation into a write-off or release it.
- **Purchasing → Inventory.** A confirmed goods receipt increases stock.
- **Administration → all contexts.** Administration provides identity, roles, location access and the audit log.
- **Every context → Reporting.** All contexts publish events that Reporting turns into read models.
- **External systems** (payment, online shop, accounting, e-mail/SMS). These are reached through adapters (an anti-corruption layer) and queues, so a failure in one of them does not block the till ([report 2.2.2](Звіт_Книжковий%20магаз.md#222-аналіз-обмежень)).
