# Design: «Полиця»

Source of truth: the Claude Design canvas «Книгарня — дизайн системи»,
<https://claude.ai/artifact/J4L2XExGCDWJ8xHc8MeoKL>. `project/` holds a copy of its artboard sources (`*.dc.html`) and
index (`canvas.json`), taken from version `1794707789-69e5`. Re-download them when the canvas changes; do not edit the
copies here. How the screens behave is in [UI_Design.md](../UI_Design.md).

## Artboards

| Page type (UI_Design / design prompt) | Artboard |
|---|---|
| Tokens and palette | `Main.dc.html` |
| Components | `Components.dc.html` |
| 1 · Login: normal, error, blocked | `Login.dc.html` |
| 2 · Staff shell (store admin) + 3 · transfer list | `Transfers.dc.html` |
| 2 · Cashier shell, offline state | `ShellCashier.dc.html` |
| 3 · List page and its states (purchase orders) | `ListStates.dc.html` |
| 4 · Document card (transfer with discrepancy) | `Document.dc.html` |
| 5 · Kanban (online orders) | `Kanban.dc.html` |
| 6 · Line-entry editor (receiving) | `Receiving.dc.html` |
| 7 · Till: receipt, split payment, closed receipt and errors | `Till.dc.html`, `TillPay.dc.html`, `TillStates.dc.html` |
| 8 · Reports dashboard | `Reports.dc.html` |
| 9 · Customer card | `Customer.dc.html` |
| 10 · Book form; price change dialog and role editor | `BookForm.dc.html`, `FormDialogs.dc.html` |
| 11 · Audit log | `Audit.dc.html` |
| 12 · Shop: catalog, book, cart, checkout, confirmation, tracking, mobile | `ShopCatalog`, `ShopBook`, `ShopCart`, `ShopCheckout`, `ShopConfirm`, `ShopTrack`, `ShopMobile` |
| 13 · System states | `SystemStates.dc.html` |

## Tokens

Warm neutral base like paper and shelf wood; one plum accent only for the main action, focus and selection;
**square corners everywhere**; a status scale that never overlaps the accent.

**Neutrals**

| Token | Hex | Use |
|---|---|---|
| paper | `#F6F3ED` | app background |
| surface | `#FFFFFF` | cards, tables, inputs |
| sunk | `#EFEAE1` | table headers, menus, disabled fill |
| line | `#E3DCD0` | dividers, card borders |
| line-strong | `#CFC6B7` | input and button borders |
| ink-3 | `#6E665A` | hints (5.3:1) |
| ink-2 | `#4D463D` | secondary text (8.9:1) |
| ink | `#1E1A16` | main text (16:1) |
| side panel | `#FBF9F5` | staff navigation background |

**Accent (plum)**

| Token | Hex | Use |
|---|---|---|
| accent | `#5B2C6F` | primary button, links, focus ring (white text 10.6:1) |
| accent-hover | `#4A2259` | hover, pressed |
| accent-2 | `#8E5BA3` | graphics only, never text |
| accent-soft | `#F2EAF4` | selected nav item, focused input halo |

**Status scale** (badge: 22 px high, 6 px square dot + word; colour never stands alone)

| Meaning | Examples | Text | Background | Dot |
|---|---|---|---|---|
| new / draft | Нове, Чернетка | `#4D463D` | `#EDE9E3` | `#8C8478` |
| in progress | Підтверджене, Комплектується, В дорозі | `#1F4F99` | `#E4ECF9` | `#2F6BD0` |
| ready | Готове до видачі | `#1D6A3A` | `#E2F1E7` | `#2E8B50` |
| done | Видано, Отримано, Закрито | `#4D463D` | `#FFFFFF` + inset 1 px `#D6CEC1` | `#A79F92` |
| cancelled / problem | Скасовано, Відхилено, Розбіжність | `#A12A1F` | `#FBE6E4` | `#D0402F` |
| overdue / attention | Прострочено, Мало на складі | `#855100` | `#FDF0D7` | `#D98B0B` |

Danger button `#A12A1F`; positive money `#1D6A3A`; disabled text `#8C8478` on `#EFEAE1`; offline banner `#3A2A12`
with `#FDF0D7` text and `#F2B84B` icon.

**Type** — pair E «Книжкова», chosen for all artboards: UI **Commissioner** (400/500/600/700), display **EB Garamond**
(500/600, brand and shop showcase only), mono **Fira Mono** (500, codes, ISBN, keys). Numbers always tabular
(`font-feature-settings: 'tnum' 1`).

| Style | Size / line | Weight |
|---|---|---|
| display | 48 / 56 | 700, −0.02em |
| h1 | 28 / 36 | 600, −0.01em |
| h2 | 20 / 28 | 600 |
| h3 | 16 / 24 | 600 |
| body | 14 / 20 | 400 (till: base 16) |
| small | 13 / 18 | 400 |
| caption | 12 / 16 | 600, +0.02em, uppercase for section labels |

**Spacing** — 4 px step: 4, 8, 12, 16, 24, 32, 48, 64.

**Corners** — 0 px everywhere, avatars and status dots included. Selection is a 3 px inset accent bar.

**Elevation** — e1 card: `0 1px 2px rgba(30,26,22,.06)` + 1 px `#E3DCD0`; e2 menu/toast: `0 6px 16px rgba(30,26,22,.10)`;
e3 dialog: `0 20px 48px rgba(30,26,22,.18)`.

**Focus** — `outline: 2px solid #5B2C6F; outline-offset: 2px`; inputs on focus: border `#5B2C6F` + `0 0 0 3px #F2EAF4`.

**Sizes** — buttons 40 px (primary actions on login/shop 48 px), inputs 40–44 px, nav items 44 px, table header 38–40 px,
keyboard hint (kbd) 22 px with a 2 px bottom border. Icons: 1.75 px stroke, square caps and joins.

## Till keyboard flow (from the canvas notes)

1. The scan field always has focus. A scan, or Enter after an ISBN, adds a line; focus stays in the field.
2. `+` / `−` change the quantity of the last line; `Del` removes it (with confirmation).
3. `F4` finds the customer by card or phone; `Esc` returns to the scan field.
4. `F8` cash, `F9` card, `F10` gift certificate. Enter confirms the amount and closes the receipt.
5. `F2` searches books by title; `F12` leaves the till (only with an empty receipt).

Split payment: `F7` opens the dialog. `Tab` moves between methods; Enter in a field fills in what is left to pay;
«Залишилось сплатити» updates at once; `Ctrl+Enter` posts the payment when nothing is left; `Esc` closes without changes.
