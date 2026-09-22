// Standard offset pagination with an optional text filter, shared by the
// search endpoints (mirrors the backend's SearchModel).
export interface SearchModel {
  skip: number
  take: number
  search?: string
}

// URL query params consumed by list pages through the Next.js searchParams
// prop: text filter + current page (raw strings before normalization).
export interface SearchParams {
  search?: string
  page?: string
}
