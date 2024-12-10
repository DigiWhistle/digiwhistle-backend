import { type Request, type Response } from 'express'
import { errorHandler, HttpException } from '../../utils'
import { Enum } from '../../constants'
import { responseHandler } from '../../utils/response-handler'
import { IAuthService } from '../modules/auth/interface'

export class AuthController {
  private readonly authService: IAuthService

  constructor(authService: IAuthService) {
    this.authService = authService
  }

  async signUpController(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.authService.signUp(req.body)

      return responseHandler(
        Enum.RESPONSE_CODES.CREATED,
        res,
        'Request Submitted Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async logInController(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.authService.logIn(req.body)

      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Log in Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async sendResetPasswordEmailController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      await this.authService.emailResetPasswordLink(req.body.email)

      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Email Sent Successfully',
        {},
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async resetPasswordController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      await this.authService.resetPassword(req.body)

      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Password Updated Successfully',
        {},
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async sendMobileOTPController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      await this.authService.sendMobileOTP(req.body)

      return responseHandler(200, res, 'OTP sent successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async verifyMobileOTPController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const data = await this.authService.verifyMobileOTP(req.body)
      return responseHandler(200, res, 'OTP verified successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
