import { DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { IYoutubeProfileStats, IYoutubeProfileStatsCRUD } from '../interface'

class YoutubeProfileStatsCRUD
  extends CRUDBase<IYoutubeProfileStats>
  implements IYoutubeProfileStatsCRUD
{
  private static instance: IYoutubeProfileStatsCRUD | null = null

  static getInstance(YoutubeProfileStats: EntityTarget<IYoutubeProfileStats>) {
    if (YoutubeProfileStatsCRUD.instance === null) {
      YoutubeProfileStatsCRUD.instance = new YoutubeProfileStatsCRUD(
        YoutubeProfileStats
      )
    }
    return YoutubeProfileStatsCRUD.instance
  }

  private constructor(YoutubeProfileStats: EntityTarget<IYoutubeProfileStats>) {
    super(YoutubeProfileStats)
  }

  async addOrUpdate(data: DeepPartial<IYoutubeProfileStats>): Promise<void> {
    try {
      const _data = await this.findOne({
        influencerProfile: {
          id: data.influencerProfile?.id,
        },
      })

      if (_data === null) await this.add(data)
      else await this.update({ id: _data.id }, data as IYoutubeProfileStats)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { YoutubeProfileStatsCRUD }
