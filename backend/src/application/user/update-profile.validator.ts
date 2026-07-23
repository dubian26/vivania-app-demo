import { UpdateProfileDTO } from './update-profile.dto'

export abstract class UpdateProfileValidator {
  abstract validate(input: UpdateProfileDTO): void
}
