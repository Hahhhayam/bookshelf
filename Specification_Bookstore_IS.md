# Bookstore Chain Information System — Specification

Business cases, functional and non-functional requirements, technology stack, and other technologies.

Source: course report «Типова інформаційна система мережі книжкових магазинів» (KPI, 2026). This document contains only content from that report, translated to English and regrouped. Section/table numbers of the original are given in brackets.

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

### 1.1 Goal (report 1.1)

Develop a typical information system for a bookstore chain that unites the core processes of stores, the central warehouse and administrative departments. The system centrally stores and processes information about books, prices, stock, orders and customers, reduces manual operations, avoids data duplication, speeds up customer service and simplifies inventory management.

Tasks to achieve the goal:

- create a single book catalog with ISBN, title, author, publisher, genre, price and other attributes;
- track stock in every store and in the central warehouse;
- automate sales, returns, book reservations and online order processing;
- track movements of goods between stores and the warehouse;
- simplify purchasing, work with suppliers and control of incoming goods;
- create a customer base with a loyalty program;
- generate reports on sales, stock, turnover and performance.

### 1.2 Problem (report 1.2)

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

### 2.1 Project assumptions (report 1.2.2)

- The chain consists of a head office, a warehouse and several stores working in one shared system.
- All stores have Internet access, but temporary connection outages are possible.
- ISBN identifies books, but the system must also support goods without ISBN (e.g. stationery, gift sets).
- Employees use the system through a web interface; cashiers have a separate mode adapted for fast sales.
- Physical stores and the online shop use a shared catalog, prices and availability.
- Card payments are made through an external payment service; the system does not store customer payment details.
- Accounting may be done in a separate program; the system exchanges data with it via API or files.
- The chain may expand, so new stores must be addable without changing program code.

### 2.2 Product scope (report 1.2.3)

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

### 3.1 Users (report table 1.1)

| Role | Main activities | Key needs |
| --- | --- | --- |
| Customer | Searches books, views availability, places online orders, gets status and bonus information. | Simple interface, accurate stock, fast ordering. |
| Cashier | Sales, reservations, returns, checks availability across the chain, works with the customer card. | Minimum unnecessary fields, fast search, barcode support. |
| Store administrator | Controls shifts, local stock, inventory counts, transfers and complex returns. | Extended rights within own store, local reports. |
| Warehouse keeper | Receives deliveries, forms shipments, transfers, write-offs and inventory counts. | Accurate quantities, scanning, clear document statuses. |
| Purchasing manager | Creates supplier orders, controls deadlines and purchase prices. | Demand forecast, purchase history, control of unfulfilled deliveries. |
| Marketing / CRM manager | Creates promotions, customer segments, analyses repeat purchases and bonus programs. | Correct customer data, flexible discount rules. |
| Chain manager | Views consolidated store, sales, stock and profitability metrics. | Dashboards, period comparison, minimum manual consolidation. |
| System administrator | Creates users and roles, configures locations, monitors logs and integrations. | Secure administration, audit, technical diagnostics. |

### 3.2 Organisational units (report table 1.2)

| Unit | Functions |
| --- | --- |
| Chain management | Defines strategy, budget, KPIs and store operating rules. |
| Operations department | Coordinates stores, warehouse, inventory counts, transfers and compliance with operating procedures. |
| Commercial department | Forms the assortment, works with publishers and suppliers, agrees purchasing terms. |
| Stores | Sales, reservations, returns, receiving local deliveries, customer service. |
| Central warehouse | Receives large deliveries, stores stock and replenishes stores. |
| Marketing and CRM | Manages promotions, loyalty program, segmentation and customer communications. |
| Finance and accounting | Receives data on sales, purchases and returns, controls financial reporting. |
| IT and support | Supports the system, users, integrations, backups and information security. |

### 3.3 Stakeholders (report table 1.3)

| Stakeholder | Interest | Responsibility / interaction |
| --- | --- | --- |
| Owners / investors | Stable profit, control of chain efficiency, scalability. | Receive consolidated reports and KPIs, do not interfere with daily operations. |
| Management | Transparency of sales, stock, purchases and store performance. | Define policies, roles, regulations and KPIs. |
| Store employees | Fast customer service and minimum manual work. | Responsible for correct sales, returns and local operations. |
| Warehouse and logistics | Accurate stock and control of transfers. | Responsible for receiving, shipping, write-offs and inventory counts. |
| Suppliers | Clear orders, predictable communication and delivery confirmation. | Provide catalog, prices, deadlines and actual delivery volumes. |
| Customers | Accurate book information, convenient purchases, bonuses, personal data protection. | Provide data only for registration and ordering. |
| IT department | Stability, manageability and security of the system. | Supports access, monitoring, backups and integrations. |
| Finance department | Correct operation data and ability to reconcile. | Controls financial documents and interaction with the external accounting system. |

---

## 4. Business Cases

### 4.1 Business goals and metrics (report table 2.4)

| Business goal | How the system supports it | Metric |
| --- | --- | --- |
| Reduce stock discrepancies | Single system of goods movements, inventory counts, adjustment log. | Share of items without discrepancies at inventory count. |
| Shorten service time | Fast search, barcode, automatic discounts, single customer card. | Average sale duration and queue in peak hours. |
| Reduce shortages of popular books | Minimum stock levels, sales velocity reports, replenishment recommendations. | Number of out-of-stock cases for top SKUs. |
| Reduce excess stock | Analysis of turnover and slow-moving items, control of orders. | Days of stock, share of items without sales for 90/180 days. |
| Improve omnichannel service | Single stock for offline and online, reservations, order statuses. | Share of orders delivered without substitution or cancellation. |
| Increase repeat sales | CRM, bonuses, purchase history, personal offers. | Share of repeat customers, bonus usage. |
| Speed up management reporting | Consolidated data and ready-made reports. | Report preparation time and number of manual operations. |

### 4.2 Products and services (report table 2.7)

| Product or service | How the system supports it |
| --- | --- |
| Retail book sales | Search, sale, discounts, returns, receipt, customer card. |
| Online orders | Website orders with reservation in a store or warehouse, status control. |
| Click & collect | Order prepared in the chosen store and handed over by number or code. |
| Loyalty program | Bonuses, tiers, personal offers, history of accruals and redemptions. |
| Gift certificates | Sale and use of a certificate with balance control. |
| Ordering a missing book | Recording demand for an unavailable item for later replenishment. |
| B2B sales | Large orders for schools, companies or libraries with special terms. |
| Analytical services for management | Reports on sales, stock, turnover, margin and store efficiency. |

---

## 5. Functional Requirements

### 5.1 Main product functions (report table 2.1)

| Function | Functionality | Description |
| --- | --- | --- |
| Catalog | Managing books and reference data | Book card, ISBN, authors, publisher, genre, price, attributes, sale status. |
| Search | Fast item search | Search by title, ISBN, author, category, filters and availability in a specific store. |
| Stock | Stock records | Stock per location, reserved, available, minimum stock, reasons for adjustments. |
| Sales | Retail operation | Cart, discounts, customer, payment, receipt, return and cancellation with rights check. |
| Online orders | Omnichannel order | Placing, reservation, confirmation, preparation, handover or delivery, cancellation. |
| Purchasing | Work with suppliers | Demand calculation, supplier order, expected date, receiving and discrepancies. |
| Transfers | Distributing goods between locations | Transfer document, shipment, receipt and control of differences. |
| CRM | Customers and loyalty | Customer card, purchase history, bonus balance, program tier, personal offers. |
| Analytics | Management reports | Sales, margin, average check, turnover, shortages, surpluses, ABC analysis, store efficiency. |
| Administration | Users and access | Roles, permissions, stores, settings, integrations, audit log. |

### 5.2 Functional requirements (report table 2.2)

| Code | Name | Requirement |
| --- | --- | --- |
| FR-01 | Authorization | The system must allow login with an account and determine user rights according to role and store. |
| FR-02 | Book catalog | An authorized user can add, edit and deactivate books. ISBN uniqueness must be checked. |
| FR-03 | Search | A user can find a book by title, ISBN, author, publisher or category and see availability across the chain. |
| FR-04 | Sale | A cashier can create a receipt with several items, apply an allowed discount, select the customer and payment method. |
| FR-05 | Return | The system allows a return based on a sale. The operation is recorded in history and changes stock only after confirmation. |
| FR-06 | Reservation | A book can be reserved for a customer for a defined time. The reserved quantity must not be sold to another online customer. |
| FR-07 | Online order | A customer can place an order, and a store employee changes its status along the allowed route. |
| FR-08 | Order statuses | At least the following statuses are supported: New, Confirmed, Picking, Ready, Issued, Cancelled. |
| FR-09 | Stock | The system stores actual, reserved and available stock separately for each location. |
| FR-10 | Transfers | A user can create a transfer between locations. The sender and receiver separately confirm shipment and receipt. |
| FR-11 | Purchasing | A manager can create supplier orders, add items, purchase price, quantity and expected date. |
| FR-12 | Receiving | During receiving the system allows recording the actual quantity and the discrepancy with the order. |
| FR-13 | Inventory count | An administrator can open an inventory count, enter actual stock and, after approval, generate an adjustment. |
| FR-14 | Loyalty program | The system accrues and redeems bonuses by rules, stores operation history and does not allow a negative bonus balance. |
| FR-15 | Promotions | An authorized user creates a promotion with validity period, conditions and priority. At sale the system automatically checks applicable rules. |
| FR-16 | Reports | A manager can generate reports by period, store, category, book and other available dimensions. |
| FR-17 | Change history | For critical entities the system stores the user, time, action type and values of key fields before and after the change. |
| FR-18 | Notifications | The system creates notifications about order readiness, low stock, overdue delivery and critical integration errors. |
| FR-19 | Users | An administrator can create, block and restore users, assign roles and access to locations. |
| FR-20 | Integrations | The system must have an API or exchange mechanism for the payment service, online shop, accounting and notifications. |

---

## 6. Non-Functional Requirements

(report table 2.3)

| Name | Requirement |
| --- | --- |
| Performance | Typical operations — search, opening a card, adding an item to a sale — must respond within 2 seconds under normal load. |
| Scalability | The architecture must allow adding new stores and increasing the number of users without reworking the domain model. |
| Availability | Target availability of central services is at least 99.9% per month, except agreed maintenance windows. |
| Data reliability | Operations that change stock or financial amounts are executed transactionally. A partially posted document must not change the records. |
| Security | Data transfer only over HTTPS. Passwords are stored as strong hashes. Access to functions is determined by roles. |
| Audit | Critical actions, including price change, manual stock adjustment, return and access rights change, must be logged. |
| Backup | Full DB backup daily, incremental or log-based backup during the day. Periodic test restore is mandatory. |
| Usability | Main POS operations must be performed without going through unnecessary screens. The interface must support keyboard and barcode scanner. |
| Compatibility | The web interface supports current versions of Chrome, Edge and Safari. The API uses JSON and is documented with OpenAPI. |
| Maintainability | Code is divided into modules by business domain, has automated tests and centralised logging. |
| Observability | For server components, metrics of errors, response time, queues, DB connections and integration status are collected. |
| Recovery | For critical services the target RPO is up to 15 minutes and RTO up to 2 hours, provided backup infrastructure is available. |

---

## 7. Constraints and Risks

### 7.1 Constraints (report table 2.5)

| Constraint | Essence | Impact on solution |
| --- | --- | --- |
| Budget | The chain cannot support a large DevOps team and dozens of independent services. | Simple infrastructure at the start with the possibility to scale. |
| Internet in stores | Short connection outages are possible. | The client must correctly report loss of connection; POS operations must not be duplicated on resend. |
| External systems | Payments, accounting, e-mail/SMS have their own APIs and limitations. | Integrations are isolated through adapters; errors are retried without blocking main processes. |
| Personal data | The system stores customer contacts and purchase history. | Minimal data collection, access control, logging and a retention policy are required. |
| Seasonality | Load increases significantly before holidays and big promotions. | Infrastructure must have performance headroom and the ability to scale quickly. |
| Different user skill levels | Store employees may have different technical experience. | The interface must be simple, with hints and protection from erroneous actions. |
| Data migration | At the start part of the catalog and stock may be in spreadsheets or an old system. | Import, validation, test load and reconciliation before launch are required. |

### 7.2 Risk register (report table 2.6)

| Risk | Probability | Impact | Measures |
| --- | --- | --- | --- |
| Incorrect stock after migration | Medium | High | Test migration, reconciliation with inventory count, discrepancy log. |
| Double posting of an operation due to a repeated request | Medium | High | Idempotent commands, unique operation keys, transactions. |
| Payment service unavailable | Medium | Medium | Timeouts, retries, separate payment status, alternative payment method. |
| Loss of the central DB | Low | Critical | Backups, replica, test restore, RPO/RTO control. |
| Unauthorized access | Medium | Critical | RBAC, MFA for administrators, HTTPS, audit, principle of least privilege. |
| Overload in peak period | Medium | High | Catalog caching, query optimisation, horizontal scaling of web/backend. |
| Error in promotion rules | Medium | Medium | Test environment, start/end date, rule priority, preliminary calculation. |
| Staff resistance to the new system | Medium | Medium | Pilot in 1–2 stores, training, short instructions, feedback collection. |
| Supplier delivery delay | High | Medium | Control of expected dates, reminders, alternative suppliers. |
| Accidental deletion of reference data | Low | High | Soft delete, confirmation, restricted rights, change log. |

---

## 8. User Scenarios

(report section 3)

| # | Scenario | Role | Preconditions | Main flow |
| --- | --- | --- | --- | --- |
| 3.1 | Login | Store employee | Account active, role and store assigned. | 1) User enters login and password. 2) System checks credentials, user status and allowed locations. 3) On success a session is created and the role's start page opens. 4) A failed attempt is logged without storing the entered password. |
| 3.2 | Add a new book | Content manager / purchasing manager | User has catalog edit rights. | 1) User clicks "Add book". 2) Enters ISBN, title, authors, publisher, category, price and other attributes. 3) System checks required fields and ISBN uniqueness. 4) After confirmation the book card is created and the action goes to change history. |
| 3.3 | Edit price | Commercial manager | Book exists, user has price change rights. | 1) User opens the book card and changes the base price. 2) System shows old and new value and asks for confirmation. 3) After saving the new price is active from the specified moment. 4) The old price is not deleted and stays in history. |
| 3.4 | Delete or deactivate a book | Catalog manager | Book is no longer sold or was created by mistake. | 1) User selects "Deactivate". 2) System checks for active orders, reservations or unfulfilled deliveries. 3) If dependencies exist, full deletion is forbidden and only deactivation is offered. 4) After confirmation the book is hidden from the active catalog, historical operations are kept. |
| 3.5 | Sale | Cashier | Till open, goods available in stock. | 1) Cashier scans a barcode or finds the book via search. 2) System adds the item, checks stock and calculates promotions automatically. 3) If a customer card is present, bonuses and allowed redemption are shown. 4) After choosing the payment method the sale is confirmed. 5) System creates the receipt, reduces stock and records the operation in history. |
| 3.6 | Return | Cashier / administrator | Original sale exists; return period and conditions allow the operation. | 1) Employee finds the receipt and selects the item to return. 2) System checks quantity, previous returns and user rights. 3) Employee enters the reason and book condition. 4) After confirmation a return document is created, amount and stock are adjusted by rules. |
| 3.7 | Transfer between stores | Administrator / warehouse keeper | Sending store has sufficient available stock. | 1) User creates a transfer, selects locations and books. 2) After approval goods are reserved for the transfer. 3) Sender confirms actual shipment. 4) Receiver accepts the delivery and records the actual quantity. 5) If there is a discrepancy, the system creates a separate record for review. |
| 3.8 | Online order and status change | Customer and store employee | Book is available for reservation. | 1) Customer adds books to the cart and chooses pickup or delivery. 2) System reserves the available quantity and creates an order with status "New". 3) Employee confirms the order, status changes to "Picking". 4) After picking the order becomes "Ready", the customer is notified. 5) At handover the status becomes "Issued", the reservation turns into an actual write-off. |
| 3.9 | Receiving a delivery | Warehouse keeper | A supplier order or an allowed unplanned receipt exists. | 1) Keeper opens the expected delivery and starts receiving. 2) Books are scanned, the system shows ordered and actual quantity. 3) Discrepancies are recorded separately. 4) User confirms the document. 5) System increases stock and changes the purchase status. |
| 3.10 | View change history | Manager / administrator | User has audit rights. | 1) User opens an entity, e.g. order, book or stock adjustment. 2) Goes to the "History" tab. 3) System shows the sequence of events with date, user, action type and key changes. 4) Filters by period or event type can be applied. |
| 3.11 | Status display | Customer / employee / manager | Object has a status lifecycle. | 1) User opens a list of orders, deliveries or transfers. 2) System shows current status, date of last change and responsible person. 3) Overdue or problem objects get a separate warning. 4) In the card, allowed next actions depend on role and current status. |
| 3.12 | Management report | Chain manager | Sales and movements are accumulated for the selected period. | 1) Manager opens the analytics section. 2) Selects period, stores and metrics. 3) System aggregates data and shows sales, average check, margin, top books and slow-moving items. 4) User can drill down or export the report. |

---

## 9. Architecture

### 9.1 Options considered (report 4.1)

- **Classic monolith** — catalog, sales, stock, purchasing, CRM and reports in one application, often with a shared data model. Fast start, simple deployment, convenient transactions. Over time, without clear module boundaries, every change affects a large part of the system; teams work in parallel with difficulty; the whole application must be scaled.
- **Microservices** — independent services (Catalog Service, Inventory Service, Order Service, CRM Service), each may have its own DB, deployment lifecycle and scaling. Suits large systems with several teams. Brings distributed transactions, event delivery, duplicate messages, tracing, network errors, API version compatibility and monitoring of dozens of components. For a typical bookstore chain at the start — more risk than benefit.
- **Modular monolith with event integrations** — one server application with strictly separated modules: catalog, sales, orders, stock, purchasing, CRM, reports, administration. Modules interact through defined interfaces; direct access to another module's tables is forbidden at the code-structure level. Events are used where an immediate transactional response is not needed (analytics projection, bonus accrual, notifications). Critical stock and sale operations stay in one transactional boundary.

### 9.2 Comparison (report table 4.1, scale 1–5)

| Criterion | Monolith | Microservices | Modular monolith + events |
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

### 9.3 Architecture layers (report 4.3)

Three layers, close to ArchiMate logic:

- **Business layer** — users and processes: sales, purchasing, stock management, online orders, analytics.
- **Application layer** — system modules implementing these processes.
- **Technology layer** — application execution, data storage, caching, messaging, backup and monitoring.

### 9.4 Structural elements (report table 4.2)

| Component | Purpose |
| --- | --- |
| Web/POS client | Interface for cashier, manager and administrator. Sends commands via API, does not access the DB directly. |
| API Gateway / Web layer | Single point of HTTP interaction, request validation, authentication, routing to modules. |
| Catalog | Books, authors, publishers, categories, base prices and search. |
| Sales | Receipts, sale lines, payments, returns and posting rules. |
| Online orders | Cart, reservation, status process, handover and cancellation. |
| Stock | Stock levels, reservations, write-offs, inventory counts, transfers. |
| Purchasing | Suppliers, orders, expected deliveries, actual receiving. |
| CRM and loyalty | Customer cards, bonus accounts, segments, operation history. |
| Reports | Aggregates operational data for management metrics and export. |
| Message queue | Delivers non-critical events between modules and external integrations. |
| PostgreSQL | Main transactional data store. |
| Redis | Cache of reference and short-lived data, locks and technical idempotency keys. |
| Monitoring | Collects logs, metrics, technical errors and integration status. |

### 9.5 Synchronous vs asynchronous interaction (report 4.4)

- A sale and the stock deduction must complete within one transaction.
- Sending e-mail, updating secondary analytics or passing information to accounting can run after the main operation through the message queue, so temporary unavailability of an external service does not block the till.
- For events leaving the transaction boundary the **transactional outbox** pattern is used: the business operation and the event record are saved in one DB transaction; a separate background process publishes the event to RabbitMQ. This reduces the risk that a sale is saved but its message is lost due to a network failure.

---

## 10. Technology Stack

(report table 4.3)

| Area | Technology | Justification |
| --- | --- | --- |
| Backend | ASP.NET Core / C# | Well suited for business applications; mature typing, DI, transactions, background services, OpenAPI and container support. |
| Frontend | React + TypeScript | Convenient for building a fast web interface with many forms, tables and states. |
| Database | PostgreSQL | Reliable relational DBMS; ACID transactions, indexes, JSONB, replication and mature backup tools. |
| Cache | Redis | Fast caching of the catalog and technical data, TTL, simple atomic operations. |
| Queue | RabbitMQ | Clear event routing, delivery acknowledgement, retries and dead-letter queue. |
| API | REST + OpenAPI | Simple integration with web/POS and external systems, automatic documentation. |
| Containers | Docker | Identical environment for development, testing and production. |
| Reverse proxy | Nginx | TLS termination, routing, request limiting, static files. |
| Monitoring | Prometheus + Grafana | Performance metrics, dashboards, alerts. |
| Logs | OpenTelemetry + centralised storage | Correlation of requests, errors and background execution. |
| CI/CD | GitHub Actions or GitLab CI | Automated tests, container builds, controlled deployment. |

The technology choice is not a strict requirement for a typical system. The same architecture can be implemented on Java/Spring, Node.js or another modern stack. More important are modularity, transactional correctness, tests, integration control and the ability to support the system for several years.

---

## 11. Other Technologies and Database Support

### 11.1 Patterns and mechanisms mentioned in the report

| Mechanism | Where used (per report) |
| --- | --- |
| Transactional outbox | Publishing events from the DB transaction to RabbitMQ (4.4). |
| Idempotent commands, unique operation keys | Protection from double posting on repeated requests (2.6); idempotency keys in Redis (4.2). |
| Transactions | Operations changing stock or financial amounts (2.3, 4.4). |
| Adapters for integrations | Isolating payments, accounting, e-mail/SMS; retries without blocking main processes (2.5). |
| Timeouts, retries, separate payment status | Payment service unavailability (2.6). |
| Dead-letter queue | RabbitMQ (4.5). |
| Caching | Catalog caching for peak load (2.6, 4.5). |
| Horizontal scaling of web/backend | Peak periods (2.6). |
| RBAC, MFA for administrators, least privilege | Unauthorized access protection (2.6). |
| Soft delete | Reference data (2.6, 4.6). |
| Replica, backups, test restore | Loss of central DB (2.6, 2.3). |
| Materialized views | Faster reports on large data volumes (4.6). |
| ArchiMate | Architecture layering (4.3). |

### 11.2 External systems to integrate (per report)

- Payment service (external; no payment details stored).
- Online shop.
- Accounting program (via API or files).
- E-mail / SMS notifications.

### 11.3 Database support (report 4.6)

The data has close logical links: a sale contains lines, each line refers to a book, stock is defined per "location – book" pair, a purchase contains a supplier and list of ordered items. Therefore a **relational model** in **PostgreSQL** is used (transactions, foreign keys, integrity constraints).

The simplified model contains only the main entities; the full version will add tables for users and their roles, authors, book categories, publishers, payments, bonus operations, inventory counts and change history.

Database requirements:

- uniqueness of the combination `location_id` + `book_id` in stock records to avoid duplicates;
- uniqueness of ISBN for books, while allowing goods without ISBN;
- completed sales, purchases and other important operations are stored in the DB; outdated reference records can be deactivated instead of fully deleted;
- status changes of orders, purchases and transfers are stored in separate tables to view their history;
- materialized views or separate analytical structures can be used to speed up reports on large data volumes;
- regular database backups and verification of restore capability in case of failures.
