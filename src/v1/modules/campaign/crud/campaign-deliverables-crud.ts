import { DeepPartial, EntityTarget, In } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ICampaignDeliverables, ICampaignDeliverablesCRUD } from '../interface'

class CampaignDeliverablesCRUD
  extends CRUDBase<ICampaignDeliverables>
  implements ICampaignDeliverablesCRUD
{
  private static instance: ICampaignDeliverablesCRUD | null = null

  private constructor(
    campaignDeliverables: EntityTarget<ICampaignDeliverables>
  ) {
    super(campaignDeliverables)
  }

  static getInstance = (
    campaignDeliverables: EntityTarget<ICampaignDeliverables>
  ) => {
    if (CampaignDeliverablesCRUD.instance === null)
      CampaignDeliverablesCRUD.instance = new CampaignDeliverablesCRUD(
        campaignDeliverables
      )
    return CampaignDeliverablesCRUD.instance
  }

  async insertMany(data: DeepPartial<ICampaignDeliverables>[]): Promise<void> {
    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(this.repository.target)
        .values(data)
        .orUpdate(
          [
            'title',
            'platform',
            'status',
            'engagementRate',
            'cpv',
            'link',
            'name',
          ],
          ['id']
        )
        .execute()
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async deleteMany(ids: Array<string>): Promise<void> {
    try {
      await this.repository.delete({
        id: In(ids),
      })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { CampaignDeliverablesCRUD }
