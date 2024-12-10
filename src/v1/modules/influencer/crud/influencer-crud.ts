import { IInfluencerCRUD, IInfluencerProfile } from '../interface'
import { IAddInfluencer } from '../types'
import { AppDataSource } from '../../../../config'
import { User } from '../../user/models'
import { InfluencerProfile } from '../models'
import { HttpException } from '../../../../utils'
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm'

class InfluencerCRUD implements IInfluencerCRUD {
  private static instance: IInfluencerCRUD | null = null

  static getInstance = () => {
    if (InfluencerCRUD.instance === null) {
      InfluencerCRUD.instance = new InfluencerCRUD()
    }
    return InfluencerCRUD.instance
  }

  private constructor() {}

  async addInfluencer(data: IAddInfluencer): Promise<IInfluencerProfile> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()

      const userRepository = queryRunner.manager.getRepository(User)
      await userRepository.save({
        email: data.email,
        id: data.userId,
        role: {
          id: 4,
        },
        isVerified: false,
      })

      const influencerProfileRepository =
        queryRunner.manager.getRepository(InfluencerProfile)

      const _data = await influencerProfileRepository.save({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        instagramURL: data.instagramURL,
        twitterURL: data.twitterURL,
        youtubeURL: data.youtubeURL,
        linkedInURL: data.linkedInURL,
        user: {
          id: data.userId,
        },
        location: data.location,
        instagramCommercial: data.instagramCommercial,
        twitterCommercial: data.twitterCommercial,
        youtubeCommercial: data.youtubeCommercial,
        linkedInCommercial: data.linkedInCommercial,
        rating: data.rating,
      })

      await queryRunner.commitTransaction()
      return _data
    } catch (e) {
      await queryRunner.rollbackTransaction()
      throw new HttpException(e?.errorCode, e?.message)
    } finally {
      await queryRunner.release()
    }
  }
}

export { InfluencerCRUD }
