export { referenceApi } from './api/referenceApi'
export { referenceKeys, referenceName, useReferenceList, useRefreshReference } from './model/queries'
export type {
  Author, Category, Integration, IntegrationKind, Location, Promotion, Publisher, ReferenceKind, Role, Segment,
  Supplier, User,
} from './model/types'
export { integrationKindLabel, integrationKinds, locationTypeLabel, locationTypes } from './model/labels'
export {
  locationNames, useKnownLocations, userInitials, userNames, type KnownLocation, type OwnLocation, type Self,
} from './model/names'
export { toOptions } from './model/options'
export { useCreateReference, type CatalogReferenceKind } from './model/useCreateReference'
export { LocationSelect } from './ui/LocationSelect'
