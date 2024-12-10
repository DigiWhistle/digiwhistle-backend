import { firebase } from '../../../../config'
import { HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import { IGoogleAuthService } from '../interface'
import { firebaseUser } from '../types'

class GoogleAuthService implements IGoogleAuthService {
  private readonly axiosService: IAxiosService
  private static instance: IGoogleAuthService | null = null

  static getInstance(axiosService: IAxiosService): IGoogleAuthService {
    if (GoogleAuthService.instance === null) {
      GoogleAuthService.instance = new GoogleAuthService(axiosService)
    }
    return GoogleAuthService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await firebase.auth().deleteUser(uid)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async createUser(email: string): Promise<firebaseUser> {
    try {
      const user = await firebase.auth().createUser({
        email: email,
        password: 'digiwhistle@123',
        emailVerified: true,
      })

      return {
        email: email,
        uid: user.uid,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e.message)
    }
  }

  async verifyIdToken(idToken: string): Promise<firebaseUser> {
    try {
      const user = await firebase.auth().verifyIdToken(idToken)

      if (user?.email === undefined)
        throw new HttpException(404, 'emailId not found')

      return {
        email: user.email,
        uid: user.uid,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async generateResetLink(email: string): Promise<string> {
    try {
      const link = await firebase.auth().generatePasswordResetLink(email)
      const linkParams = link.split('?')
      const code = linkParams[1].split('&')
      const oobCode = code[1].split('=')[1]

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?oobCode=${oobCode}`
      return resetLink
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async resetPassword(password: string, oobCode: string): Promise<void> {
    try {
      await this.axiosService.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          oobCode: oobCode,
          newPassword: password,
        },
        undefined
      )
    } catch (e) {
      throw new HttpException(e?.data?.error?.code, e?.data?.error?.message)
    }
  }
}

export { GoogleAuthService }
