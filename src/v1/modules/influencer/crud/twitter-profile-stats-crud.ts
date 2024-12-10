import { DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ITwitterProfileStats, ITwitterProfileStatsCRUD } from '../interface'
import { TwitterProfileStats } from '../models'

class TwitterProfileStatsCRUD
  extends CRUDBase<ITwitterProfileStats>
  implements ITwitterProfileStatsCRUD
{
  private static instance: ITwitterProfileStatsCRUD | null = null

  static getInstance(TwitterProfileStats: EntityTarget<ITwitterProfileStats>) {
    if (TwitterProfileStatsCRUD.instance === null) {
      TwitterProfileStatsCRUD.instance = new TwitterProfileStatsCRUD(
        TwitterProfileStats
      )
    }
    return TwitterProfileStatsCRUD.instance
  }

  private constructor(TwitterProfileStats: EntityTarget<ITwitterProfileStats>) {
    super(TwitterProfileStats)
  }

  async addOrUpdate(data: DeepPartial<ITwitterProfileStats>): Promise<void> {
    try {
      const _data = await this.findOne({
        influencerProfile: {
          id: data.influencerProfile?.id,
        },
      })

      if (_data === null) await this.add(data)
      else await this.update({ id: _data.id }, data as ITwitterProfileStats)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { TwitterProfileStatsCRUD }
