import { tokenBuilder } from '@/shared/util/token-builder'
import { type UserInfo } from '@base/core/models'
import { type FastifyReply } from 'fastify'

type CookieOptions = {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict'
  maxAge: number
  path: string
}

type FastifyReplyWithCookie = FastifyReply & {
  setCookie: (name: string, value: string, options: CookieOptions) => FastifyReply
}

export const setAccessTokenCookie = (reply: FastifyReply, userInfo: UserInfo) => {
  const accessToken = tokenBuilder({
    tokenType: 'access',
    userInfo,
  })

    ; (reply as FastifyReplyWithCookie).setCookie('accessToken', accessToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessToken.expTokenSeconds,
      path: '/',
    })
}

export const setRefreshTokenCookie = (reply: FastifyReply, userInfo: UserInfo) => {
  const refreshToken = tokenBuilder({
    tokenType: 'refresh',
    userInfo,
  })

    ; (reply as FastifyReplyWithCookie).setCookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshToken.expTokenSeconds,
      path: '/',
    })
}

export const setAuthCookies = (reply: FastifyReply, userInfo: UserInfo) => {
  setAccessTokenCookie(reply, userInfo)
  setRefreshTokenCookie(reply, userInfo)
}
