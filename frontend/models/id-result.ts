// Generic result returned by write operations that only produce an id
// and a message (e.g. register, profile update).
export interface IdResult {
  id: string
  message: string
}
