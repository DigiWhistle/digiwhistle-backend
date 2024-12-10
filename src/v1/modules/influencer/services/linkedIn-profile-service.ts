import { DeepPartial } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import {
  ILinkedInProfileStats,
  ILinkedInProfileStatsCRUD,
  ILinkedInProfileStatsService,
} from '../interface'

class LinkedInProfileStatsService
  extends BaseService<ILinkedInProfileStats, ILinkedInProfileStatsCRUD>
  implements ILinkedInProfileStatsService
{
  private static instance: ILinkedInProfileStatsService | null = null

  static getInstance(LinkedInProfileStatsCRUD: ILinkedInProfileStatsCRUD) {
    if (LinkedInProfileStatsService.instance === null) {
      LinkedInProfileStatsService.instance = new LinkedInProfileStatsService(
        LinkedInProfileStatsCRUD
      )
    }
    return LinkedInProfileStatsService.instance
  }

  private constructor(LinkedInProfileStatsCRUD: ILinkedInProfileStatsCRUD) {
    super(LinkedInProfileStatsCRUD)
  }

  async addOrUpdate(data: DeepPartial<ILinkedInProfileStats>): Promise<void> {
    try {
      await this.crudBase.addOrUpdate(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { LinkedInProfileStatsService }
