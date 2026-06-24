import { SearchUsersDTO } from './search-users.dto'

export abstract class SearchUsersValidator {
  abstract validate(input: SearchUsersDTO): void
}
