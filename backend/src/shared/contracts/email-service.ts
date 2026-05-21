export abstract class EmailService {
  abstract send(to: string, subject: string, html: string): Promise<void>
}
