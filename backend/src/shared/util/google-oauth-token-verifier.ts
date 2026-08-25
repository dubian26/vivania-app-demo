import { OauthTokenPayload, OauthTokenVerifier } from '@/base/contracts/oauth-token-verifier'
import { BaseError } from '@/base/errors/base-error'
import { Injectable } from '@/base/util/injectable'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class GoogleOauthTokenVerifier implements OauthTokenVerifier {
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  async verify(token: string): Promise<OauthTokenPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email)
      throw BaseError.GoogleTokenInvalido()

    return {
      email: payload.email,
      givenName: payload.given_name,
      familyName: payload.family_name,
    }
  }
}
