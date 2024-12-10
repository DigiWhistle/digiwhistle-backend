import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IPurchaseInvoice, IPurchaseInvoiceCRUD } from '../interface'

export class PurchaseInvoiceCRUD
  extends CRUDBase<IPurchaseInvoice>
  implements IPurchaseInvoiceCRUD
{
  private static instance: IPurchaseInvoiceCRUD | null = null

  static getInstance = (purchaseInvoice: EntityTarget<IPurchaseInvoice>) => {
    if (PurchaseInvoiceCRUD.instance === null) {
      PurchaseInvoiceCRUD.instance = new PurchaseInvoiceCRUD(purchaseInvoice)
    }
    return PurchaseInvoiceCRUD.instance
  }

  private constructor(purchaseInvoice: EntityTarget<IPurchaseInvoice>) {
    super(purchaseInvoice)
  }
}
