import jwt from 'jsonwebtoken'
import { IAuthTokenService } from '../interface'

interface DecodedPayload extends jwt.JwtPayload {
  id: string
}

class AuthTokenService implements IAuthTokenService {
  private static instance: IAuthTokenService | null = null

  static getInstance() {
    if (AuthTokenService.instance === null) {
      AuthTokenService.instance = new AuthTokenService()
    }
    return AuthTokenService.instance
  }

  private constructor() {}

  generateToken(userId: string): string {
    const token = jwt.sign({ id: userId }, process.env.SECRET ?? '', {
      expiresIn: '10y',
    })
    return token
  }

  decodeToken(token: string): string {
    const decodeToken = jwt.verify(
      token,
      process.env.SECRET ?? ''
    ) as DecodedPayload

    return decodeToken.id
  }
}

export { AuthTokenService }
