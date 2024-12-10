import { DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ILinkedInProfileStats } from '../interface'
import { ILinkedInProfileStatsCRUD } from '../interface/ICRUD'

export class LinkedInProfileStatsCRUD
  extends CRUDBase<ILinkedInProfileStats>
  implements ILinkedInProfileStatsCRUD
{
  private static instance: ILinkedInProfileStatsCRUD | null = null

  static getInstance = (
    linkedInProfileStats: EntityTarget<ILinkedInProfileStats>
  ) => {
    if (LinkedInProfileStatsCRUD.instance === null)
      LinkedInProfileStatsCRUD.instance = new LinkedInProfileStatsCRUD(
        linkedInProfileStats
      )
    return LinkedInProfileStatsCRUD.instance
  }

  private constructor(
    linkedInProfileStats: EntityTarget<ILinkedInProfileStats>
  ) {
    super(linkedInProfileStats)
  }

  async addOrUpdate(data: DeepPartial<ILinkedInProfileStats>): Promise<void> {
    try {
      const _data = await this.findOne({
        influencerProfile: {
          id: data.influencerProfile?.id,
        },
      })

      if (_data === null) await this.add(data)
      else await this.update({ id: _data.id }, data as ILinkedInProfileStats)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
