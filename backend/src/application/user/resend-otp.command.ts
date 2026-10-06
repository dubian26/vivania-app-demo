import { Command } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { ResendOtpHandler } from './resend-otp.handler'

export interface ResendOtpDTO {
  email: string
  purpose: 'REGISTRO' | 'RECUPERACION' | 'ALTA_ADMIN'
}

export class ResendOtpCommand extends Command<{ message: string }> {
  readonly handlerType = ResendOtpHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: ResendOtpDTO) {
    super()
  }
}
