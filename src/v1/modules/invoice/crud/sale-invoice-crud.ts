import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { ISaleInvoice, ISaleInvoiceCRUD } from '../interface'

export class SaleInvoiceCRUD
  extends CRUDBase<ISaleInvoice>
  implements ISaleInvoiceCRUD
{
  private static instance: ISaleInvoiceCRUD | null = null

  static getInstance = (saleInvoice: EntityTarget<ISaleInvoice>) => {
    if (SaleInvoiceCRUD.instance === null) {
      SaleInvoiceCRUD.instance = new SaleInvoiceCRUD(saleInvoice)
    }
    return SaleInvoiceCRUD.instance
  }

  private constructor(saleInvoice: EntityTarget<ISaleInvoice>) {
    super(saleInvoice)
  }
}
