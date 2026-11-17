# Error codes

Every error response is RFC 7807 problem details with a stable `code` extension; `detail` is English text for logs.
`blank` also carries `field` (the camelCase name of the empty value); `not-found` carries `subject` ("Book", "Transfer"…).
The client translates codes in `src/client/src/shared/api/errorMessages.ts`. A rule is raised with
`Guard.That(condition, code, message)` or `new DomainException(code, message)`; reuse a code when the same rule is
checked in several places.

| Code | Status | Meaning | Where |
|---|---|---|---|
| `unauthenticated` | 401 | No valid session | `HttpContextCurrentUser` |
| `invalid-credentials` | 401 | Wrong login or password | `AdministrationController` (login) |
| `account-blocked` | 403 | The account is blocked | `AdministrationController` (login) |
| `forbidden` | 403 | Missing permission or location access | `CurrentUserExtensions` |
| `not-found` | 404 | The `subject` does not exist | `OrNotFound`, `GetPriceHistoryUseCase` |
| `payment-declined` | 402 | The card terminal declined the payment | `SalePaymentSettler` |
| `blank` | 422 | A required text (`field`) is empty | `Guard.NotBlank` (names, titles, codes, reasons…) |
| `amount-not-positive` | 422 | A payment, certificate value or redemption must be above zero | `Payment`, `GiftCertificate` |
| `author-not-found` | 422 | A referenced author does not exist | `AddBookUseCase`, `UpdateBookDetailsUseCase` |
| `bonus-balance-negative` | 422 | Bonus balance cannot go below zero | `BonusBalance` |
| `bonus-insufficient` | 422 | Not enough bonuses to redeem | `BonusAccount` |
| `bonus-points-not-positive` | 422 | Accrued, redeemed or reversed points must be positive | `BonusAccount` |
| `book-inactive` | 422 | The book is not on sale | `PlaceOrderUseCase`, `SaleLinePricer` |
| `card-taken` | 422 | The customer card is already registered | `RegisterCustomerUseCase` |
| `cart-line-not-found` | 422 | The item is not in the cart | `Cart` |
| `category-not-found` | 422 | The category does not exist | `AddBookUseCase`, `UpdateBookDetailsUseCase` |
| `certificate-balance-insufficient` | 422 | The gift certificate balance is too low | `GiftCertificate` |
| `certificate-number-taken` | 422 | A certificate with this number exists | `IssueGiftCertificateUseCase` |
| `contact-required` | 422 | A customer needs a phone or an e-mail | `ContactInfo` |
| `count-incomplete` | 422 | Every count line must be counted | `InventoryCount` |
| `count-line-not-found` | 422 | The item is not part of the count | `InventoryCount` |
| `count-status-invalid` | 422 | The count is in the wrong status for this step | `InventoryCount` |
| `currency-invalid` | 422 | Currency is not a three-letter ISO code | `CurrencyCode` |
| `currency-mismatch` | 422 | Amounts in different currencies | `Money` |
| `customer-required` | 422 | Bonuses can be spent only by an identified customer | `SaleBonusRedeemer` |
| `delivery-address-required` | 422 | A delivery order needs an address | `OrdersController` |
| `discount-exceeds-line` | 422 | A discount exceeds the line amount | `SaleLine` |
| `discount-out-of-range` | 422 | Promotion discount must be 1–100 % | `Promotion` |
| `discrepancy-not-found` | 422 | The discrepancy is not part of the transfer | `Transfer` |
| `discrepancy-resolved` | 422 | The discrepancy is already resolved | `Discrepancy` |
| `idempotency-key-too-long` | 422 | `Idempotency-Key` over 128 characters | `IdempotencyKey` |
| `isbn-invalid` | 422 | Not a valid ISBN-10/13 | `Isbn` |
| `isbn-taken` | 422 | The ISBN already exists in the catalog | `Book` |
| `line-duplicate` | 422 | An item appears twice in one document | `Order`, `PurchaseOrder`, `Return`, `Transfer`, `WriteOff` |
| `lines-empty` | 422 | A document needs at least one line | `Sale`, `Order`, `Return`, `Transfer`, `WriteOff`, `PurchaseOrder`, `GoodsReceipt`, `InventoryCount` |
| `login-taken` | 422 | The login is already taken | `CreateUserUseCase` |
| `order-status-not-manual` | 422 | The order status cannot be set by hand | `ChangeOrderStatusUseCase` |
| `order-transition-invalid` | 422 | The order cannot move from its status to the target | `Order` |
| `payment-failed` | 422 | A sale cannot include a failed payment | `Sale` |
| `payment-not-found` | 422 | The payment is not part of the sale | `Sale` |
| `payments-total-mismatch` | 422 | Payments must add up to the receipt total (B-01) | `Sale` |
| `period-invalid` | 422 | A period must end after it starts | `Period`, `ListSalesUseCase` |
| `pickup-location-required` | 422 | A pickup order needs a pickup location | `OrdersController` |
| `pickup-location-not-store` | 422 | A pickup order names a warehouse or a closed store | `PlaceOrderUseCase` |
| `price-negative` | 422 | A price or discount is negative | `Book`, `ScheduledPrice`, `SaleLine` |
| `publisher-not-found` | 422 | The publisher does not exist | `AddBookUseCase`, `UpdateBookDetailsUseCase` |
| `purchase-order-status-invalid` | 422 | The purchase order is in the wrong status (send, cancel, receive) | `PurchaseOrder` |
| `quantity-negative` | 422 | A quantity is negative | `Quantity` |
| `quantity-not-positive` | 422 | A line quantity must be above zero | `Cart`, `Order`, `PurchaseOrder`, `Return`, `SaleLine`, `StockItem`, `Transfer`, `WriteOff` |
| `receipt-confirmed` | 422 | The goods receipt is already confirmed | `GoodsReceipt` |
| `request-not-open` | 422 | The missing-book request is no longer open | `MissingBookRequest` |
| `reservation-not-found` | 422 | No active stock reservation for the order or transfer | `StockItem`, `ChangeOrderStatusUseCase`, `ShipTransferUseCase` |
| `return-confirmed` | 422 | The return is already confirmed | `Return` |
| `return-not-permitted` | 422 | The user may not confirm returns | `Return` |
| `return-period-expired` | 422 | The return period is over | `CreateReturnUseCase` |
| `return-quantity-exceeded` | 422 | More than sold minus earlier returns | `Return` |
| `sale-cancel-not-permitted` | 422 | The user may not cancel sales | `Sale` |
| `sale-not-completed` | 422 | Only a completed sale can be returned or cancelled | `Return`, `Sale` |
| `scheduled-price-not-future` | 422 | A scheduled price must take effect in the future | `ScheduledPrice` |
| `scheduled-price-wrong-book` | 422 | A scheduled price belongs to another book | `ScheduledPrice` |
| `shift-already-open` | 422 | A shift is already open at this store | `OpenShiftUseCase` |
| `shift-closed` | 422 | The shift is already closed | `Shift` |
| `shift-not-open` | 422 | The till is closed: no open shift | `CompleteSaleUseCase` |
| `stock-below-reserved` | 422 | On hand would drop below reserved | `StockItem` |
| `stock-insufficient` | 422 | Not enough available stock | `StockAvailability`, `StockItem` |
| `supplier-inactive` | 422 | The supplier is deactivated | `CreatePurchaseOrderUseCase` |
| `supplier-required` | 422 | An unplanned delivery needs a supplier | `ReceiveDeliveryUseCase` |
| `tender-insufficient` | 422 | Tendered cash is less than the amount paid | `Payment` |
| `tender-not-cash` | 422 | Only cash can be tendered with change | `Payment` |
| `too-many-ids` | 422 | Too many books looked up at once | `SearchBooksUseCase` |
| `transfer-same-location` | 422 | A transfer needs two different locations | `Route` |
| `transfer-status-invalid` | 422 | The transfer is in the wrong status for this step | `Transfer` |
