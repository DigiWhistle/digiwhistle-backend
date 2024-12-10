import { CRUDBase, HttpException } from '../../../../utils'
import { EntityTarget } from 'typeorm'
import { IUser, IUserCRUD } from '../interface'
import { userStats } from '../types'
import { Enum } from '../../../../constants'

export class UserCRUD extends CRUDBase<IUser> implements IUserCRUD {
  private static instance: IUserCRUD | null = null

  static getInstance(user: EntityTarget<IUser>): IUserCRUD {
    if (UserCRUD.instance === null) {
      UserCRUD.instance = new UserCRUD(user)
    }
    return UserCRUD.instance
  }

  private constructor(user: EntityTarget<IUser>) {
    super(user)
  }

  async findOverallUserStats(): Promise<userStats> {
    try {
      const result = await this.repository
        .createQueryBuilder('user')
        .select([
          'COUNT(CASE WHEN user.isApproved IS NULL THEN 1 ELSE NULL END) AS Pending',
          'COUNT(CASE WHEN user.isApproved = TRUE THEN 1 ELSE NULL END) AS Approved',
          'COUNT(CASE WHEN user.isApproved = FALSE THEN 1 ELSE NULL END) AS Rejected',
        ])
        .leftJoin('user.role', 'role')
        .where('role.id = :role1', { role1: Enum.ROLES.INFLUENCER })
        .orWhere('role.id = :role2', { role2: Enum.ROLES.AGENCY })
        .orWhere('role.id = :role3', { role3: Enum.ROLES.BRAND })
        .getRawOne()

      return result
    } catch (e) {
      console.log(e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
