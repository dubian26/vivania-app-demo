import { ResendOtpDTO } from './resend-otp.dto'

export abstract class ResendOtpValidator {
  abstract validate(input: ResendOtpDTO): void
}
