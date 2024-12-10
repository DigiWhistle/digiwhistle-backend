import { type ObjectLiteral } from 'typeorm'
import { IUser } from '../../user/interface'

export interface IBrandProfile extends ObjectLiteral {
  id: string
  pocFirstName: string
  pocLastName: string
  name: string
  websiteURL: string
  user: IUser
  mobileNo: string
  profilePic: string | null
  aadharNo: string
  gstNo: string
  panNo: string
  msmeNo: string
  address: string
  city: string
  state: string
  pincode: string
  createdAt?: Date
  updatedAt?: Date
}
