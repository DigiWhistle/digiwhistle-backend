import { Enum } from '../../../../constants'
import { IEmployeeProfile } from '../../admin/interface'
import { IBrandProfile } from '../../brands/interface'
import { IInfluencerProfile } from '../../influencer/interface'
import { IPurchaseInvoice, ISaleInvoice } from '../../invoice/interface'
import { IAgencyProfile } from '../../agency/interface'

export interface ICampaign {
  id: string
  name: string
  code: string
  brandName: string
  brand: IBrandProfile | null
  startDate: Date
  endDate: Date
  commercial: number
  details: string | null
  invoiceNo: string | null
  status: Enum.CampaignStatus
  paymentStatus: Enum.CampaignPaymentStatus
  manager: IEmployeeProfile
  incentiveWinner: IEmployeeProfile | null
  participants: ICampaignParticipants[]
  saleInvoices?: ISaleInvoice[]
  purchaseInvoices?: IPurchaseInvoice[]
  incentiveReleased: boolean
  paymentTerms: Enum.PaymentTerms
  cpv: number | null
  createdAt: Date
  updatedAt: Date
}

export interface ICampaignParticipants {
  id: string
  email: string
  influencerProfile: IInfluencerProfile | null
  agencyProfile: IAgencyProfile | null
  campaign: ICampaign
  commercialBrand: number
  commercialCreator: number | null
  invoice: string | null
  paymentStatus: Enum.CampaignPaymentStatus
  invoiceStatus: Enum.CampaignInvoiceStatus
  toBePaid: number | null
  margin: number | null
  deliverables: ICampaignDeliverables[]
  paymentTerms: Enum.INFLUENCER_PAYMENT_TERMS
  confirmationSent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICampaignDeliverables {
  id: string
  name: string
  desc: string | null
  title: string
  platform: Enum.Platform
  status: Enum.CampaignDeliverableStatus
  link: string | null
  engagementRate: number | null
  cpv: number | null
  campaignParticipant: ICampaignParticipants
  statsUpdatedAt: Date
  createdAt: Date
  updatedAt: Date
}
