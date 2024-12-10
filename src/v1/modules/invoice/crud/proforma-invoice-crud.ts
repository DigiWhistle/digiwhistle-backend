import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IProformaInvoice, IProformaInvoiceCRUD } from '../interface'

export class ProformaInvoiceCRUD
  extends CRUDBase<IProformaInvoice>
  implements IProformaInvoiceCRUD
{
  private static instance: IProformaInvoiceCRUD | null = null

  static getInstance = (proformaInvoice: EntityTarget<IProformaInvoice>) => {
    if (ProformaInvoiceCRUD.instance === null) {
      ProformaInvoiceCRUD.instance = new ProformaInvoiceCRUD(proformaInvoice)
    }
    return ProformaInvoiceCRUD.instance
  }

  private constructor(proformaInvoice: EntityTarget<IProformaInvoice>) {
    super(proformaInvoice)
  }
}
