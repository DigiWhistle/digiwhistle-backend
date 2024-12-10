import { IRemarks, IRemarksCRUD } from '../interface'
import { IRemarksService } from '../interface'
import { BaseService, HttpException } from '../../../../utils'

class RemarksService
  extends BaseService<IRemarks, IRemarksCRUD>
  implements IRemarksService
{
  private static instance: IRemarksService | null = null

  static getInstance = (remarksCRUD: IRemarksCRUD) => {
    if (RemarksService.instance === null) {
      RemarksService.instance = new RemarksService(remarksCRUD)
    }
    return RemarksService.instance
  }

  private constructor(remarksCRUD: IRemarksCRUD) {
    super(remarksCRUD)
  }

  async clearAllRemarksByUserId(userId: string): Promise<void> {
    try {
      await this.crudBase.delete({ userId: userId })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { RemarksService }
