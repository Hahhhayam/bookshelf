# Bookstore Chain Information System — Specification

Business cases, functional and non-functional requirements, technology stack, and other technologies.

Source of truth: [Звіт_Книжковий магаз.md](Звіт_Книжковий%20магаз.md). This document contains only content from that report, translated to English and regrouped. Each section links to the part of the report it comes from.

---

## Contents

1. [Project Goal and Problem](#1-project-goal-and-problem)
2. [Scope and Assumptions](#2-scope-and-assumptions)
3. [Users and Stakeholders](#3-users-and-stakeholders)
4. [Business Cases](#4-business-cases)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Constraints and Risks](#7-constraints-and-risks)
8. [User Scenarios](#8-user-scenarios)
9. [Architecture](#9-architecture)
10. [Technology Stack](#10-technology-stack)
11. [Other Technologies and Database Support](#11-other-technologies-and-database-support)

---

## 1. Project Goal and Problem

### 1.1 Goal

Source: [report 1.1](Звіт_Книжковий%20магаз.md#11-мета-проєкту)

Develop a typical information system for a bookstore chain that unites the core processes of stores, the central warehouse and administrative departments. The system centrally stores and processes information about books, prices, stock, orders and customers, reduces manual operations, avoids data duplication, speeds up customer service and simplifies inventory management.

Tasks to achieve the goal:

- create a single book catalog with ISBN, title, author, publisher, genre, price and other attributes;
- track stock in every store and in the central warehouse;
- automate sales, returns, book reservations and online order processing;
- track movements of goods between stores and the warehouse;
- simplify purchasing, work with suppliers and control of incoming goods;
- create a customer base with a loyalty program;
- generate reports on sales, stock, turnover and performance.

### 1.2 Problem

Source: [report 1.2](Звіт_Книжковий%20магаз.md#12-опис-проблеми-проектні-припущення-обсяг-продукту)

Stores use different programs and methods of record keeping: sales in the POS program, stock in Excel, purchases in accounting software. Without a single database, staff check several sources, which takes time and increases errors.

Main problems:

- actual book stock does not match the data in accounting systems;
- long search for book information and availability in other stores;
- supplier orders formed manually without sufficient analysis of previous sales;
- uneven distribution of goods between stores — surplus in some, shortage in others;
- difficulty tracking reservations, online orders and returns;
- no single history of price, stock and order status changes;
- delays in reporting because data must be collected and checked from different sources;
- insufficient separation of employee access to financial information and customer personal data.

These problems also affect customers: a customer may see a book as available on the website but find it already sold in the store; online order confirmation may be delayed; finding a title in other stores is difficult.

---

## 2. Scope and Assumptions

### 2.1 Project assumptions

Source: [report 1.2.2](Звіт_Книжковий%20магаз.md#122-проектні-припущення)

- The chain consists of a head office, a warehouse and several stores working in one shared system.
- All stores have Internet access, but temporary connection outages are possible.
- ISBN identifies books, but the system must also support goods without ISBN (e.g. stationery, gift sets).
- Employees use the system through a web interface; cashiers have a separate mode adapted for fast sales.
- Physical stores and the online shop use a shared catalog, prices and availability.
- Card payments are made through an external payment service; the system does not store customer payment details.
- Accounting may be done in a separate program; the system exchanges data with it via API or files.
- The chain may expand, so new stores must be addable without changing program code.

### 2.2 Product scope

Source: [report 1.2.3](Звіт_Книжковий%20магаз.md#123-обсяг-продукту)

The system is a web application used by employees of stores, the warehouse and administrative departments, and by customers through the online shop.

**Included in the first version:**

- single book catalog with information about authors, publishers, categories and suppliers;
- records of stores, warehouses and stock in each location;
- registration of incoming goods, inventory counts and book write-offs;
- creation and tracking of transfers between stores and the central warehouse;
- retail sales, receipts, returns and cancellations, subject to employee access rights;
- online order processing, book reservation and order status tracking;
- customer base, bonus accrual and personal discounts;
- supplier orders and control of their fulfilment;
- reports on sales, stock, purchases and store performance;
- management of user accounts, roles and access rights;
- history of important operations and changes for review and control.

**Not included in the first version:** full accounting and HR, an in-house bank payment processing system, courier delivery route management, publishing platform functions. Third-party services and specialised programs can be used for these; the system should support data exchange with them where needed.

---

## 3. Users and Stakeholders

### 3.1 Users

Source: [report 1.3](Звіт_Книжковий%20магаз.md#13-характеристика-користувачів)

- **Customer** — searches books, views availability, places online orders, gets status and bonus information. *Needs:* simple interface, accurate stock, fast ordering.
- **Cashier** — sales, reservations, returns, checks availability across the chain, works with the customer card. *Needs:* minimum unnecessary fields, fast search, barcode support.
- **Store administrator** — controls shifts, local stock, inventory counts, transfers and complex returns. *Needs:* extended rights within own store, local reports.
- **Warehouse keeper** — receives deliveries, forms shipments, transfers, write-offs and inventory counts. *Needs:* accurate quantities, scanning, clear document statuses.
- **Purchasing manager** — creates supplier orders, controls deadlines and purchase prices. *Needs:* demand forecast, purchase history, control of unfulfilled deliveries.
- **Marketing / CRM manager** — creates promotions, customer segments, analyses repeat purchases and bonus programs. *Needs:* correct customer data, flexible discount rules.
- **Chain manager** — views consolidated store, sales, stock and profitability metrics. *Needs:* dashboards, period comparison, minimum manual consolidation.
- **System administrator** — creates users and roles, configures locations, monitors logs and integrations. *Needs:* secure administration, audit, technical diagnostics.

### 3.2 Organisational units

Source: [report 1.4.1](Звіт_Книжковий%20магаз.md#141-структура-та-підрозділи)

- **Chain management** — defines strategy, budget, KPIs and store operating rules.
- **Operations department** — coordinates stores, warehouse, inventory counts, transfers and compliance with operating procedures.
- **Commercial department** — forms the assortment, works with publishers and suppliers, agrees purchasing terms.
- **Stores** — sales, reservations, returns, receiving local deliveries, customer service.
- **Central warehouse** — receives large deliveries, stores stock and replenishes stores.
- **Marketing and CRM** — manages promotions, loyalty program, segmentation and customer communications.
- **Finance and accounting** — receives data on sales, purchases and returns, controls financial reporting.
- **IT and support** — supports the system, users, integrations, backups and information security.

### 3.3 Stakeholders

Source: [report 1.4.2](Звіт_Книжковий%20магаз.md#142-зацікавлені-сторони-та-користувачі-системи)

- **Owners / investors** — interest: stable profit, control of chain efficiency, scalability. Receive consolidated reports and KPIs, do not interfere with daily operations.
- **Management** — interest: transparency of sales, stock, purchases and store performance. Define policies, roles, regulations and KPIs.
- **Store employees** — interest: fast customer service and minimum manual work. Responsible for correct sales, returns and local operations.
- **Warehouse and logistics** — interest: accurate stock and control of transfers. Responsible for receiving, shipping, write-offs and inventory counts.
- **Suppliers** — interest: clear orders, predictable communication and delivery confirmation. Provide catalog, prices, deadlines and actual delivery volumes.
- **Customers** — interest: accurate book information, convenient purchases, bonuses, personal data protection. Provide data only for registration and ordering.
- **IT department** — interest: stability, manageability and security of the system. Supports access, monitoring, backups and integrations.
- **Finance department** — interest: correct operation data and ability to reconcile. Controls financial documents and interaction with the external accounting system.

---

## 4. Business Cases

Source: [report 2.2.1](Звіт_Книжковий%20магаз.md#221-бізнес-цілі)

Each business case is a business goal from the report, with how the system supports it and the metric used to evaluate it. Links point to the requirements that implement the listed support.

<a id="bc-01"></a>
### BC-01 Reduce stock discrepancies

**How the system supports it:** single system of goods movements, inventory counts, adjustment log.
**Metric:** share of items without discrepancies at inventory count.
**Requirements:** [FR-09](#fr-09), [FR-10](#fr-10), [FR-12](#fr-12), [FR-13](#fr-13), [FR-17](#fr-17) · [NFR Data reliability](#nfr-data-reliability), [NFR Audit](#nfr-audit)

<a id="bc-02"></a>
### BC-02 Shorten service time

**How the system supports it:** fast search, barcode, automatic discounts, single customer card.
**Metric:** average sale duration and queue in peak hours.
**Requirements:** [FR-03](#fr-03), [FR-04](#fr-04), [FR-14](#fr-14), [FR-15](#fr-15) · [NFR Performance](#nfr-performance), [NFR Usability](#nfr-usability)

<a id="bc-03"></a>
### BC-03 Reduce shortages of popular books

**How the system supports it:** minimum stock levels, sales velocity reports, replenishment recommendations.
**Metric:** number of out-of-stock cases for top SKUs.
**Requirements:** [FR-09](#fr-09), [FR-16](#fr-16), [FR-18](#fr-18)

<a id="bc-04"></a>
### BC-04 Reduce excess stock

**How the system supports it:** analysis of turnover and slow-moving items, control of orders.
**Metric:** days of stock, share of items without sales for 90/180 days.
**Requirements:** [FR-11](#fr-11), [FR-16](#fr-16)

<a id="bc-05"></a>
### BC-05 Improve omnichannel service

**How the system supports it:** single stock for offline and online, reservations, order statuses.
**Metric:** share of orders delivered without substitution or cancellation.
**Requirements:** [FR-06](#fr-06), [FR-07](#fr-07), [FR-08](#fr-08), [FR-09](#fr-09) · [NFR Availability](#nfr-availability), [NFR Data reliability](#nfr-data-reliability)

<a id="bc-06"></a>
### BC-06 Increase repeat sales

**How the system supports it:** CRM, bonuses, purchase history, personal offers.
**Metric:** share of repeat customers, bonus usage.
**Requirements:** [FR-14](#fr-14), [FR-15](#fr-15)

<a id="bc-07"></a>
### BC-07 Speed up management reporting

**How the system supports it:** consolidated data and ready-made reports.
**Metric:** report preparation time and number of manual operations.
**Requirements:** [FR-16](#fr-16)

### 4.1 Products and services

Source: [report 2.2.4](Звіт_Книжковий%20магаз.md#224-продукти-та-послуги)

- **Retail book sales** — search, sale, discounts, returns, receipt, customer card.
- **Online orders** — website orders with reservation in a store or warehouse, status control.
- **Click & collect** — order prepared in the chosen store and handed over by number or code.
- **Loyalty program** — bonuses, tiers, personal offers, history of accruals and redemptions.
- **Gift certificates** — sale and use of a certificate with balance control.
- **Ordering a missing book** — recording demand for an unavailable item for later replenishment.
- **B2B sales** — large orders for schools, companies or libraries with special terms.
- **Analytical services for management** — reports on sales, stock, turnover, margin and store efficiency.

---

## 5. Functional Requirements

### 5.1 Main product functions

Source: [report 2.1.1](Звіт_Книжковий%20магаз.md#211-основні-функції-продукту)

- **Catalog** (managing books and reference data) — book card, ISBN, authors, publisher, genre, price, attributes, sale status.
- **Search** (fast item search) — by title, ISBN, author, category, filters and availability in a specific store.
- **Stock** (stock records) — stock per location, reserved, available, minimum stock, reasons for adjustments.
- **Sales** (retail operation) — cart, discounts, customer, payment, receipt, return and cancellation with rights check.
- **Online orders** (omnichannel order) — placing, reservation, confirmation, preparation, handover or delivery, cancellation.
- **Purchasing** (work with suppliers) — demand calculation, supplier order, expected date, receiving and discrepancies.
- **Transfers** (distributing goods between locations) — transfer document, shipment, receipt and control of differences.
- **CRM** (customers and loyalty) — customer card, purchase history, bonus balance, program tier, personal offers.
- **Analytics** (management reports) — sales, margin, average check, turnover, shortages, surpluses, ABC analysis, store efficiency.
- **Administration** (users and access) — roles, permissions, stores, settings, integrations, audit log.

### 5.2 Functional requirements

Source: [report 2.1.2](Звіт_Книжковий%20магаз.md#212-функціональні-вимоги)

<a id="fr-01"></a>
#### FR-01 Authorization
The system must allow login with an account and determine user rights according to role and store.

*Implementation notes (not in the report):*
- A successful login issues a random bearer session token valid for 8 hours. Only its hash is stored. Logout revokes the caller's own session at once.
- A token stops working when it expires, is revoked, or its user is blocked. Roles and location access are read on every request, so a change to them applies immediately.
- At startup, when no user has the login `root`, the system creates it with password `root`, a `root` role holding every permission and no locations, so a fresh installation has someone who can add staff. The password must be changed outside development.
- A signed-in user can read their own profile: login, permissions and the active locations they may work in. The client builds its navigation from it.
- Every endpoint requires a signed-in user. The exceptions are login, catalog search, viewing a single item, the author, publisher, category and pickup-store lists, and the customer-facing cart, order placement, order tracking and bonus summary (the shop acts for a customer id, since customers have no login). Each staff operation also requires its named permission, checked at the API boundary before the request is processed and again inside the use case.

<a id="fr-02"></a>
#### FR-02 Book catalog
An authorized user can add, edit and deactivate books. ISBN uniqueness must be checked.

*Implementation notes (not in the report):* editing an item's details removes its cached card at once. Authors, publishers and suppliers are deactivated instead of deleted and can be reactivated; categories can only be renamed. An item keeps its current price and at most one scheduled price. A price change applies at once or from a chosen future moment; a scheduled job applies due prices every minute, so a scheduled price may start up to a minute late. Earlier prices are kept in a separate append-only history that is written from the price-change event in the same transaction; anyone can read an item's price history, like its card. A deactivated item can be reactivated; staff search can include deactivated items.

<a id="fr-03"></a>
#### FR-03 Search
A user can find a book by title, ISBN, author, publisher or category and see availability across the chain.
*Supports:* [BC-02](#bc-02)

*Implementation notes (not in the report):* a single item can also be opened by its identifier, with its availability per location. Search results are cached for 30 seconds per filter combination, and item cards for 15 minutes with removal on price change, so prices and availability in search may lag by that time. Availability on an item card is always read live.

<a id="fr-04"></a>
#### FR-04 Sale
A cashier can create a receipt with several items, apply an allowed discount, select the customer and payment method.
*Supports:* [BC-02](#bc-02)

*Implementation notes (not in the report):* a sale needs an open cashier shift at its store; the store administrator opens and closes shifts (`shifts.manage`). The till prices the receipt before payment with the same rules as the sale (promotions, permitted discount, allowed bonus write-off), and payments must cover that total. A cash payment records the cash tendered and the change. A sale and a return each carry an operation key, so a resend posts once.

<a id="fr-05"></a>
#### FR-05 Return
The system allows a return based on a sale. The operation is recorded in history and changes stock only after confirmation.

<a id="fr-06"></a>
#### FR-06 Reservation
A book can be reserved for a customer for a defined time. The reserved quantity must not be sold to another online customer.
*Supports:* [BC-05](#bc-05)

*Implementation notes (not in the report):* only manual holds have an expiry; reservations made by an order or a transfer last until that document releases or fulfils them. A scheduled job ends expired holds every minute (configurable), so a hold may outlive its expiry by up to that interval.

<a id="fr-07"></a>
#### FR-07 Online order
A customer can place an order, and a store employee changes its status along the allowed route.
*Supports:* [BC-05](#bc-05)

*Implementation notes (not in the report):* a pickup order is collected only at an open store; the server refuses a warehouse or a closed store as the pickup location (`pickup-location-not-store`), even though the shop never offers one.

<a id="fr-08"></a>
#### FR-08 Order statuses
At least the following statuses are supported: New, Confirmed, Picking, Ready, Issued, Cancelled.
*Supports:* [BC-05](#bc-05)

<a id="fr-09"></a>
#### FR-09 Stock
The system stores actual, reserved and available stock separately for each location.
*Supports:* [BC-01](#bc-01), [BC-03](#bc-03), [BC-05](#bc-05)

<a id="fr-10"></a>
#### FR-10 Transfers
A user can create a transfer between locations. The sender and receiver separately confirm shipment and receipt.
*Supports:* [BC-01](#bc-01)

<a id="fr-11"></a>
#### FR-11 Purchasing
A manager can create supplier orders, add items, purchase price, quantity and expected date.
*Supports:* [BC-04](#bc-04)

<a id="fr-12"></a>
#### FR-12 Receiving
During receiving the system allows recording the actual quantity and the discrepancy with the order.
*Supports:* [BC-01](#bc-01)

*Implementation notes (not in the report):* a goods receipt carries an operation key, so a resent delivery is received once; it records who confirmed it and when, and its discrepancies can be read back.

<a id="fr-13"></a>
#### FR-13 Inventory count
An administrator can open an inventory count, enter actual stock and, after approval, generate an adjustment.
*Supports:* [BC-01](#bc-01)

<a id="fr-14"></a>
#### FR-14 Loyalty program
The system accrues and redeems bonuses by rules, stores operation history and does not allow a negative bonus balance.
*Supports:* [BC-02](#bc-02), [BC-06](#bc-06)

*Implementation notes (not in the report):* the customer card (opened by id, or by the scanned card number at the till) shows contact data, tier, segments, the bonus balance with its operations, and the purchase history. It holds personal data, so only cashiers and CRM managers can open it.

<a id="fr-15"></a>
#### FR-15 Promotions
An authorized user creates a promotion with validity period, conditions and priority. At sale the system automatically checks applicable rules.
*Supports:* [BC-02](#bc-02), [BC-06](#bc-06)

*Implementation notes (not in the report):* a promotion can be aimed at a customer segment or a single customer (a personal offer); it then applies only to sales for that customer.

<a id="fr-16"></a>
#### FR-16 Reports
A manager can generate reports by period, store, category, book and other available dimensions.
*Supports:* [BC-03](#bc-03), [BC-04](#bc-04), [BC-07](#bc-07)

*Implementation notes (not in the report):* the management report is filtered by period, stores (none means the whole chain, which needs its own permission), category and book. It shows revenue, margin (against the average purchase price), receipts, average check, days of stock at the period's sales rate (turnover), top books, slow-moving books (surplus), current stock below minimum (shortage), ABC analysis by revenue (A up to 80%, B up to 95%, C the rest), figures per store and per category, and the same totals for the equally long previous period. The same report can be exported as a CSV file.

<a id="fr-17"></a>
#### FR-17 Change history
For critical entities the system stores the user, time, action type and values of key fields before and after the change.
*Supports:* [BC-01](#bc-01)

<a id="fr-18"></a>
#### FR-18 Notifications
The system creates notifications about order readiness, low stock, overdue delivery and critical integration errors.
*Supports:* [BC-03](#bc-03)

*Implementation notes (not in the report):* overdue deliveries are found by a scheduled job that runs hourly (configurable) and notifies once per purchase order. The schedule is kept in memory, so every running instance runs the job. Integration-error notifications are not triggered yet, because no adapter reports its failures; an integration keeps its last exchange and last error for the administration screen.

<a id="fr-19"></a>
#### FR-19 Users
An administrator can create, block and restore users, assign roles and access to locations.

*Implementation notes (not in the report):* a user's roles and location access are replaced as a whole, and a role's name and permissions likewise. Both are access-rights changes and are audited with the values before and after. Locations are created, edited and deactivated as data; integrations are registered one row per connection and can be enabled or disabled.

<a id="fr-20"></a>
#### FR-20 Integrations
The system must have an API or exchange mechanism for the payment service, online shop, accounting and notifications.

---

## 6. Non-Functional Requirements

Source: [report 2.1.3](Звіт_Книжковий%20магаз.md#213-нефункціональні-вимоги)

<a id="nfr-performance"></a>
#### Performance
Typical operations — search, opening a card, adding an item to a sale — must respond within 2 seconds under normal load.
*Supports:* [BC-02](#bc-02)

<a id="nfr-scalability"></a>
#### Scalability
The architecture must allow adding new stores and increasing the number of users without reworking the domain model.

<a id="nfr-availability"></a>
#### Availability
Target availability of central services is at least 99.9% per month, except agreed maintenance windows.
*Supports:* [BC-05](#bc-05)

<a id="nfr-data-reliability"></a>
#### Data reliability
Operations that change stock or financial amounts are executed transactionally. A partially posted document must not change the records.
*Supports:* [BC-01](#bc-01), [BC-05](#bc-05)

<a id="nfr-security"></a>
#### Security
Data transfer only over HTTPS. Passwords are stored as strong hashes. Access to functions is determined by roles, and every endpoint requires authentication unless it is explicitly public (see [FR-01](#fr-01)).

*Implementation notes (not in the report):* the API redirects HTTP to HTTPS and sends HSTS outside development. Behind the planned TLS-terminating reverse proxy it will also need to trust that proxy's forwarded headers; this is not configured yet, because no proxy is deployed.

<a id="nfr-audit"></a>
#### Audit
Critical actions, including price change, manual stock adjustment, return and access rights change, must be logged.
*Supports:* [BC-01](#bc-01)

<a id="nfr-backup"></a>
#### Backup
Full DB backup daily, incremental or log-based backup during the day. Periodic test restore is mandatory.

<a id="nfr-usability"></a>
#### Usability
Main POS operations must be performed without going through unnecessary screens. The interface must support keyboard and barcode scanner.
*Supports:* [BC-02](#bc-02)

<a id="nfr-compatibility"></a>
#### Compatibility
The web interface supports current versions of Chrome, Edge and Safari. The API uses JSON and is documented with OpenAPI.

*Implementation notes (not in the report):* the OpenAPI document and Swagger UI (`/swagger`) are generated by Swashbuckle and served only in development. The UI accepts the session token from login as a bearer token.

<a id="nfr-maintainability"></a>
#### Maintainability
Code is divided into modules by business domain, has automated tests and centralised logging.

<a id="nfr-observability"></a>
#### Observability
For server components, metrics of errors, response time, queues, DB connections and integration status are collected.

<a id="nfr-recovery"></a>
#### Recovery
For critical services the target RPO is up to 15 minutes and RTO up to 2 hours, provided backup infrastructure is available.

---

## 7. Constraints and Risks

### 7.1 Constraints

Source: [report 2.2.2](Звіт_Книжковий%20магаз.md#222-аналіз-обмежень)

- **Budget** — the chain cannot support a large DevOps team and dozens of independent services. → Simple infrastructure at the start with the possibility to scale.
- **Internet in stores** — short connection outages are possible. → The client must correctly report loss of connection; POS operations must not be duplicated on resend.
- **External systems** — payments, accounting, e-mail/SMS have their own APIs and limitations. → Integrations are isolated through adapters; errors are retried without blocking main processes.
- **Personal data** — the system stores customer contacts and purchase history. → Minimal data collection, access control, logging and a retention policy are required.
- **Seasonality** — load increases significantly before holidays and big promotions. → Infrastructure must have performance headroom and the ability to scale quickly.
- **Different user skill levels** — store employees may have different technical experience. → The interface must be simple, with hints and protection from erroneous actions.
- **Data migration** — at the start part of the catalog and stock may be in spreadsheets or an old system. → Import, validation, test load and reconciliation before launch are required.

### 7.2 Risks

Source: [report 2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)

- **Incorrect stock after migration** (probability: medium, impact: high) — test migration, reconciliation with inventory count, discrepancy log.
- **Double posting of an operation due to a repeated request** (medium, high) — idempotent commands, unique operation keys, transactions.
- **Payment service unavailable** (medium, medium) — timeouts, retries, separate payment status, alternative payment method.
- **Loss of the central DB** (low, critical) — backups, replica, test restore, RPO/RTO control.
- **Unauthorized access** (medium, critical) — RBAC, MFA for administrators, HTTPS, audit, principle of least privilege.
- **Overload in peak period** (medium, high) — catalog caching, query optimisation, horizontal scaling of web/backend.
- **Error in promotion rules** (medium, medium) — test environment, start/end date, rule priority, preliminary calculation.
- **Staff resistance to the new system** (medium, medium) — pilot in 1–2 stores, training, short instructions, feedback collection.
- **Supplier delivery delay** (high, medium) — control of expected dates, reminders, alternative suppliers.
- **Accidental deletion of reference data** (low, high) — soft delete, confirmation, restricted rights, change log.

---

## 8. User Scenarios

Source: [report section 3](Звіт_Книжковий%20магаз.md#3-сценарії-користувача)

**3.1 Login** — *Store employee.* Precondition: account active, role and store assigned.
User enters login and password → system checks credentials, user status and allowed locations → on success a session is created and the role's start page opens → a failed attempt is logged without storing the entered password.

**3.2 Add a new book** — *Content manager / purchasing manager.* Precondition: catalog edit rights.
User clicks "Add book" → enters ISBN, title, authors, publisher, category, price and other attributes → system checks required fields and ISBN uniqueness → after confirmation the book card is created and the action goes to change history.

**3.3 Edit price** — *Commercial manager.* Precondition: book exists, user has price change rights.
User changes the base price → system shows old and new value and asks for confirmation → new price is active from the specified moment → old price stays in history.

**3.4 Delete or deactivate a book** — *Catalog manager.* Precondition: book no longer sold or created by mistake.
User selects "Deactivate" → system checks for active orders, reservations or unfulfilled deliveries → if dependencies exist, full deletion is forbidden and only deactivation is offered → after confirmation the book is hidden from the active catalog, historical operations are kept.

**3.5 Sale** — *Cashier.* Precondition: till open, goods in stock.
Cashier scans a barcode or searches → system adds the item, checks stock and calculates promotions → with a customer card, bonuses and allowed redemption are shown → payment method chosen, sale confirmed → system creates the receipt, reduces stock and records the operation in history.

**3.6 Return** — *Cashier / administrator.* Precondition: original sale exists; return period and conditions allow it.
Employee finds the receipt and selects the item → system checks quantity, previous returns and user rights → employee enters reason and book condition → return document is created, amount and stock adjusted by rules.

**3.7 Transfer between stores** — *Administrator / warehouse keeper.* Precondition: sufficient available stock at sender.
User creates a transfer, selects locations and books → after approval goods are reserved → sender confirms shipment → receiver records actual quantity → a discrepancy creates a separate record for review.

**3.8 Online order and status change** — *Customer and store employee.* Precondition: book available for reservation.
Customer adds books to cart, chooses pickup or delivery → system reserves quantity, order status "New" → employee confirms, status "Picking" → after picking "Ready", customer notified → at handover "Issued", reservation becomes actual write-off.

**3.9 Receiving a delivery** — *Warehouse keeper.* Precondition: supplier order or allowed unplanned receipt.
Keeper opens the expected delivery → books scanned, ordered vs actual quantity shown → discrepancies recorded separately → document confirmed → stock increased, purchase status changed.

**3.10 View change history** — *Manager / administrator.* Precondition: audit rights.
User opens an entity (order, book, stock adjustment) → "History" tab → events with date, user, action type and key changes → filters by period or event type.

**3.11 Status display** — *Customer / employee / manager.* Precondition: object has a status lifecycle.
User opens a list of orders, deliveries or transfers → current status, last change date and responsible person shown → overdue/problem objects get a warning → card shows allowed next actions by role and status.

*Implementation notes for 3.10–3.11 (not in the report):* the cards of an order, a transfer and a purchase order show their status history. Lists of orders and transfers (per location) and purchase orders show the current status with the time and user of its last change; overdue purchase orders and transfers with unresolved discrepancies are flagged. Without a status filter, a list shows only open documents. A customer gets the pickup code when placing an order, and can follow the order with it without an account, seeing only the status and when it changed.

**3.12 Management report** — *Chain manager.* Precondition: sales and movements accumulated for the period.
Manager opens analytics → selects period, stores and metrics → system shows sales, average check, margin, top books and slow-moving items → drill-down or export.

---

## 9. Architecture

### 9.1 Options considered

Source: [report 4.1](Звіт_Книжковий%20магаз.md#41-варіанти-архітектури)

**Classic monolith.** Catalog, sales, stock, purchasing, CRM and reports in one application, often with a shared data model. Fast start, simple deployment, convenient transactions. Over time, without clear module boundaries, every change affects a large part of the system; teams work in parallel with difficulty; the whole application must be scaled.

**Microservices.** Independent services (Catalog Service, Inventory Service, Order Service, CRM Service), each may have its own DB, deployment lifecycle and scaling. Suits large systems with several teams. Brings distributed transactions, event delivery, duplicate messages, tracing, network errors, API version compatibility and monitoring of dozens of components. For a typical bookstore chain at the start — more risk than benefit.

**Modular monolith with event integrations.** One server application with strictly separated modules: catalog, sales, orders, stock, purchasing, CRM, reports, administration. Modules interact through defined interfaces; direct access to another module's tables is forbidden at the code-structure level. Events are used where an immediate transactional response is not needed (analytics projection, bonus accrual, notifications). Critical stock and sale operations stay in one transactional boundary.

### 9.2 Comparison and choice

Source: [report 4.2](Звіт_Книжковий%20магаз.md#42-порівняння-та-вибір-архітектури)

| Criterion (1–5) | Monolith | Microservices | Modular monolith + events |
| --- | --- | --- | --- |
| Initial development speed | 5 | 2 | 4 |
| Deployment simplicity | 5 | 2 | 4 |
| Sales and stock transactionality | 5 | 2 | 5 |
| Scaling individual functions | 2 | 5 | 3 |
| Maintainability as it grows | 2 | 5 | 4 |
| Infrastructure cost | 5 | 2 | 4 |
| Monitoring complexity | 5 | 2 | 4 |
| Readiness for further split | 1 | 5 | 4 |
| Integration fault tolerance | 2 | 4 | 5 |

**Chosen: modular monolith with event integrations.** It gives a clear transactional model for sales and stock, does not require complex microservice infrastructure and disciplines code structure. If the chain grows significantly, the most loaded modules (e.g. online orders or analytics) can be extracted into separate services without a full rewrite.

### 9.3 Architecture layers

Source: [report 4.3](Звіт_Книжковий%20магаз.md#43-архітектура-за-рівнями)

Three layers, close to ArchiMate logic:

- **Business layer** — users and processes: sales, purchasing, stock management, online orders, analytics.
- **Application layer** — system modules implementing these processes.
- **Technology layer** — application execution, data storage, caching, messaging, backup and monitoring.

### 9.4 Structural elements

Source: [report 4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)

- **Web/POS client** — interface for cashier, manager and administrator. Sends commands via API, does not access the DB directly.
- **API Gateway / Web layer** — single point of HTTP interaction, request validation, authentication, routing to modules.
- **Catalog** — books, authors, publishers, categories, base prices and search.
- **Sales** — receipts, sale lines, payments, returns and posting rules.
- **Online orders** — cart, reservation, status process, handover and cancellation.
- **Stock** — stock levels, reservations, write-offs, inventory counts, transfers.
- **Purchasing** — suppliers, orders, expected deliveries, actual receiving.
- **CRM and loyalty** — customer cards, bonus accounts, segments, operation history.
- **Reports** — aggregates operational data for management metrics and export.
- **Message queue** — delivers non-critical events between modules and external integrations.
- **PostgreSQL** — main transactional data store.
- **Redis** — cache of reference and short-lived data, locks and technical idempotency keys.
- **Monitoring** — collects logs, metrics, technical errors and integration status.

**Synchronous vs asynchronous.** A sale and the stock deduction must complete within one transaction. Sending e-mail, updating secondary analytics or passing information to accounting can run after the main operation through the message queue, so temporary unavailability of an external service does not block the till.

**In-process event handling.** Domain events raised by an aggregate are handled just before it is saved, in the same transaction, so a sale, its bonus accrual and its audit record are saved together or not at all.

**Transactional outbox.** Not yet implemented; it is needed only for events leaving the transaction boundary. In that case, the business operation and the event record are saved in one DB transaction; a separate background process publishes the event to RabbitMQ. This reduces the risk that a sale is saved but its message is lost due to a network failure.

---

## 10. Technology Stack

Source: [report 4.5](Звіт_Книжковий%20магаз.md#45-технології-та-засоби)

- **Backend — ASP.NET Core / C#.** Well suited for business applications; mature typing, DI, transactions, background services, OpenAPI and container support.
- **Frontend — React + TypeScript.** Convenient for building a fast web interface with many forms, tables and states.
- **Database — PostgreSQL.** Reliable relational DBMS; ACID transactions, indexes, JSONB, replication and mature backup tools.
- **Cache — Redis.** Fast caching of the catalog and technical data, TTL, simple atomic operations.
- **Queue — RabbitMQ.** Clear event routing, delivery acknowledgement, retries and dead-letter queue.
- **API — REST + OpenAPI.** Simple integration with web/POS and external systems, automatic documentation.
- **Containers — Docker.** Identical environment for development, testing and production.
- **Reverse proxy — Nginx.** TLS termination, routing, request limiting, static files.
- **Monitoring — Prometheus + Grafana.** Performance metrics, dashboards, alerts.
- **Logs — OpenTelemetry + centralised storage.** Correlation of requests, errors and background execution.
- **CI/CD — GitHub Actions or GitLab CI.** Automated tests, container builds, controlled deployment.

The technology choice is not a strict requirement for a typical system. The same architecture can be implemented on Java/Spring, Node.js or another modern stack. More important are modularity, transactional correctness, tests, integration control and the ability to support the system for several years.

---

## 11. Other Technologies and Database Support

### 11.1 Patterns and mechanisms mentioned in the report

- **Transactional outbox** — publishing events from the DB transaction to RabbitMQ ([4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).
- **Idempotent commands, unique operation keys** — protection from double posting on repeated requests ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)); idempotency keys stored in Redis ([4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).
- **Transactions** — for operations changing stock or financial amounts ([2.1.3](Звіт_Книжковий%20магаз.md#213-нефункціональні-вимоги), [4.4](Звіт_Книжковий%20магаз.md#44-структурні-елементи-та-взаємодія)).
- **Adapters for integrations** — isolating payments, accounting, e-mail/SMS; retries without blocking main processes ([2.2.2](Звіт_Книжковий%20магаз.md#222-аналіз-обмежень)).
- **Timeouts, retries, separate payment status** — payment service unavailability ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).
- **Dead-letter queue** — RabbitMQ ([4.5](Звіт_Книжковий%20магаз.md#45-технології-та-засоби)).
- **Caching and horizontal scaling of web/backend** — peak periods ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).
- **RBAC, MFA for administrators, least privilege** — unauthorized access protection ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).
- **Soft delete** — reference data ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків), [4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)).
- **Replica, backups, test restore** — loss of central DB ([2.2.3](Звіт_Книжковий%20магаз.md#223-аналіз-ризиків)).
- **Materialized views** — faster reports on large data volumes ([4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)).
- **ArchiMate** — architecture layering ([4.3](Звіт_Книжковий%20магаз.md#43-архітектура-за-рівнями)).

### 11.2 External systems to integrate

Source: [report 1.2.2](Звіт_Книжковий%20магаз.md#122-проектні-припущення), [FR-20](#fr-20)

- Payment service (external; no payment details stored).
- Online shop.
- Accounting program (via API or files).
- E-mail / SMS notifications.

### 11.3 Database support

Source: [report 4.6](Звіт_Книжковий%20магаз.md#46-підтримка-бази-даних)

The data has close logical links: a sale contains lines, each line refers to a book, stock is defined per "location – book" pair, a purchase contains a supplier and list of ordered items. Therefore a **relational model** in **PostgreSQL** is used (transactions, foreign keys, integrity constraints).

The simplified model contains only the main entities; the full version will add tables for users and their roles, authors, book categories, publishers, payments, bonus operations, inventory counts and change history.

Database requirements:

- uniqueness of the combination `location_id` + `book_id` in stock records to avoid duplicates;
- uniqueness of ISBN for books, while allowing goods without ISBN;
- completed sales, purchases and other important operations are stored in the DB; outdated reference records can be deactivated instead of fully deleted;
- status changes of orders, purchases and transfers are stored in separate tables to view their history;
- materialized views or separate analytical structures can be used to speed up reports on large data volumes;
- regular database backups and verification of restore capability in case of failures.
