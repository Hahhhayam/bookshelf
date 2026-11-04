# Code conventions

- One type per file (class, record, struct, enum, interface), file named after the type. Exception: a command or query record may share a file with the use case that executes it.
- Comments only add context that the name or behavior cannot show (a business rule, a non-obvious reason, an external requirement). If the code is self-explanatory, no comment.
- Keep methods short. A method over ~20 lines should be decomposed into private submethods.
- EF Core mapping lives only in `Infrastructure`: conventions in `DomainConventions`, everything else in one `IEntityTypeConfiguration` per entity (value objects: one static `*Mapping` per type). No attributes or EF types in `Domain`.
