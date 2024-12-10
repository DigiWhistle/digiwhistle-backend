import { DeepPartial } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import {
  IYoutubeProfileStats,
  IYoutubeProfileStatsCRUD,
  IYoutubeProfileStatsService,
} from '../interface'

class YoutubeProfileStatsService
  extends BaseService<IYoutubeProfileStats, IYoutubeProfileStatsCRUD>
  implements IYoutubeProfileStatsService
{
  private static instance: IYoutubeProfileStatsService | null = null

  static getInstance(youtubeProfileStatsCRUD: IYoutubeProfileStatsCRUD) {
    if (YoutubeProfileStatsService.instance === null) {
      YoutubeProfileStatsService.instance = new YoutubeProfileStatsService(
        youtubeProfileStatsCRUD
      )
    }
    return YoutubeProfileStatsService.instance
  }

  private constructor(youtubeProfileStatsCRUD: IYoutubeProfileStatsCRUD) {
    super(youtubeProfileStatsCRUD)
  }

  async addOrUpdate(data: DeepPartial<IYoutubeProfileStats>): Promise<void> {
    try {
      await this.crudBase.addOrUpdate(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { YoutubeProfileStatsService }
