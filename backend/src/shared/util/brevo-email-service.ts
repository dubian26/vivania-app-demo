import { EmailService } from '@/base/contracts/email-service'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class BrevoEmailService implements EmailService {
  async send(to: string, subject: string, html: string): Promise<void> {
    // Extraemos el OTP del HTML para el log de la demo
    const otpMatch = html.match(/<b>(\d{6})<\/b>/)
    const otp = otpMatch ? otpMatch[1] : 'N/A'

    console.log('-----------------------------------------')
    console.log(`[ENVÍO EMAIL] Destinatario: ${to}`)
    console.log(`[ENVÍO EMAIL] OTP: ${otp}`)
    console.log('-----------------------------------------')

    try {
      const apiKey = process.env.BREVO_API_KEY
      const senderEmail = process.env.EMAIL_USER // Tu Gmail verificado en Brevo

      if (!apiKey || !senderEmail) {
        console.warn('[WARN] BREVO_API_KEY o EMAIL_USER no configurados. Saltando envío real.')
        return
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Tienda Online Demo',
            email: senderEmail
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        })
      })

      if (response.ok) {
        console.log(`[SUCCESS] Email enviado vía API de Brevo a: ${to}`)
      } else {
        const errorData: unknown = await response.json()
        console.error('[ERROR] Error de Brevo API:', JSON.stringify(errorData))
      }
    } catch (error) {
      console.error('Error enviando email vía API:', error)
    }
  }
}
