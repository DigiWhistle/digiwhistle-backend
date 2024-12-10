import { DeepPartial } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import {
  ITwitterProfileStats,
  ITwitterProfileStatsCRUD,
  ITwitterProfileStatsService,
} from '../interface'

class TwitterProfileStatsService
  extends BaseService<ITwitterProfileStats, ITwitterProfileStatsCRUD>
  implements ITwitterProfileStatsService
{
  private static instance: ITwitterProfileStatsService | null = null

  static getInstance(twitterProfileStatsCRUD: ITwitterProfileStatsCRUD) {
    if (TwitterProfileStatsService.instance === null) {
      TwitterProfileStatsService.instance = new TwitterProfileStatsService(
        twitterProfileStatsCRUD
      )
    }
    return TwitterProfileStatsService.instance
  }

  private constructor(twitterProfileStatsCRUD: ITwitterProfileStatsCRUD) {
    super(twitterProfileStatsCRUD)
  }

  async addOrUpdate(data: DeepPartial<ITwitterProfileStats>): Promise<void> {
    try {
      await this.crudBase.addOrUpdate(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { TwitterProfileStatsService }
