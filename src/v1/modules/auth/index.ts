import { AxiosService, MailerService } from '../../utils'
import {
  GoogleAuthService,
  AuthService,
  AuthTokenService,
  VerificationService,
  WhatsappService,
} from './service'

import { VerificationCRUD } from './crud'

import { Verification } from './models'
import { roleService, userService } from '../user'

const axiosService = AxiosService.getInstance()
const googleAuthService = GoogleAuthService.getInstance(axiosService)
const mailerService = MailerService.getInstance()

const verificationCRUD = VerificationCRUD.getInstance(Verification)

const authTokenService = AuthTokenService.getInstance()
const verificationService = VerificationService.getInstance(verificationCRUD)
const whatsappService = WhatsappService.getInstance(axiosService)

const authService = AuthService.getInstance(
  userService,
  googleAuthService,
  roleService,
  mailerService,
  whatsappService,
  verificationService,
  authTokenService
)

export { authService, googleAuthService, authTokenService }
