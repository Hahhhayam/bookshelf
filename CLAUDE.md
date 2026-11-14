# Code conventions

- One type per file (class, record, struct, enum, interface), file named after the type. Exceptions: a command or query record may share a file with the use case that executes it, an HTTP request record may share a file with the endpoint group that uses it, and a typed ID (e.g. `BookId`) sits at the top of its entity's file.
- Comments only add context that the name or behavior cannot show (a business rule, a non-obvious reason, an external requirement). If the code is self-explanatory, no comment.
- Keep methods short. A method over ~20 lines should be decomposed into private submethods.
- EF Core mapping lives only in `Infrastructure`: conventions in `DomainConventions`, everything else in one `IEntityTypeConfiguration` per entity (value objects: one static `*Mapping` per type). No attributes or EF types in `Domain`.
