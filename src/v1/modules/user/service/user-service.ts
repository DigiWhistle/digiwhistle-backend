import { FindOptionsWhere, ILike } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IUser, IUserService } from '../interface'
import { IUserCRUD } from '../interface'
import { userStats } from '../types'
import { Enum } from '../../../../constants'

class UserService
  extends BaseService<IUser, IUserCRUD>
  implements IUserService
{
  private static instance: IUserService | null = null

  static getInstance(UserCRUD: IUserCRUD): IUserService {
    if (UserService.instance === null) {
      UserService.instance = new UserService(UserCRUD)
    }
    return UserService.instance
  }

  private constructor(userCRUD: IUserCRUD) {
    super(userCRUD)
  }

  async findUserByMobileNo(mobileNo: string): Promise<IUser | null> {
    try {
      const query: FindOptionsWhere<IUser> = [
        { adminProfile: { mobileNo: mobileNo } },
        { employeeProfile: { mobileNo: mobileNo } },
        { influencerProfile: { mobileNo: mobileNo } },
        { brandProfile: { mobileNo: mobileNo } },
        { agencyProfile: { mobileNo: mobileNo } },
      ]

      const user = await this.findOne(query, [
        'adminProfile',
        'employeeProfile',
        'influencerProfile',
        'brandProfile',
        'agencyProfile',
        'role',
      ])

      return user
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findUserProfileByMobileNoOrUserId(
    mobileNo: string,
    userId: string
  ): Promise<IUser | null> {
    try {
      const query: FindOptionsWhere<IUser> = [
        { adminProfile: { mobileNo: mobileNo } },
        { employeeProfile: { mobileNo: mobileNo } },
        { influencerProfile: { mobileNo: mobileNo } },
        { brandProfile: { mobileNo: mobileNo } },
        { agencyProfile: { mobileNo: mobileNo } },
        { adminProfile: { user: { id: userId } } },
        { employeeProfile: { user: { id: userId } } },
        { influencerProfile: { user: { id: userId } } },
        { brandProfile: { user: { id: userId } } },
        { agencyProfile: { user: { id: userId } } },
      ]

      const user = await this.findOne(query, [
        'adminProfile',
        'employeeProfile',
        'influencerProfile',
        'brandProfile',
        'agencyProfile',
        'role',
      ])

      return user
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findAllAdminAndEmployees(
    page: number,
    limit: number,
    name: string
  ): Promise<PaginatedResponse<IUser>> {
    try {
      let adminQuery: FindOptionsWhere<IUser> = {}
      let employeeQuery: FindOptionsWhere<IUser> = {}

      if (typeof name === 'string') {
        adminQuery = {
          adminProfile: {
            firstName: ILike(`%${name}%`),
            lastName: ILike(`%${name}%`),
          },
        }

        employeeQuery = {
          employeeProfile: {
            firstName: ILike(`%${name}%`),
            lastName: ILike(`%${name}%`),
          },
        }
      }

      const data = await this.findAllPaginated(
        page,
        limit,
        [
          {
            ...adminQuery,
            role: {
              id: Enum.ROLES.ADMIN,
            },
          },
          {
            ...employeeQuery,
            role: {
              id: Enum.ROLES.EMPLOYEE,
            },
          },
        ],
        ['adminProfile', 'employeeProfile', 'role'],
        { id: 'ASC' }
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findOverallUserStats(): Promise<userStats> {
    try {
      const data = await this.crudBase.findAll(
        [
          {
            role: {
              id: Enum.ROLES.INFLUENCER,
            },
          },
          {
            role: {
              id: Enum.ROLES.AGENCY,
            },
          },
          {
            role: {
              id: Enum.ROLES.BRAND,
            },
          },
        ],
        ['role', 'brandProfile', 'agencyProfile', 'influencerProfile']
      )

      let approved = 0,
        rejected = 0,
        pending = 0

      data.forEach((value) => {
        if (
          value.isApproved === true &&
          ((value.role.id === Enum.ROLES.INFLUENCER &&
            value.influencerProfile !== null) ||
            (value.role.id === Enum.ROLES.AGENCY &&
              value.agencyProfile !== null) ||
            (value.role.id === Enum.ROLES.BRAND && value.brandProfile !== null))
        ) {
          approved++
        } else if (
          value.isApproved === false &&
          ((value.role.id === Enum.ROLES.INFLUENCER &&
            value.influencerProfile !== null) ||
            (value.role.id === Enum.ROLES.AGENCY &&
              value.agencyProfile !== null) ||
            (value.role.id === Enum.ROLES.BRAND && value.brandProfile !== null))
        ) {
          rejected++
        } else if (
          value.isApproved === null &&
          ((value.role.id === Enum.ROLES.INFLUENCER &&
            value.influencerProfile !== null &&
            (value.influencerProfile?.instagramURL !== null ||
              value.influencerProfile?.twitterURL !== null ||
              value.influencerProfile?.youtubeURL !== null ||
              value.influencerProfile?.linkedInURL !== null)) ||
            (value.role.id === Enum.ROLES.AGENCY &&
              value.agencyProfile !== null) ||
            (value.role.id === Enum.ROLES.BRAND && value.brandProfile !== null))
        ) {
          pending++
        }
      })

      const result: userStats = {
        pending: pending.toString(),
        approved: approved.toString(),
        rejected: rejected.toString(),
      }

      return result
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findUserByMobileNoAndEmail(
    mobileNo: string,
    email: string
  ): Promise<IUser | null> {
    try {
      const query: FindOptionsWhere<IUser> = [
        { email: email },
        { adminProfile: { mobileNo: mobileNo } },
        { employeeProfile: { mobileNo: mobileNo } },
        { influencerProfile: { mobileNo: mobileNo } },
        { brandProfile: { mobileNo: mobileNo } },
        { agencyProfile: { mobileNo: mobileNo } },
      ]

      const user = await this.findOne(query, [
        'adminProfile',
        'employeeProfile',
        'influencerProfile',
        'brandProfile',
        'agencyProfile',
      ])

      return user
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findInfluencerAndAgencyByEmail(email: string): Promise<IUser[]> {
    try {
      const data = await this.crudBase.findAll(
        [
          {
            role: {
              id: Enum.ROLES.INFLUENCER,
            },
            email: ILike(`%${email}%`),
          },
          {
            role: {
              id: Enum.ROLES.AGENCY,
            },
            email: ILike(`%${email}%`),
          },
        ],
        ['agencyProfile', 'influencerProfile']
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
export { UserService }
