import { DeepPartial } from 'typeorm'
import { Enum } from '../../../../constants'
import { ICRUDBase } from '../../../../utils'
import { IBaseService } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IEmployeeProfile } from '../../admin/interface'
import { IUser } from '../../user/interface'

export interface IContactUsForm {
  id: number
  name: string
  email: string
  followersCount?: string | null
  profileLink?: string | null
  mobileNo?: string | null
  message?: string | null
  personType: Enum.PersonType
  viewed: boolean
}

export interface IContactUsFormCRUD extends ICRUDBase<IContactUsForm> {}

export interface IContactUsService
  extends IBaseService<IContactUsForm, IContactUsFormCRUD> {
  findAllContactUs(
    page: number,
    limit: number,
    user: IUser,
    name?: string,
    brands?: string,
    influencer?: string
  ): Promise<PaginatedResponse<IContactUsForm>>
}

export interface IContactUsConfig {
  id: string
  employee: IEmployeeProfile
  followersCount: string
  createdAt: Date
  updatedAt: Date
}

export interface IContactUsConfigCRUD extends ICRUDBase<IContactUsConfig> {
  insertMany(data: DeepPartial<IContactUsConfig[]>): Promise<void>
}

export interface IContactUsConfigService
  extends IBaseService<IContactUsConfig, IContactUsConfigCRUD> {
  insertMany(data: DeepPartial<IContactUsConfig>[]): Promise<void>
}
