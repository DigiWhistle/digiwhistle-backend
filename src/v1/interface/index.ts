import { Request } from 'express'
import { IUser } from '../modules/user/interface'

export interface IExtendedRequest extends Request {
  user: IUser
}
