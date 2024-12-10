import Router from 'express'
import { AuthController } from '../controller'
import { authService } from '../modules/auth'
import { BaseValidator } from '../../utils'
import {
  resetPasswordSchema,
  resetPasswordEmailSchema,
  authSchema,
  mobileOTPSchema,
  verifyMobileOTPSchema,
} from '../modules/auth/validators'

const authRouter = Router()

const authController = new AuthController(authService)
const authValidators = new BaseValidator(authSchema)
const resetPasswordValidators = new BaseValidator(resetPasswordSchema)
const resetPasswordEmailValidators = new BaseValidator(resetPasswordEmailSchema)
const mobileOTPValidator = new BaseValidator(mobileOTPSchema)
const verifyMobileOTPValidator = new BaseValidator(verifyMobileOTPSchema)

authRouter.post(
  '/signup',
  authValidators.validateInput.bind(authValidators),
  authController.signUpController.bind(authController)
)

authRouter.post(
  '/login',
  authValidators.validateInput.bind(authValidators),
  authController.logInController.bind(authController)
)

authRouter.post(
  '/reset/password',
  resetPasswordValidators.validateInput.bind(resetPasswordValidators),
  authController.resetPasswordController.bind(authController)
)

authRouter.post(
  '/reset/password/request',
  resetPasswordEmailValidators.validateInput.bind(resetPasswordEmailValidators),
  authController.sendResetPasswordEmailController.bind(authController)
)

authRouter.post(
  '/otp',
  mobileOTPValidator.validateInput.bind(mobileOTPValidator),
  authController.sendMobileOTPController.bind(authController)
)

authRouter.post(
  '/otp/verify',
  verifyMobileOTPValidator.validateInput.bind(verifyMobileOTPValidator),
  authController.verifyMobileOTPController.bind(authController)
)

export default authRouter
