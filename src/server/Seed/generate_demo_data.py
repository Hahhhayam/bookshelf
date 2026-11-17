"""Generates demo-data.sql: a chain with stores, staff, catalog, stock, customers and documents in every state.

Ids are deterministic (uuid5), dates are relative to the moment the script runs. Run: python generate_demo_data.py
"""
import base64
import hashlib
import random
import uuid
from pathlib import Path

NS = uuid.UUID("6f1c1e52-6c5b-4b8e-9d3f-0b7a2f0d5e11")
PASSWORD = "demo"
OUT = Path(__file__).with_name("demo-data.sql")
rnd = random.Random(42)
sql: list[str] = []
after_stock: list[str] = []  # movements and reservations: stock items are written last, once their totals are known


def gid(*parts) -> str:
    return str(uuid.uuid5(NS, "/".join(map(str, parts))))


def q(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, Raw):
        return value.text
    return "N'" + str(value).replace("'", "''") + "'"


class Raw:
    def __init__(self, text: str):
        self.text = text


def ago(days: float = 0, hours: float = 0) -> Raw:
    return Raw(f"DATEADD(minute, {-int(days * 1440 + hours * 60)}, @now)")


def ahead_date(days: int) -> Raw:
    return Raw(f"CAST(DATEADD(day, {days}, @now) AS date)")


def insert(table: str, **cols):
    names = ", ".join(f"[{c}]" for c in cols)
    values = ", ".join(q(v) for v in cols.values())
    target = after_stock if table in ("inventory.StockMovements", "inventory.Reservations") else sql
    target.append(f"INSERT INTO {table} ({names}) VALUES ({values});")


def json_ids(ids) -> str:
    return "[" + ",".join(f'"{i}"' for i in ids) + "]"


def password_hash(password: str) -> str:
    salt = hashlib.sha256(b"bookshelf-demo-salt").digest()[:16]
    digest = hashlib.pbkdf2_hmac("sha512", password.encode(), salt, 210_000, 64)
    return f"210000.{base64.b64encode(salt).decode()}.{base64.b64encode(digest).decode()}"


def isbn13(n: int) -> str:
    body = f"978966{n:06d}"
    check = (10 - sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(body)) % 10) % 10
    return body + str(check)


# ---------------------------------------------------------------- locations

LOCATIONS = {
    "central": ("Центральний склад", "CentralWarehouse", "Київ, вул. Складська, 12", True),
    "kyiv": ("Магазин «Хрещатик»", "Store", "Київ, вул. Хрещатик, 22", True),
    "lviv": ("Магазин «Площа Ринок»", "Store", "Львів, пл. Ринок, 10", True),
    "odesa": ("Магазин «Дерибасівська»", "Store", "Одеса, вул. Дерибасівська, 5", True),
    "lviv-wh": ("Склад Львів", "Warehouse", "Львів, вул. Городоцька, 300", True),
    "podil": ("Магазин «Поділ» (закритий)", "Store", "Київ, вул. Сагайдачного, 1", False),
}
STORES = ["kyiv", "lviv", "odesa"]
loc = {key: gid("location", key) for key in LOCATIONS}


def locations():
    for key, (name, kind, address, active) in LOCATIONS.items():
        insert("administration.Locations", Id=loc[key], Name=name, Type=kind, Address=address, IsActive=active)


# ---------------------------------------------------------------- staff

PERMS = {
    "Касир": ["sales.create", "returns.create"],
    "Адміністратор магазину": ["orders.manage", "sales.create", "sales.discount", "sales.cancel", "shifts.manage",
                               "returns.create", "returns.confirm", "stock.adjust", "transfers.manage",
                               "inventory.count", "inventory.approve", "writeoff.create", "reports.view", "audit.view"],
    "Комірник": ["transfers.manage", "receiving.confirm", "stock.adjust", "inventory.count", "writeoff.create"],
    "Менеджер із закупівель": ["purchasing.manage", "receiving.confirm", "reports.view"],
    "Комерційний відділ": ["catalog.edit", "catalog.price", "promotions.manage", "audit.view"],
    "CRM-маркетолог": ["crm.manage", "promotions.manage"],
    "Керівник мережі": ["reports.view", "reports.chain"],
    "Системний адміністратор": ["users.manage", "locations.manage", "integrations.manage", "audit.view"],
}
USERS = [  # login, role, locations, blocked
    ("cashier.kyiv", "Касир", ["kyiv"], False),
    ("cashier.lviv", "Касир", ["lviv"], False),
    ("cashier.odesa", "Касир", ["odesa"], False),
    ("cashier.former", "Касир", ["kyiv"], True),
    ("admin.kyiv", "Адміністратор магазину", ["kyiv"], False),
    ("admin.lviv", "Адміністратор магазину", ["lviv"], False),
    ("admin.odesa", "Адміністратор магазину", ["odesa"], False),
    ("keeper", "Комірник", ["central", "lviv-wh"], False),
    ("purchasing", "Менеджер із закупівель", list(LOCATIONS), False),
    ("commercial", "Комерційний відділ", [], False),
    ("marketer", "CRM-маркетолог", [], False),
    ("chain.manager", "Керівник мережі", list(LOCATIONS), False),
    ("sysadmin", "Системний адміністратор", list(LOCATIONS), False),
]
user = {login: gid("user", login) for login, *_ in USERS}


def staff():
    for role, perms in PERMS.items():
        insert("administration.Roles", Id=gid("role", role), Name=role, Permissions=json_ids(perms))
    hashed = password_hash(PASSWORD)
    for login, role, places, blocked in USERS:
        insert("administration.Users", Id=user[login], Login=login, PasswordHash=hashed,
               Status="Blocked" if blocked else "Active", Access=json_ids(loc[p] for p in places),
               Roles=json_ids([gid("role", role)]))


# ---------------------------------------------------------------- catalog

CATEGORIES = ["Художня література", "Фантастика", "Дитячі книжки", "Історія", "Бізнес", "Наука", "Поезія", "Канцелярія"]
PUBLISHERS = ["А-ба-ба-га-ла-ма-га", "Видавництво Старого Лева", "Наш Формат", "КСД", "Vivat", "Laurus"]
BOOKS = [  # title, author, publisher, category, price, kind
    ("Кобзар", "Тарас Шевченко", 0, "Поезія", 320, "Book"),
    ("Лісова пісня", "Леся Українка", 1, "Поезія", 210, "Book"),
    ("Тигролови", "Іван Багряний", 1, "Художня література", 280, "Book"),
    ("Місто", "Валер'ян Підмогильний", 1, "Художня література", 260, "Book"),
    ("Інтернат", "Сергій Жадан", 4, "Художня література", 340, "Book"),
    ("Ворошиловград", "Сергій Жадан", 4, "Художня література", 310, "Book"),
    ("Музей покинутих секретів", "Оксана Забужко", 3, "Художня література", 520, "Book"),
    ("Дюна", "Френк Герберт", 3, "Фантастика", 450, "Book"),
    ("Фундація", "Айзек Азімов", 3, "Фантастика", 390, "Book"),
    ("451° за Фаренгейтом", "Рей Бредбері", 3, "Фантастика", 250, "Book"),
    ("Відьмак. Останнє бажання", "Анджей Сапковський", 4, "Фантастика", 360, "Book"),
    ("Гаррі Поттер і філософський камінь", "Джоан Ролінґ", 0, "Дитячі книжки", 420, "Book"),
    ("Мері Поппінс", "Памела Треверс", 0, "Дитячі книжки", 290, "Book"),
    ("Грюффало", "Джулія Дональдсон", 2, "Дитячі книжки", 230, "Book"),
    ("Пеппі Довгапанчоха", "Астрід Ліндґрен", 1, "Дитячі книжки", 270, "Book"),
    ("Брама Європи", "Сергій Плохій", 2, "Історія", 480, "Book"),
    ("Червоний голод", "Енн Епплбом", 2, "Історія", 550, "Book"),
    ("Sapiens. Людина розумна", "Юваль Ной Харарі", 5, "Історія", 470, "Book"),
    ("Атомні звички", "Джеймс Клір", 2, "Бізнес", 360, "Book"),
    ("Від нуля до одиниці", "Пітер Тіль", 2, "Бізнес", 300, "Book"),
    ("Думай повільно, вирішуй швидко", "Деніел Канеман", 2, "Бізнес", 490, "Book"),
    ("Коротка історія часу", "Стівен Гокінг", 5, "Наука", 380, "Book"),
    ("Космос", "Карл Саган", 5, "Наука", 440, "Book"),
    ("Егоїстичний ген", "Річард Докінз", 5, "Наука", 410, "Book"),
    ("Блокнот А5 у клітинку", None, None, "Канцелярія", 85, "Other"),
    ("Закладка магнітна «Кобзар»", None, None, "Канцелярія", 45, "Other"),
    ("Ручка гелева синя", None, None, "Канцелярія", 30, "Other"),
    ("Тіні забутих предків (старе видання)", "Михайло Коцюбинський", 1, "Художня література", 190, "Book"),
]
INACTIVE = {"Тіні забутих предків (старе видання)"}
cat = {name: gid("category", name) for name in CATEGORIES}
pub = [gid("publisher", name) for name in PUBLISHERS]
book = {b[0]: gid("book", b[0]) for b in BOOKS}
price = {b[0]: b[4] for b in BOOKS}
RAISED = {"Дюна": 400, "Кобзар": 290, "Атомні звички": 320}  # earlier price, for the price history


def catalog():
    for name in CATEGORIES:
        insert("catalog.Categories", Id=cat[name], Name=name)
    for i, name in enumerate(PUBLISHERS):
        insert("catalog.Publishers", Id=pub[i], Name=name, IsActive=True)
    authors = sorted({b[1] for b in BOOKS if b[1]})
    for name in authors:
        insert("catalog.Authors", Id=gid("author", name), Name=name, IsActive=True)
    for n, (title, author, publisher, category, amount, kind) in enumerate(BOOKS, start=1):
        insert("catalog.Books", Id=book[title], Title=title, Isbn=isbn13(n) if kind == "Book" else None,
               Barcode=isbn13(n) if kind == "Book" else f"200000{n:06d}", ItemType=kind,
               Status="Deactivated" if title in INACTIVE else "Active",
               PublisherId=pub[publisher] if publisher is not None else None, CategoryId=cat[category],
               Authors=json_ids([gid("author", author)] if author else []), Price_Amount=amount, Price_Currency="UAH")
        prices(title, amount)


def prices(title: str, amount: int):
    if title in RAISED:
        insert("catalog.PriceEntries", Id=gid("price", title, 0), BookId=book[title], ValidFrom=ago(120),
               SetBy=user["commercial"], Price_Amount=RAISED[title], Price_Currency="UAH")
    insert("catalog.PriceEntries", Id=gid("price", title, 1), BookId=book[title],
           ValidFrom=ago(30 if title in RAISED else 120), SetBy=user["commercial"], Price_Amount=amount,
           Price_Currency="UAH")


# ---------------------------------------------------------------- stock

stock: dict[tuple[str, str], dict] = {}  # (location, title) -> {id, on_hand}


def item(place: str, title: str) -> dict:
    return stock[(place, title)]


def movement(place: str, title: str, kind: str, delta: int, doc_type: str, doc: str, at: Raw, by=None, reason=None):
    entry = item(place, title)
    entry["on_hand"] += delta
    entry["n"] += 1
    insert("inventory.StockMovements", Id=gid("movement", place, title, entry["n"]), Type=kind, Delta=delta,
           OccurredAt=at, Reason=reason, By=by, StockItemId=entry["id"], Document_DocumentId=doc,
           Document_Type=doc_type)


def opening_stock():
    for place in ["central", "lviv-wh", *STORES]:
        for title in book:
            if title in INACTIVE and place != "central":
                continue
            if place == "lviv-wh" and rnd.random() < 0.5:
                continue
            quantity = rnd.randint(60, 150) if place in ("central", "lviv-wh") else rnd.randint(8, 25)
            minimum = 0 if place in ("central", "lviv-wh") else 5
            stock[(place, title)] = {"id": gid("stock", place, title), "on_hand": 0, "reserved": 0, "n": 0, "min": minimum}
            movement(place, title, "Receipt", quantity, "GoodsReceipt", gid("opening", place), ago(60))


def save_stock():
    for (place, title), entry in stock.items():
        assert entry["on_hand"] >= entry["reserved"] >= 0, f"{place}/{title}: {entry}"
        insert("inventory.StockItems", Id=entry["id"], LocationId=loc[place], BookId=book[title],
               OnHand=entry["on_hand"], MinimumStock=entry["min"])


def reserve(place: str, title: str, quantity: int, purpose: str, doc: str, status: str, key: str):
    if status == "Active":
        item(place, title)["reserved"] += quantity
    insert("inventory.Reservations", Id=gid("reservation", key, title), Quantity=quantity, Purpose=purpose,
           DocumentId=doc, ExpiresAt=None, Status=status, StockItemId=item(place, title)["id"])


# ---------------------------------------------------------------- customers and promotions

SEGMENTS = {"Студенти": "Знижка на науково-популярне", "Постійні покупці": "Понад 10 покупок за рік",
            "Батьки": "Купують дитячу літературу"}
CUSTOMERS = [  # name, phone, email, tier, segments, bonus
    ("Олена Коваленко", "+380501112233", "olena@example.com", "Gold", ["Постійні покупці"], 640),
    ("Андрій Шевчук", "+380672223344", "andrii@example.com", "Silver", ["Студенти"], 180),
    ("Марія Бондаренко", "+380933334455", None, "Basic", ["Батьки"], 75),
    ("Ігор Мельник", "+380504445566", "igor@example.com", "Basic", [], 0),
    ("Наталія Ткаченко", "+380675556677", "natalia@example.com", "Silver", ["Батьки", "Постійні покупці"], 320),
    ("Дмитро Кравчук", "+380936667788", None, "Basic", ["Студенти"], 40),
    ("Софія Олійник", "+380507778899", "sofia@example.com", "Gold", ["Постійні покупці"], 910),
    ("Тарас Лисенко", "+380678889900", None, "Basic", [], 15),
    ("Юлія Савченко", "+380939990011", "yulia@example.com", "Basic", ["Студенти"], 0),
    ("Віктор Руденко", "+380500001122", "viktor@example.com", "Silver", [], 260),
]
seg = {name: gid("segment", name) for name in SEGMENTS}
customer = [gid("customer", c[0]) for c in CUSTOMERS]


def customers():
    for name, description in SEGMENTS.items():
        insert("crm.Segments", Id=seg[name], Name=name, Description=description)
    for i, (name, phone, email, tier, segments, bonus) in enumerate(CUSTOMERS):
        insert("crm.Customers", Id=customer[i], Tier=tier, Card=f"2900{i + 1:08d}",
               Segments=json_ids(seg[s] for s in segments), Contact_Email=email, Contact_Name=name,
               Contact_Phone=phone)
        account = gid("bonus", i)
        insert("crm.BonusAccounts", Id=account, CustomerId=customer[i], Balance=bonus)
        if bonus:
            insert("crm.BonusTransactions", Id=gid("bonus-tx", i), Kind="Accrual", Points=bonus,
                   SourceDocumentId=gid("bonus-source", i), At=ago(45), BonusAccountId=account)


def promotions():
    def promo(name, percent, start, end, *, category=None, book_=None, segment=None, customer_=None, minimum=1,
              priority=1):
        insert("crm.Promotions", Id=gid("promotion", name), Name=name, DiscountPercent=percent, Priority=priority,
               Condition_BookId=book_, Condition_CategoryId=category, Condition_CustomerId=customer_,
               Condition_MinimumQuantity=minimum, Condition_SegmentId=segment, Period_End=end, Period_Start=start)

    promo("Тиждень дитячої книги", 10, ago(3), ago(-4), category=cat["Дитячі книжки"])
    promo("Студентам — наука", 15, ago(20), ago(-40), category=cat["Наука"], segment=seg["Студенти"], priority=2)
    promo("Дві «Дюни» дешевше", 20, ago(5), ago(-25), book_=book["Дюна"], minimum=2, priority=3)
    promo("Персональна пропозиція для Олени", 25, ago(1), ago(-14), customer_=customer[0], priority=5)
    promo("Осінній розпродаж (завершено)", 30, ago(60), ago(30), category=cat["Художня література"])


def gift_certificates():
    for number, balance in [("GC-1000", 500), ("GC-1001", 1000), ("GC-1002", 0)]:
        insert("sales.GiftCertificates", Id=gid("gift", number), Number=number, Balance_Amount=balance,
               Balance_Currency="UAH")


# ---------------------------------------------------------------- suppliers and integrations

SUPPLIERS = ["Книжкова дистрибуція", "Лев-Логістик", "Формат-Дистриб'юшн", "Канцтовари Плюс (неактивний)"]
supplier = {name: gid("supplier", name) for name in SUPPLIERS}


def suppliers_and_integrations():
    for i, name in enumerate(SUPPLIERS):
        insert("purchasing.Suppliers", Id=supplier[name], Name=name, ContactInfo=f"orders@supplier{i + 1}.example",
               IsActive="неактивний" not in name)
    integrations = [
        ("Payment", "Платіжний термінал", True, "Healthy", None, None, ago(0, 0.2)),
        ("OnlineShop", "Інтернет-магазин", True, "Healthy", None, None, ago(0, 0.1)),
        ("Accounting", "Бухгалтерія (експорт)", True, "Failed", "Timeout while sending day export", ago(0, 3), ago(1)),
        ("Notifications", "Email-сповіщення", False, "Healthy", None, None, None),
    ]
    for kind, name, enabled, status, error, error_at, exchange in integrations:
        insert("administration.Integrations", Id=gid("integration", kind), Kind=kind, Name=name, IsEnabled=enabled,
               Status=status, LastError=error, LastErrorAt=error_at, LastExchangeAt=exchange)


# ---------------------------------------------------------------- sales

sale_ids: dict[str, list[tuple[str, str, list[tuple[str, int, int]], int | None]]] = {s: [] for s in STORES}


def shifts():
    for place in STORES:
        insert("sales.Shifts", Id=gid("shift", place, "old"), LocationId=loc[place], OpenedBy=user[f"admin.{place}"],
               OpenedAt=ago(1, 2), ClosedBy=user[f"admin.{place}"], ClosedAt=ago(0, 14))
        insert("sales.Shifts", Id=gid("shift", place, "today"), LocationId=loc[place],
               OpenedBy=user[f"admin.{place}"], OpenedAt=ago(0, 3), ClosedBy=None, ClosedAt=None)


def sales():
    sellable = [t for t in book if t not in INACTIVE]
    n = 0
    for day in range(29, -1, -1):
        for place in STORES:
            for _ in range(rnd.randint(1, 4)):
                n += 1
                sale(n, place, day, rnd.sample(sellable, rnd.randint(1, 3)))


def sale(n: int, place: str, day: int, titles: list[str]):
    sid = gid("sale", n)
    at = ago(day, rnd.randint(1, 9) if day else 1)
    lines = [(t, rnd.choice([1, 1, 1, 2]), price[t]) for t in titles if item(place, t)["on_hand"] > 3]
    if not lines:
        return
    total = sum(q_ * p for _, q_, p in lines)
    buyer = rnd.randrange(len(customer)) if rnd.random() < 0.4 else None
    insert("sales.Sales", Id=sid, LocationId=loc[place], Cashier=user[f"cashier.{place}"],
           CustomerId=customer[buyer] if buyer is not None else None, IdempotencyKey=f"demo-sale-{n}",
           CompletedAt=at, Status="Completed", Total_Amount=total, Total_Currency="UAH")
    for i, (title, quantity, unit) in enumerate(lines):
        insert("sales.SaleLines", Id=gid("sale-line", n, i), BookId=book[title], Quantity=quantity, SaleId=sid,
               Discount_Source="None", Discount_Amount_Amount=0, Discount_Amount_Currency="UAH",
               UnitPrice_Amount=unit, UnitPrice_Currency="UAH")
        movement(place, title, "Sale", -quantity, "Sale", sid, at)
    cash = rnd.random() < 0.4
    tendered = (total // 100 + 1) * 100 if cash else total
    insert("sales.Payments", Id=gid("payment", n), Method="Cash" if cash else "Card", Status="Captured", SaleId=sid,
           Amount_Amount=total, Amount_Currency="UAH", Change_Amount=tendered - total if cash else 0,
           Change_Currency="UAH")
    sale_ids[place].append((sid, at.text, lines, buyer))


def pending_return():
    sid, _, lines, buyer = sale_ids["kyiv"][-2]
    title, _, unit = lines[0]
    rid = gid("return", "kyiv")
    insert("sales.Returns", Id=rid, SaleId=sid, LocationId=loc["kyiv"],
           CustomerId=customer[buyer] if buyer is not None else None, Reason="Пошкоджена обкладинка",
           Condition="Damaged", Status="Pending", IdempotencyKey="demo-return-1")
    insert("sales.ReturnLines", BookId=book[title], ReturnId=rid, Quantity=1, UnitRefund_Amount=unit,
           UnitRefund_Currency="UAH")


# ---------------------------------------------------------------- online orders

ORDERS = [  # key, customer, status, kind, store, lines
    ("new", 1, "New", "Pickup", "kyiv", [("Дюна", 1), ("Фундація", 1)]),
    ("confirmed", 2, "Confirmed", "Pickup", "lviv", [("Грюффало", 2)]),
    ("picking", 4, "Picking", "Pickup", "kyiv", [("Sapiens. Людина розумна", 1)]),
    ("ready", 0, "Ready", "Pickup", "kyiv", [("Кобзар", 1), ("Блокнот А5 у клітинку", 2)]),
    ("ready-odesa", 6, "Ready", "Pickup", "odesa", [("Атомні звички", 1)]),
    ("delivery", 5, "New", "Delivery", "lviv", [("Космос", 1)]),
    ("issued", 0, "Issued", "Pickup", "kyiv", [("Інтернат", 1)]),
    ("cancelled", 3, "Cancelled", "Pickup", "odesa", [("Місто", 1)]),
    ("b2b", 9, "Confirmed", "Delivery", "kyiv", [("Атомні звички", 5)]),
]
ROUTE = ["New", "Confirmed", "Picking", "Ready", "Issued"]


def orders():
    for key, buyer, status, kind, place, lines in ORDERS:
        oid = gid("order", key)
        insert("orders.Orders", Id=oid, CustomerId=customer[buyer], Type="B2B" if key == "b2b" else "Retail",
               StockLocation=loc[place], PickupCode=gid("pickup", key).replace("-", ""), Status=status,
               Fulfilment_DeliveryAddress="Львів, вул. Зелена, 7, кв. 3" if kind == "Delivery" else None,
               Fulfilment_Kind=kind, Fulfilment_PickupLocation=loc[place] if kind == "Pickup" else None)
        for title, quantity in lines:
            insert("orders.OrderLines", BookId=book[title], OrderId=oid, Quantity=quantity,
                   UnitPrice_Amount=price[title], UnitPrice_Currency="UAH")
            order_stock(key, oid, status, place, title, quantity)
        order_history(key, oid, status, place)


def order_stock(key, oid, status, place, title, quantity):
    if status == "Issued":
        reserve(place, title, quantity, "CustomerOrder", oid, "Fulfilled", key)
        movement(place, title, "OrderIssue", -quantity, "Order", oid, ago(2))
    else:
        reserve(place, title, quantity, "CustomerOrder", oid, "Released" if status == "Cancelled" else "Active", key)


def order_history(key, oid, status, place):
    steps = ["New", "Cancelled"] if status == "Cancelled" else ROUTE[: ROUTE.index(status) + 1]
    for i, (before, after) in enumerate(zip(steps, steps[1:])):
        insert("orders.OrderStatusChanges", Id=gid("order-change", key, i), OrderId=oid, From=before, To=after,
               At=ago(3 - i * 0.5), By=user[f"admin.{place}"])


def cart():
    cid = gid("cart", 0)
    insert("orders.Carts", Id=cid, CustomerId=customer[0])
    for title, quantity in [("Відьмак. Останнє бажання", 1), ("Пеппі Довгапанчоха", 1)]:
        insert("orders.CartLines", BookId=book[title], CartId=cid, Quantity=quantity)


# ---------------------------------------------------------------- transfers

def transfers():
    created = gid("transfer", "created")
    insert("inventory.Transfers", Id=created, Status="Created", ShippedBy=None, ReceivedBy=None,
           Route_From=loc["central"], Route_To=loc["odesa"])
    for title, quantity in [("Дюна", 10), ("Космос", 5)]:
        insert("inventory.TransferLines", BookId=book[title], TransferId=created, Shipped=quantity, Received=None)

    approved = gid("transfer", "approved")
    insert("inventory.Transfers", Id=approved, Status="Approved", ShippedBy=None, ReceivedBy=None,
           Route_From=loc["central"], Route_To=loc["kyiv"])
    insert("inventory.TransferLines", BookId=book["Кобзар"], TransferId=approved, Shipped=15, Received=None)
    reserve("central", "Кобзар", 15, "Transfer", approved, "Active", "transfer-approved")
    transfer_history("approved", approved, ["Created", "Approved"], "keeper")

    shipped = gid("transfer", "shipped")
    insert("inventory.Transfers", Id=shipped, Status="Shipped", ShippedBy=user["keeper"], ReceivedBy=None,
           Route_From=loc["central"], Route_To=loc["lviv"])
    for title, quantity in [("Тигролови", 8), ("Брама Європи", 6)]:
        insert("inventory.TransferLines", BookId=book[title], TransferId=shipped, Shipped=quantity, Received=None)
        reserve("central", title, quantity, "Transfer", shipped, "Fulfilled", "transfer-shipped")
        movement("central", title, "TransferOut", -quantity, "Transfer", shipped, ago(1))
    transfer_history("shipped", shipped, ["Created", "Approved", "Shipped"], "keeper")
    received_with_discrepancy()


def received_with_discrepancy():
    tid = gid("transfer", "received")
    insert("inventory.Transfers", Id=tid, Status="Received", ShippedBy=user["admin.lviv"],
           ReceivedBy=user["admin.odesa"], Route_From=loc["lviv"], Route_To=loc["odesa"])
    insert("inventory.TransferLines", BookId=book["Лісова пісня"], TransferId=tid, Shipped=4, Received=3)
    reserve("lviv", "Лісова пісня", 4, "Transfer", tid, "Fulfilled", "transfer-received")
    movement("lviv", "Лісова пісня", "TransferOut", -4, "Transfer", tid, ago(4))
    movement("odesa", "Лісова пісня", "TransferIn", 3, "Transfer", tid, ago(2))
    insert("inventory.TransferDiscrepancies", Id=gid("discrepancy", "received"), BookId=book["Лісова пісня"],
           Expected=4, Actual=3, IsResolved=False, Reason=None, ResolvedBy=None, ResolvedAt=None, TransferId=tid)
    transfer_history("received", tid, ["Created", "Approved", "Shipped", "Received"], "admin.lviv")


def transfer_history(key, tid, steps, by):
    for i, (before, after) in enumerate(zip(steps, steps[1:])):
        insert("inventory.TransferStatusChanges", Id=gid("transfer-change", key, i), TransferId=tid, From=before,
               To=after, At=ago(5 - i), By=user[by])


# ---------------------------------------------------------------- purchasing

def purchase_orders():
    def po(key, supplier_name, expected_days, status, lines, received=False):
        pid = gid("po", key)
        insert("purchasing.PurchaseOrders", Id=pid, SupplierId=supplier[supplier_name],
               ExpectedDate=ahead_date(expected_days), Status=status, OverdueNotified=False)
        for title, quantity in lines:
            insert("purchasing.PurchaseOrderLines", BookId=book[title], PurchaseOrderId=pid, Ordered=quantity,
                   Received=quantity if received else 0, PurchasePrice_Amount=round(price[title] * 0.6),
                   PurchasePrice_Currency="UAH")
        steps = ["Draft"] + {"Draft": [], "Sent": ["Sent"], "Received": ["Sent", "Received"]}[status]
        for i, (before, after) in enumerate(zip(["Draft", *steps], steps)):
            insert("purchasing.PurchaseOrderStatusChanges", Id=gid("po-change", key, i), PurchaseOrderId=pid,
                   From=before, To=after, At=ago(20 - i * 5), By=user["purchasing"])
        return pid

    po("draft", "Лев-Логістик", 14, "Draft", [("Місто", 20), ("Тигролови", 20)])
    po("sent", "Книжкова дистрибуція", 5, "Sent", [("Дюна", 40), ("Фундація", 30), ("Космос", 15)])
    po("overdue", "Формат-Дистриб'юшн", -3, "Sent", [("Атомні звички", 25), ("Червоний голод", 10)])
    received = po("received", "Книжкова дистрибуція", -10, "Received", [("Гаррі Поттер і філософський камінь", 30)],
                  received=True)
    goods_receipt(received)


def goods_receipt(pid: str):
    rid = gid("receipt", "received")
    insert("purchasing.GoodsReceipts", Id=rid, SupplierId=supplier["Книжкова дистрибуція"], LocationId=loc["central"],
           PurchaseOrderId=pid, IdempotencyKey="demo-receipt-1", IsConfirmed=True, ConfirmedBy=user["keeper"],
           ConfirmedAt=ago(10))
    insert("purchasing.ReceiptLines", BookId=book["Гаррі Поттер і філософський камінь"], GoodsReceiptId=rid,
           Ordered=30, Received=30)
    movement("central", "Гаррі Поттер і філософський камінь", "Receipt", 30, "GoodsReceipt", rid, ago(10))


def missing_books():
    for i, (title, author, place, buyer, demand) in enumerate([
        ("Маруся Чурай", "Ліна Костенко", "kyiv", 0, 3),
        ("Колекціонер", "Джон Фаулз", "lviv", None, 1),
        ("Захар Беркут", "Іван Франко", "odesa", 4, 2),
    ]):
        insert("purchasing.MissingBookRequests", Id=gid("missing", i), Title=title, Author=author, LocationId=loc[place],
               CustomerId=customer[buyer] if buyer is not None else None, Demand=demand, Status="Open",
               RecordedAt=ago(7 - i * 2))


# ---------------------------------------------------------------- inventory count and write-off

def write_off():
    wid = gid("writeoff", "kyiv")
    insert("inventory.WriteOffs", Id=wid, LocationId=loc["kyiv"], Reason="Затоплення підсобки", CreatedBy=user["admin.kyiv"],
           CreatedAt=ago(12))
    insert("inventory.WriteOffLines", BookId=book["Мері Поппінс"], WriteOffId=wid, Quantity=2)
    movement("kyiv", "Мері Поппінс", "WriteOff", -2, "WriteOff", wid, ago(12), by=user["admin.kyiv"])


def inventory_count():
    cid = gid("count", "odesa")
    insert("inventory.InventoryCounts", Id=cid, LocationId=loc["odesa"], Status="Open", StartedAt=ago(0, 2))
    for title in ["Кобзар", "Дюна", "Грюффало", "Космос", "Ручка гелева синя"]:
        insert("inventory.CountLines", BookId=book[title], InventoryCountId=cid,
               Expected=item("odesa", title)["on_hand"], Counted=None)


# ---------------------------------------------------------------- script

def main():
    locations()
    staff()
    catalog()
    opening_stock()
    customers()
    promotions()
    gift_certificates()
    suppliers_and_integrations()
    shifts()
    sales()
    pending_return()
    write_off()
    purchase_orders()
    missing_books()
    transfers()
    orders()
    cart()
    inventory_count()  # after every movement, so the expected quantities match the stock
    save_stock()
    rows = sql + after_stock
    OUT.write_text(HEADER + "\n".join(rows) + FOOTER, encoding="utf-8")
    print(f"{OUT.name}: {len(rows)} rows")


HEADER = f"""-- Demo data for «Полиця». Generated by generate_demo_data.py; edit the generator, not this file.
-- Apply to a migrated, otherwise empty database. Every staff login has password "{PASSWORD}".
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;  -- sqlcmd turns it off by default; filtered unique indexes need it
IF EXISTS (SELECT 1 FROM catalog.Books)
BEGIN
    RAISERROR('The database already has a catalog; demo data is loaded only into an empty one.', 16, 1);
    RETURN;
END;
DECLARE @now datetimeoffset = SYSDATETIMEOFFSET();
BEGIN TRANSACTION;
"""
FOOTER = "\nCOMMIT TRANSACTION;\n"

if __name__ == "__main__":
    main()
