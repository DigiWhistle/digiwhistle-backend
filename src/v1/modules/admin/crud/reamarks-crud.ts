import { EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { IRemarksCRUD } from '../interface'
import { IRemarks } from '../interface'

class RemarksCRUD extends CRUDBase<IRemarks> implements IRemarksCRUD {
  private static instance: IRemarksCRUD | null = null

  static getInstance = (remarks: EntityTarget<IRemarks>) => {
    if (RemarksCRUD.instance === null) {
      RemarksCRUD.instance = new RemarksCRUD(remarks)
    }
    return RemarksCRUD.instance
  }

  private constructor(remarks: EntityTarget<IRemarks>) {
    super(remarks)
  }
}

export { RemarksCRUD }
