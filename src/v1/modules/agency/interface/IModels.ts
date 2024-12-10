import { type ObjectLiteral } from 'typeorm'
import { IUser } from '../../user/interface'

export interface IAgencyProfile extends ObjectLiteral {
  id: string
  pocFirstName: string
  pocLastName: string
  name: string
  websiteURL: string
  profilePic: string | null
  user: IUser
  mobileNo: string
  aadharNo: string
  panNo: string
  gstNo: string
  msmeNo: string
  bankName: string
  bankAccountNumber: string
  bankIfscCode: string
  bankAccountHolderName: string
  address: string
  city: string
  state: string
  pincode: string
  fundAccountId: string | null
  agreement: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface ISearchCredits extends ObjectLiteral {
  id: string
  agency: IAgencyProfile
  credits: number
  lastUpdatedAt: Date
  createdAt?: Date
  updatedAt?: Date
}
