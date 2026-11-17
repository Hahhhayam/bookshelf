# Demo data

`demo-data.sql` fills an empty, migrated database with a chain ready for manual checks. `generate_demo_data.py`
produces it, so edit the generator and rerun `python generate_demo_data.py` instead of editing the SQL. Ids are fixed
across runs, and dates are relative to the moment the script is applied (sales over the last 30 days, a delivery
overdue by 3 days, and so on). The script refuses to run on a database that already has a catalog.

## Load into Docker

From `src/server`, after `docker compose up -d --build` has started the API (it migrates the database):

```bash
docker compose cp Seed/demo-data.sql db:/tmp/demo-data.sql
MSYS_NO_PATHCONV=1 docker compose exec db sh -c '/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d Bookstore -b -i /tmp/demo-data.sql'
```

`MSYS_NO_PATHCONV=1` only matters in Git Bash on Windows, where it stops the container path from being rewritten.
To start over: `docker compose down -v`, then up and load again.

## What is inside

Every staff login below has password `demo`; `root` / `root` is created by the API itself.

| Login | Role | Locations |
|---|---|---|
| `cashier.kyiv`, `cashier.lviv`, `cashier.odesa` | Касир | own store |
| `cashier.former` | Касир, **blocked** | Київ |
| `admin.kyiv`, `admin.lviv`, `admin.odesa` | Адміністратор магазину | own store |
| `keeper` | Комірник | both warehouses |
| `purchasing` | Менеджер із закупівель | all |
| `commercial` | Комерційний відділ | — |
| `marketer` | CRM-маркетолог | — |
| `chain.manager` | Керівник мережі | all |
| `sysadmin` | Системний адміністратор | all |

- **Locations:** central warehouse, Lviv warehouse, stores in Kyiv, Lviv, Odesa, and a closed store in Kyiv.
- **Catalog:** 8 categories, 28 items (books and stationery, one deactivated), price history for «Дюна», «Кобзар»,
  «Атомні звички».
- **Stock:** opening receipts, then every document below moves it; some store items fall under the minimum of 5.
- **Sales:** about 200 receipts over 30 days in the three stores, cash and card; an open shift in each store today;
  a pending return in Kyiv.
- **Online orders:** New, Confirmed, Picking, Ready (Kyiv and Odesa), Issued, Cancelled, a delivery and a B2B order,
  with their reservations. Ready order in Odesa: pickup code `9e67846a2ea0543590544ad9832027ee`.
- **Customers:** 10 with tiers, segments and bonus balances. Olena Kovalenko
  (`4841aa63-c39c-5485-b300-902981060708`, use it as `VITE_SHOP_CUSTOMER_ID`) has a cart and a personal offer.
- **Promotions:** children's week, a students' science offer, a two-«Дюна» discount, a personal offer, one expired.
  Gift certificates `GC-1000` (500 ₴), `GC-1001` (1000 ₴), `GC-1002` (empty).
- **Transfers:** Created, Approved (stock reserved), Shipped (in transit to Lviv), Received with an unresolved
  discrepancy in Odesa.
- **Purchasing:** supplier orders Draft, Sent, Sent and overdue, Received (with its goods receipt); 3 open
  missing-book requests.
- **Inventory:** an open count in Odesa; a past write-off in Kyiv.
- **Integrations:** the accounting export is failing with a last error; notifications are disabled.
