import { type UserInfo } from '@/shared/models/user-info'
import jwt from 'jsonwebtoken'
import ms from 'ms'

type TokenType = 'access' | 'refresh'

interface Props {
  tokenType: TokenType
  userInfo: UserInfo
}

const parseDurationMs = (value: string): number | null => {
  const parsed = ms(value as ms.StringValue)

  return (typeof parsed !== 'number' || Number.isNaN(parsed) || parsed <= 0)
    ? null
    : parsed
}

const getExpByTokenType = (
  tokenType: TokenType,
  expAccessToken: string,
  expRefreshToken: string,
) => tokenType === 'access'
  ? expAccessToken
  : expRefreshToken

export const tokenBuilder = ({ tokenType, userInfo }: Props) => {
  const jwtSecret = process.env.JWT_SECRET || ''
  const jwtEmisor = process.env.JWT_EMISOR || ''
  const expAccessToken = process.env.EXP_ACCESS_TOKEN || '15m'
  const expRefreshToken = process.env.EXP_REFRESH_TOKEN || '2d'

  const expToken = getExpByTokenType(tokenType, expAccessToken, expRefreshToken)
  const expTokenMs = parseDurationMs(expToken)

  if (expTokenMs === null) {
    throw new Error('EXP_ACCESS_TOKEN o EXP_REFRESH_TOKEN tiene una duración inválida')
  }

  const expTokenSeconds = Math.floor(expTokenMs / 1000)

  const token = jwt.sign(userInfo, jwtSecret, {
    expiresIn: expTokenSeconds,
    issuer: jwtEmisor,
  })

  return { token, expTokenMs, expTokenSeconds }
}
