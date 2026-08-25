export interface OauthTokenPayload {
  email: string
  givenName?: string
  familyName?: string
}

export abstract class OauthTokenVerifier {
  abstract verify(token: string): Promise<OauthTokenPayload>
}
