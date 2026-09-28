// src/config/modules.ts
// Set any module to false to hide it from the admin nav.
// Hiding does NOT delete the routes — also remove the corresponding
// src/app/admin/<module>/ and src/app/api/<module>/ directories manually.

export const modules = {
  tours:         true,
  visas:         true,
  attestations:  true,
  blog:          true,
  destinations:  true,
  inquiries:     true,
  masters:       true,
} as const

export type ModuleKey = keyof typeof modules
