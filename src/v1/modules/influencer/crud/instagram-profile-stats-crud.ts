import { DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import {
  IInstagramProfileStats,
  IInstagramProfileStatsCRUD,
} from '../interface'

class InstagramProfileStatsCRUD
  extends CRUDBase<IInstagramProfileStats>
  implements IInstagramProfileStatsCRUD
{
  private static instance: IInstagramProfileStatsCRUD | null = null

  static getInstance(
    InstagramProfileStats: EntityTarget<IInstagramProfileStats>
  ) {
    if (InstagramProfileStatsCRUD.instance === null) {
      InstagramProfileStatsCRUD.instance = new InstagramProfileStatsCRUD(
        InstagramProfileStats
      )
    }
    return InstagramProfileStatsCRUD.instance
  }

  private constructor(
    InstagramProfileStats: EntityTarget<IInstagramProfileStats>
  ) {
    super(InstagramProfileStats)
  }

  async addOrUpdate(data: DeepPartial<IInstagramProfileStats>): Promise<void> {
    try {
      const _data = await this.findOne({
        influencerProfile: {
          id: data.influencerProfile?.id,
        },
      })

      if (_data === null) await this.add(data)
      else await this.update({ id: _data.id }, data as IInstagramProfileStats)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { InstagramProfileStatsCRUD }
