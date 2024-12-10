import { ICRUDBase } from '../../../../utils'
import {
  ICreditNote,
  IProformaInvoice,
  IPurchaseInvoice,
  ISaleInvoice,
} from './IModels'

export interface ISaleInvoiceCRUD extends ICRUDBase<ISaleInvoice> {}
export interface IPurchaseInvoiceCRUD extends ICRUDBase<IPurchaseInvoice> {}
export interface IProformaInvoiceCRUD extends ICRUDBase<IProformaInvoice> {}
export interface ICreditNoteCRUD extends ICRUDBase<ICreditNote> {}
