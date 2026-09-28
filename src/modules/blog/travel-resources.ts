// Canonical Travel-Resources taxonomy (the section formerly called "Blog").
// Stored on BlogPost.category. The admin UI offers these as a dropdown; free
// text remains permitted for forward-compatibility, so treat this as the
// recommended set, not a hard enum.
export const RESOURCE_CATEGORIES = [
  "Destination Guides",
  "Travel Tips",
  "Visa Updates",
  "Travel News",
  "Government Advisories",
  "Packing Guides",
  "Itineraries",
  "Budget Travel",
  "Luxury Travel",
  "Family Travel",
  "Honeymoon Ideas",
  "Festival Guides",
  "Airport Guides",
  "Airline Information",
  "Health Advisories",
  "Travel Checklists",
  "Seasonal Travel Guides",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

/** True when `value` is one of the canonical resource categories. */
export function isResourceCategory(value: string): value is ResourceCategory {
  return (RESOURCE_CATEGORIES as readonly string[]).includes(value);
}
