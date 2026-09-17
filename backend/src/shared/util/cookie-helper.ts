import { tokenBuilder } from '@/shared/util/token-builder'
import { type UserInfo } from '@/base/models/user-info'
import { type FastifyReply } from 'fastify'

type CookieOptions = {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict'
  maxAge?: number
  path: string
}

type FastifyReplyWithCookie = FastifyReply & {
  setCookie: (name: string, value: string, options: CookieOptions) => FastifyReply
  clearCookie: (name: string, options?: CookieOptions) => FastifyReply
}

// Atributos compartidos entre set y clear: el navegador solo elimina
// la cookie si el path coincide con el de creación.
const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
})

export const setAccessTokenCookie = (reply: FastifyReply, userInfo: UserInfo) => {
  const accessToken = tokenBuilder({
    tokenType: 'access',
    userInfo,
  })

    ; (reply as FastifyReplyWithCookie).setCookie('accessToken', accessToken.token, {
      ...baseCookieOptions(),
      maxAge: accessToken.expTokenSeconds,
    })
}

export const setRefreshTokenCookie = (reply: FastifyReply, userInfo: UserInfo) => {
  const refreshToken = tokenBuilder({
    tokenType: 'refresh',
    userInfo,
  })

    ; (reply as FastifyReplyWithCookie).setCookie('refreshToken', refreshToken.token, {
      ...baseCookieOptions(),
      maxAge: refreshToken.expTokenSeconds,
    })
}

export const setAuthCookies = (reply: FastifyReply, userInfo: UserInfo) => {
  setAccessTokenCookie(reply, userInfo)
  setRefreshTokenCookie(reply, userInfo)
}

export const clearAuthCookies = (reply: FastifyReply) => {
  const options = baseCookieOptions()
  const replyWithCookie = reply as FastifyReplyWithCookie

  replyWithCookie.clearCookie('accessToken', options)
  replyWithCookie.clearCookie('refreshToken', options)
}
