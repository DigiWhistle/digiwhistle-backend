import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { ICreditNote, ICreditNoteCRUD } from '../interface'

export class CreditNoteCRUD
  extends CRUDBase<ICreditNote>
  implements ICreditNoteCRUD
{
  private static instance: ICreditNoteCRUD | null = null

  static getInstance = (creditNote: EntityTarget<ICreditNote>) => {
    if (CreditNoteCRUD.instance === null) {
      CreditNoteCRUD.instance = new CreditNoteCRUD(creditNote)
    }
    return CreditNoteCRUD.instance
  }

  private constructor(creditNote: EntityTarget<ICreditNote>) {
    super(creditNote)
  }
}
