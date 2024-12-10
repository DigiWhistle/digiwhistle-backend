import { DeepPartial } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import {
  ICampaignDeliverables,
  ICampaignDeliverablesCRUD,
  ICampaignDeliverablesService,
} from '../interface'

class CampaignDeliverablesService
  extends BaseService<ICampaignDeliverables, ICampaignDeliverablesCRUD>
  implements ICampaignDeliverablesService
{
  private static instance: ICampaignDeliverablesService | null = null

  private constructor(campaignDeliverableCRUD: ICampaignDeliverablesCRUD) {
    super(campaignDeliverableCRUD)
  }

  static getInstance = (campaignDeliverableCRUD: ICampaignDeliverablesCRUD) => {
    if (CampaignDeliverablesService.instance === null)
      CampaignDeliverablesService.instance = new CampaignDeliverablesService(
        campaignDeliverableCRUD
      )
    return CampaignDeliverablesService.instance
  }

  async insertMany(data: DeepPartial<ICampaignDeliverables>[]): Promise<void> {
    try {
      await this.crudBase.insertMany(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async deleteMany(ids: Array<string>): Promise<void> {
    try {
      await this.crudBase.deleteMany(ids)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { CampaignDeliverablesService }
