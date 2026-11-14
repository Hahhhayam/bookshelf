# Bookshelf

## Clever Cache (TODO)

**TL;DR:** a separate service keeps the cache fresh instead of the request path. It serves the old value while it builds the new one, so requests never hit the database in a burst on a miss. TTL entries are refreshed ahead of expiry only if they had 200 or more requests in the previous lifetime.

Not part of the MVP. Today the catalog cache is plain: entries are filled on a miss, removed on `PriceChanged`, and expire on a fixed TTL. The design below replaces it if load requires it.

### Separate cache-keeper service

Keeping the cache fresh is the job of a separate service, not of the request path. It covers both ways an entry can become outdated:

- **Manual invalidation** (a domain event such as `PriceChanged`).
- **TTL expiry.**

Requests only read from the cache. They never rebuild an entry themselves, so a missing or expired entry cannot send a burst of identical queries to the database.

### Serving stale data while refreshing

When an entry is close to expiry or has been invalidated, the service keeps returning the old value. It calculates or requests the new instance in the background and swaps it in when ready. Readers see the previous value until then, and there is no gap in which the entry is absent.

### TTL refresh only for entries that are used

Refreshing every entry before it expires wastes work on entries nobody reads. For TTL-based entries the service tracks hits per entry over the previous cache lifetime:

- Fewer than **200** requests in the previous lifetime (the threshold should be configurable): the entry is allowed to expire and is not refreshed.
- 200 or more: the TTL is extended by refreshing the entry before it expires.

Manually invalidated entries are refreshed regardless of this rule, because their data is known to have changed.

### Prerequisites

- A general mechanism for eventually consistent jobs (a job scheduler), with one running instance per job key and a reference to the first job when a duplicate is requested.
