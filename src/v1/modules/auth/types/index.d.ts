import { IAdminProfile, IEmployeeProfile } from '../../admin/interface'
import { IBrandProfile } from '../../brands/interface'
import { IInfluencerProfile } from '../../influencer/interface'
import { IAgencyProfile } from '../../agency/interface'

export type authRequest = {
  idToken: string
  role: string
}

export type loginRequest = {
  idToken: string
}

export type firebaseUser = {
  email: string
  uid: string
}

export type resetPassRequest = {
  oobCode: string
  password: string
}

export type loginResponse = {
  token: string
  user: userResponse
}

export type signUpResponse = {
  id: string
  email: string
  role: string
  isVerified: boolean
}

export type mobileRequest = {
  mobileNo: string
}

export type verifyMobileRequest = {
  mobileNo: string
  otp: string
}

export type userResponse = {
  id: string
  email: string
  role: string
  isVerified: boolean
  isPaused: boolean
  profile:
    | IAdminProfile
    | IEmployeeProfile
    | IAgencyProfile
    | IBrandProfile
    | IInfluencerProfile
  isOnBoarded?: boolean
}
