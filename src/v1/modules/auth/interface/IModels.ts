import { ObjectLiteral } from 'typeorm'

export interface IVerification extends ObjectLiteral {
  mobileNo: string
  otp: string
  expireIn: number
  id: string
}
