import { Enum } from '../../../../constants'

export type AgencyFilters = {
  id: string
  paymentStatus?: Enum.CampaignPaymentStatus
  platform?: Enum.Platform
  campaignStatus?: Enum.CampaignDeliverableStatus
}

export type AdminFilters = {
  paymentStatus?: Enum.CampaignPaymentStatus
  influencerType?: string
}

export type BrandFilters = {
  paymentStatus?: Enum.CampaignPaymentStatus
  campaignStatus?: Enum.CampaignDeliverableStatus
  platform?: Enum.Platform
  brand: string
}

export type InfluencerFilters = {
  id: string
  paymentStatus?: Enum.CampaignPaymentStatus
  platform?: Enum.Platform
}

export type CampaignStats = {
  totalCampaign: number
  totalCommercialBrand: number
  totalCommercialCreator: number
  totalToBeGiven: number
  totalMargin: number
  totalIncentive: number
  totalRevenue: number
  pendingIncentive: number
  totalActiveCampaign: number
}

export interface ICampaignInfluencerData {
  id: string
  type: string
  name: string
  exclusive: boolean
  commercialBrand: number
  commercialCreator: number
  toBeGiven: number
  margin: number
  paymentStatus: Enum.CampaignPaymentStatus
  invoiceStatus: Enum.CampaignInvoiceStatus
  invoice: string | null
  paymentTerms: Enum.INFLUENCER_PAYMENT_TERMS
  deliverables: [
    {
      id: string
      title: string
      platform: Enum.Platform
      status: Enum.CampaignDeliverableStatus
      deliverableLink: string
      er: number | null
      cpv: number | null
      desc: string | null
    },
  ]
}

export interface ICampaignAgencyData {
  id: string
  type: string
  name: string
  commercialBrand: number
  commercialCreator: number
  toBeGiven: number
  margin: number
  paymentStatus: Enum.CampaignPaymentStatus
  invoiceStatus: Enum.CampaignInvoiceStatus
  invoice: string | null
  paymentTerms: Enum.INFLUENCER_PAYMENT_TERMS
  influencer: [
    {
      name: string
      deliverables: [
        {
          id: string
          title: string
          platform: Enum.Platform
          status: Enum.CampaignDeliverableStatus
          deliverableLink: string
          er: number | null
          cpv: number | null
          desc: string | null
        },
      ]
    },
  ]
}

export interface ICampaignCardsRequest {
  id: string
  name: string
  code: string
  brandName: string
  brand: string
  startDate: Date
  endDate: Date
  commercial: number
  incentiveWinner: string
  status: string
  participants: Array<ICampaignInfluencerData | ICampaignAgencyData>
}

export type BrandReport = {
  influencers: Array<{ name: string; profilePic: string | null }>
  averageCpv: number
  campaignName: string
  brandLogo: string | null | undefined
  table: {
    headers: string[]
    rows: Array<{
      name: string
      views: number
      likes: number
      comments: number
    }>
  }
}
