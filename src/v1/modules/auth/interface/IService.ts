import { IBaseService } from '../../../../utils'
import {
  authRequest,
  loginRequest,
  loginResponse,
  mobileRequest,
  resetPassRequest,
  signUpResponse,
  firebaseUser,
  verifyMobileRequest,
} from '../types'
import { IVerification } from './IModels'
import { IVerificationCRUD } from './ICRUD'

export interface IVerificationService
  extends IBaseService<IVerification, IVerificationCRUD> {
  createOrUpdate(data: Partial<IVerification>): Promise<void>
}

export interface IAuthService {
  signUp(signUpData: authRequest): Promise<signUpResponse>
  logIn(logInData: loginRequest): Promise<loginResponse>
  emailResetPasswordLink(email: string): Promise<void>
  resetPassword(resetPassData: resetPassRequest): Promise<void>
  verifyMobileOTP(verifyMobileData: verifyMobileRequest): Promise<loginResponse>
  sendMobileOTP(mobileData: mobileRequest): Promise<void>
}

export interface IGoogleAuthService {
  createUser(email: string): Promise<firebaseUser>
  deleteUser(uid: string): Promise<void>
  verifyIdToken(idToken: string): Promise<firebaseUser>
  generateResetLink(email: string): Promise<string>
  resetPassword(password: string, oobCode: string): Promise<void>
}

export interface IWhatsappService {
  sendMessage(destination: string | string[], message: string): Promise<void>
}

export interface IAuthTokenService {
  generateToken(userId: string): string
  decodeToken(token: string): string
}
