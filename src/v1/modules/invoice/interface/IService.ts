import { Enum } from '../../../../constants'
import { IBaseService } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { PurchaseInvoiceWebhookPayload, ShareInvoiceRequest } from '../types'
import {
  ICreditNoteCRUD,
  IProformaInvoiceCRUD,
  IPurchaseInvoiceCRUD,
  ISaleInvoiceCRUD,
} from './ICRUD'
import {
  ICreditNote,
  IProformaInvoice,
  IPurchaseInvoice,
  ISaleInvoice,
} from './IModels'

export interface ISaleInvoiceService
  extends IBaseService<ISaleInvoice, ISaleInvoiceCRUD> {
  getAllSaleInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    invoiceNo: string
  ): Promise<PaginatedResponse<ISaleInvoice>>

  shareSaleInvoice(data: ShareInvoiceRequest): Promise<void>
  downloadSaleInvoice(id: string): Promise<string>
  downloadSaleInvoiceReport(startDate: Date, endDate: Date): Promise<string>
}

export interface IPurchaseInvoiceService
  extends IBaseService<IPurchaseInvoice, IPurchaseInvoiceCRUD> {
  getAllPurchaseInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    invoiceNo: string,
    influencerProfileId?: string,
    agencyProfileId?: string
  ): Promise<PaginatedResponse<IPurchaseInvoice>>

  sharePurchaseInvoice(data: ShareInvoiceRequest): Promise<void>
  downloadPurchaseInvoiceReport(startDate: Date, endDate: Date): Promise<string>
  handleWebhook(
    payload: PurchaseInvoiceWebhookPayload,
    event: Enum.WEBHOOK_EVENTS
  ): Promise<void>
  releasePayment(invoiceId: string, idempotencyKey: string): Promise<void>
}

export interface IProformaInvoiceService
  extends IBaseService<IProformaInvoice, IProformaInvoiceCRUD> {
  downloadProformaInvoice(id: string): Promise<string>
  getAllProformaInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    invoiceNo: string
  ): Promise<PaginatedResponse<IProformaInvoice>>

  shareProformaInvoice(data: ShareInvoiceRequest): Promise<void>
}

export interface ICreditNoteService
  extends IBaseService<ICreditNote, ICreditNoteCRUD> {
  downloadCreditNote(invoiceId: string): Promise<string>
}
