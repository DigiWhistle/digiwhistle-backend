import { EntityTarget, ILike } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { IInfluencerProfile, IInfluencerProfileCRUD } from '../interface'
import { InfluencerStats } from '../types'
import { InfluencerProfile } from '../models'

class InfluencerProfileCRUD
  extends CRUDBase<IInfluencerProfile>
  implements IInfluencerProfileCRUD
{
  private static instance: IInfluencerProfileCRUD | null = null

  static getInstance(influencerProfile: EntityTarget<IInfluencerProfile>) {
    if (InfluencerProfileCRUD.instance === null) {
      InfluencerProfileCRUD.instance = new InfluencerProfileCRUD(
        influencerProfile
      )
    }
    return InfluencerProfileCRUD.instance
  }

  private constructor(influencerProfile: EntityTarget<IInfluencerProfile>) {
    super(influencerProfile)
  }

  async getInfluencerStats(): Promise<InfluencerStats> {
    try {
      const result = await this.repository
        .createQueryBuilder('influencerProfile')
        .select([
          'SUM(CASE WHEN influencerProfile.exclusive IS TRUE THEN 1 ELSE 0 END) AS exclusive',
          'SUM(CASE WHEN influencerProfile.exclusive IS FALSE THEN 1 ELSE 0 END) AS nonexclusive',
        ])
        .leftJoin('influencerProfile.user', 'user')
        .where('user.isApproved = true')
        .getRawOne()

      return result
    } catch (e) {
      console.log(e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { InfluencerProfileCRUD }
