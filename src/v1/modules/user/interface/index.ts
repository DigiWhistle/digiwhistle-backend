import { ObjectLiteral } from 'typeorm'
import { IAdminProfile, IEmployeeProfile } from '../../admin/interface'
import { IBrandProfile } from '../../brands/interface'
import { IAgencyProfile } from '../../agency/interface'
import { IInfluencerProfile } from '../../influencer/interface'
import { ICRUDBase } from '../../../../utils'
import { userStats } from '../types'
import { IBaseService, PaginatedResponse } from '../../../../utils/base-service'

export interface IUser extends ObjectLiteral {
  id: string
  email: string
  role: IRole
  brandProfile?: IBrandProfile | null
  influencerProfile?: IInfluencerProfile | null
  adminProfile?: IAdminProfile | null
  employeeProfile?: IEmployeeProfile | null
  agencyProfile?: IAgencyProfile | null
  isVerified: boolean
  isPaused: boolean
  isApproved: boolean | null
}

export interface IRole extends ObjectLiteral {
  id: number
  name: string
  users: IUser[]
}

export interface IUserCRUD extends ICRUDBase<IUser> {
  findOverallUserStats(): Promise<userStats>
}

export interface IRoleCRUD extends ICRUDBase<IRole> {}

export interface IUserService extends IBaseService<IUser, IUserCRUD> {
  findUserByMobileNo(mobileNo: string): Promise<IUser | null>
  findUserProfileByMobileNoOrUserId(
    mobileNo: string,
    userId: string
  ): Promise<IUser | null>
  findAllAdminAndEmployees(
    page: number,
    limit: number,
    name?: string
  ): Promise<PaginatedResponse<IUser>>
  findOverallUserStats(): Promise<userStats>
  findUserByMobileNoAndEmail(
    mobileNo: string,
    email: string
  ): Promise<IUser | null>
  findInfluencerAndAgencyByEmail(email: string): Promise<IUser[]>
}

export interface IRoleService extends IBaseService<IRole, IRoleCRUD> {}
