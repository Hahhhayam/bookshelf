# API gaps

What the client needs from the API to do what the project report (`Звіт_Книжковий магаз.md`) asks, and how it works around
the lack. A workaround in the code is a `stub('GAP-NN', …)` call or a comment naming the gap, so `GAP-NN` finds all of
them. Remove a stub when the server closes its gap.

- **Missing** — data or an endpoint the report requires; the client stubs it or leaves the part out.
- **Redundant** — something the API or the client has that no screen needs.
- **Broken** — something that exists but cannot work as the screens need; the client stubs around it.

## Missing

None open.

## Redundant

| Id | What | Why |
|---|---|---|
| R-01 | OpenAPI-generated client types (`openapi-typescript` + `openapi-fetch`) | The controllers return anonymous objects through `IActionResult` without `[ProducesResponseType]`, so the OpenAPI document has no response schemas. The client types requests and responses by hand in `entities/*/api` instead, and the generator was removed. |
| R-02 | `shippedBy` / `receivedBy` on the transfer card | The same users are in the transfer's history. |
| R-03 | `POST /sales/{id}/payments/{payment}/confirm` | The stub payment gateway always captures, so no payment is ever pending. |
| R-36 | `supplier` in `POST /deliveries` when `purchaseOrder` is given | The server takes the supplier from the order. The client sends `null` in that case. |
| R-46 | Permission `integrations.report` | No endpoint requires it. The role editor still lists it («Звіт інтеграцій» under «Звіти») so a role can carry every server code. |

## Broken

None open.

## Closed

Closed on 2026-11-17 (server endpoints plus client wiring): GAP-01, 03, 04, 05, 06, 07, 08, 10, 12, 13, 14, 16, 17, 20,
24, 25, 27, 31, 34, 38, 39, 41, 42, 47, 48, 49, 50, 51, 52, 53, 54; B-01, 02, 21, 22, 26, 27, 31, 36, 37, 41, 46, 51;
R-42. Business-rule errors carry a machine code (`src/server/ERROR_CODES.md`) that the client shows in Ukrainian.

## Dropped

The mock-up artboards showed features the report does not ask for; the client no longer shows them, so their gaps are
closed: GAP-02 customer sign-in, GAP-09 write-off and reservation lists, GAP-11 customer search by name or phone,
GAP-15/32/33 extra list columns, GAP-18 login lockout, GAP-19 offline sale queue, GAP-21 customer cancellation,
GAP-22 online payment choice, GAP-23 delivery cost, GAP-26 receipt and fiscal numbers, GAP-28 sale outcome,
GAP-35 transfer waybill, GAP-36 purchase order numbers, GAP-37 purchase order totals in the list, GAP-40 supplier
confirmation, GAP-43 changing promotions, GAP-44 audit on viewing a customer, GAP-45 extra book and customer fields,
GAP-46 role descriptions. R-41 was wrong (3.3 asks for an effective moment, now GAP-51); R-47 was wrong (3.12 asks for
average check and margin, «ефективність магазинів»).
