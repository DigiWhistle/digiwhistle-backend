import { DeepPartial } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import {
  IInstagramProfileStats,
  IInstagramProfileStatsCRUD,
  IInstagramProfileStatsService,
} from '../interface'

class InstagramProfileStatsService
  extends BaseService<IInstagramProfileStats, IInstagramProfileStatsCRUD>
  implements IInstagramProfileStatsService
{
  private static instance: IInstagramProfileStatsService | null = null

  static getInstance(instagramProfileStatsCRUD: IInstagramProfileStatsCRUD) {
    if (InstagramProfileStatsService.instance === null) {
      InstagramProfileStatsService.instance = new InstagramProfileStatsService(
        instagramProfileStatsCRUD
      )
    }
    return InstagramProfileStatsService.instance
  }

  private constructor(instagramProfileStatsCRUD: IInstagramProfileStatsCRUD) {
    super(instagramProfileStatsCRUD)
  }

  async addOrUpdate(data: DeepPartial<IInstagramProfileStats>): Promise<void> {
    try {
      await this.crudBase.addOrUpdate(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { InstagramProfileStatsService }
