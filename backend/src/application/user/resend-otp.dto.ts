export interface ResendOtpDTO {
  email: string
  purpose: 'REGISTRO' | 'RECUPERACION'
}
