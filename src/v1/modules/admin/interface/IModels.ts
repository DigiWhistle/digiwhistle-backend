import { type ObjectLiteral } from 'typeorm'
import { IUser } from '../../user/interface'

export interface IAdminProfile extends ObjectLiteral {
  id: string
  firstName: string
  lastName: string
  mobileNo: string
  user: IUser
  profilePic: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IEmployeeProfile extends ObjectLiteral {
  id: string
  firstName: string
  lastName: string
  mobileNo: string
  user: IUser
  profilePic: string
  designation: string
  aadharNo: string
  panNo: string
  bankName: string
  bankAccountNumber: string
  bankIfscCode: string
  bankAccountHolderName: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IRemarks extends ObjectLiteral {
  id: string
  message: string
  userId: string
  remarker: IUser
  createdAt: Date
  updatedAt: Date
}
