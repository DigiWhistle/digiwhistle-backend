import { HttpException } from '../../../../utils'
import {
  IAuthService,
  IGoogleAuthService,
  IWhatsappService,
  IVerificationService,
  IAuthTokenService,
} from '../interface'
import {
  authRequest,
  loginRequest,
  loginResponse,
  mobileRequest,
  resetPassRequest,
  signUpResponse,
  userResponse,
  verifyMobileRequest,
} from '../types'
import { IMailerService } from '../../../utils'
import OTPgenerator from 'otp-generator'
import { IUserService, IRoleService } from '../../user/interface'

class AuthService implements IAuthService {
  private readonly userService: IUserService
  private readonly googleAuthService: IGoogleAuthService
  private readonly roleService: IRoleService
  private readonly mailerService: IMailerService
  private readonly whatsappService: IWhatsappService
  private readonly verificationService: IVerificationService
  private readonly authTokenService: IAuthTokenService
  private static instance: IAuthService | null = null

  static getInstance(
    userService: IUserService,
    googleAuthService: IGoogleAuthService,
    roleService: IRoleService,
    mailerService: IMailerService,
    whatsappService: IWhatsappService,
    verificationService: IVerificationService,
    authTokenService: IAuthTokenService
  ): IAuthService {
    if (AuthService.instance === null) {
      AuthService.instance = new AuthService(
        userService,
        googleAuthService,
        roleService,
        mailerService,
        whatsappService,
        verificationService,
        authTokenService
      )
    }
    return AuthService.instance
  }

  private constructor(
    userService: IUserService,
    googleAuthService: IGoogleAuthService,
    roleService: IRoleService,
    mailerService: IMailerService,
    whatsappService: IWhatsappService,
    verificationService: IVerificationService,
    authTokenService: IAuthTokenService
  ) {
    this.userService = userService
    this.googleAuthService = googleAuthService
    this.roleService = roleService
    this.mailerService = mailerService
    this.whatsappService = whatsappService
    this.verificationService = verificationService
    this.authTokenService = authTokenService
  }

  async signUp(signUpData: authRequest): Promise<signUpResponse> {
    try {
      const { idToken, role } = signUpData

      const user = await this.googleAuthService.verifyIdToken(idToken)

      const userExists = await this.userService.findOne(
        {
          id: user.uid,
        },
        []
      )

      if (userExists !== null) {
        if (userExists.isVerified === false)
          throw new HttpException(400, 'Waiting for Approval')

        throw new HttpException(400, 'User Already Exists')
      }

      const _role = await this.roleService.findOne({ name: role }, [])

      if (_role === null) throw new HttpException(400, 'Invalid Role')

      await this.userService.add({
        id: user.uid,
        email: user.email,
        role: {
          id: _role.id,
        },
      })

      return {
        id: user.uid,
        email: user.email,
        role: _role.name,
        isVerified: false,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async logIn(loginData: loginRequest): Promise<loginResponse> {
    try {
      const { idToken } = loginData

      const user = await this.googleAuthService.verifyIdToken(idToken)

      const _user = await this.userService.findOne(
        {
          id: user.uid,
        },
        [
          'adminProfile',
          'employeeProfile',
          'influencerProfile',
          'brandProfile',
          'agencyProfile',
          'role',
        ]
      )

      if (_user === null) throw new HttpException(404, 'user does not exist')

      const token = this.authTokenService.generateToken(_user.id)

      const profile = _user[`${_user.role.name}Profile`]
      let isOnboardingDone = profile === null ? false : true

      if (_user.isVerified === false && isOnboardingDone === true)
        throw new HttpException(400, 'Waiting for Approval')

      const _userResponse: userResponse = {
        id: _user.id,
        email: _user.email,
        isVerified: _user.isVerified,
        profile: profile,
        role: _user.role.name,
        isPaused: _user.isPaused,
        isOnBoarded: isOnboardingDone,
      }

      return {
        token: token,
        user: _userResponse,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async emailResetPasswordLink(email: string): Promise<void> {
    try {
      const user = await this.userService.findOne({ email: email }, [])

      if (user === null) throw new HttpException(404, 'user does not exist')

      const link = await this.googleAuthService.generateResetLink(email)
      const emailMessage = `<p>Dear User,</p><p> Follow this link to reset your password: ${link}</p><p>Regards,<br>Team Digiwhistle</p>`
      this.mailerService
        .sendMail(email, 'Reset Password Link', emailMessage)
        .then(() => {
          console.log('mail sent successfully!!')
        })
        .catch((e) => {
          console.log(`Error sending mail: ${e}`)
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async resetPassword(resetPassData: resetPassRequest): Promise<void> {
    try {
      await this.googleAuthService.resetPassword(
        resetPassData.password,
        resetPassData.oobCode
      )
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async sendMobileOTP(mobileData: mobileRequest): Promise<void> {
    try {
      const { mobileNo } = mobileData

      const user = await this.userService.findUserByMobileNo(mobileNo)

      if (user === null) throw new HttpException(404, 'user does not exists')

      const code: string = OTPgenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })

      const presentTime = new Date().getTime()

      await this.verificationService.createOrUpdate({
        mobileNo: mobileNo,
        otp: code,
        expireIn: presentTime + 600000,
      })

      this.whatsappService
        .sendMessage(mobileNo, code)
        .then(() => {
          console.log('message sent')
        })
        .catch((e) => {
          console.log(e)
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async verifyMobileOTP(
    verifyMobileData: verifyMobileRequest
  ): Promise<loginResponse> {
    try {
      const { mobileNo, otp } = verifyMobileData

      const existingOTP = await this.verificationService.findOne(
        {
          mobileNo: mobileNo,
        },
        []
      )

      const presentTime = new Date().getTime()

      if (existingOTP === null) throw new HttpException(404, 'Invalid PhoneNo')
      else {
        if (existingOTP.expireIn < presentTime)
          throw new HttpException(400, 'OTP has expired')
        if (existingOTP.otp !== otp) throw new HttpException(400, 'Invalid OTP')
      }

      const user = await this.userService.findUserByMobileNo(mobileNo)

      if (user === null) throw new HttpException(404, 'user does not exist')

      const token = this.authTokenService.generateToken(user.id)

      const profile = user[`${user.role.name}Profile`]
      let isOnboardingDone = profile === null ? false : true

      if (user.isVerified === false && isOnboardingDone === true)
        throw new HttpException(400, 'Waiting for Approval!!')

      const _userResponse: userResponse = {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        isPaused: user.isPaused,
        profile: profile,
        role: user.role.name,
        isOnBoarded: isOnboardingDone,
      }

      return {
        token: token,
        user: _userResponse,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { AuthService }
