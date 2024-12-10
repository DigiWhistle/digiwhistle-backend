import { Enum } from '../../../../constants'
import { IAgencyProfile } from '../../agency/interface'
import { ICampaign } from '../../campaign/interface'
import { IInfluencerProfile } from '../../influencer/interface'

export interface ISaleInvoice {
  id: string
  campaign: ICampaign
  gstTin: string
  invoiceNo: string
  invoiceDate: Date
  amount: number
  sgst: number
  cgst: number
  igst: number
  total: number
  tds: number
  received: number
  balanceAmount: number
  month: string
  paymentStatus: Enum.InvoiceStatus
  creditNotes: ICreditNote[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IPurchaseInvoice {
  id: string
  campaign: ICampaign
  invoiceNo: string
  pan: string
  amount: number
  igst: number
  cgst: number
  sgst: number
  totalAmount: number
  tds: number
  tdsPercentage: number
  tdsSection: string
  finalAmount: number
  amountToBeReceived: number
  balanceAmount: number
  paymentTerms: Enum.PaymentTerms
  paymentStatus: Enum.InvoiceStatus
  file?: string | null
  influencerProfile?: IInfluencerProfile | null
  agencyProfile?: IAgencyProfile | null
  invoiceDate: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IProformaInvoice {
  id: string
  campaign: ICampaign
  gstTin: string
  billNo: string
  billDate: Date
  invoiceNo: string
  invoiceDate: Date
  amount: number
  sgst: number
  cgst: number
  igst: number
  total: number
  tds: number
  received: number
  balanceAmount: number
  month: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreditNote {
  id: string
  invoice: ISaleInvoice
  gstTin: string
  creditNoteNo: string
  creditNoteDate: Date
  amount: number
  sgst: number
  cgst: number
  igst: number
  total: number
  tds: number
  advance: number
  remarks: string
  month: string
  createdAt?: Date
  updatedAt?: Date
}
