import { SearchRolesDTO } from './search-roles.dto'

export abstract class SearchRolesValidator {
  abstract validate(input: SearchRolesDTO): void
}
