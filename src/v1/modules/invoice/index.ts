import { AxiosService, MailerService, RazorpayService } from '../../utils'
import { campaignParticipantsService } from '../campaign'
import {
  CreditNoteCRUD,
  ProformaInvoiceCRUD,
  PurchaseInvoiceCRUD,
  SaleInvoiceCRUD,
} from './crud'
import {
  CreditNote,
  ProformaInvoice,
  PurchaseInvoice,
  SaleInvoice,
} from './models'
import {
  CreditNoteService,
  ProformaInvoiceService,
  PurchaseInvoiceService,
  SaleInvoiceService,
} from './service'

const purchaseInvoiceService = PurchaseInvoiceService.getInstance(
  PurchaseInvoiceCRUD.getInstance(PurchaseInvoice),
  MailerService.getInstance(),
  campaignParticipantsService,
  RazorpayService.getInstance(AxiosService.getInstance())
)

const saleInvoiceService = SaleInvoiceService.getInstance(
  SaleInvoiceCRUD.getInstance(SaleInvoice),
  MailerService.getInstance()
)

const proformaInvoiceService = ProformaInvoiceService.getInstance(
  ProformaInvoiceCRUD.getInstance(ProformaInvoice),
  MailerService.getInstance()
)

const creditNoteService = CreditNoteService.getInstance(
  CreditNoteCRUD.getInstance(CreditNote)
)

export {
  purchaseInvoiceService,
  saleInvoiceService,
  proformaInvoiceService,
  creditNoteService,
}
