import { DeepPartial } from 'typeorm'
import { IBaseService } from '../../../../utils'
import {
  ICampaignCRUD,
  ICampaignDeliverablesCRUD,
  ICampaignParticipantsCRUD,
} from './ICRUD'
import {
  ICampaign,
  ICampaignDeliverables,
  ICampaignParticipants,
} from './IModel'
import { PaginatedResponse } from '../../../../utils/base-service'
import {
  AdminFilters,
  AgencyFilters,
  BrandFilters,
  CampaignStats,
  InfluencerFilters,
} from '../types'

export interface ICampaignService
  extends IBaseService<ICampaign, ICampaignCRUD> {
  getAllCampaigns(
    page: number,
    limit: number,
    roleId: number,
    lowerBound: Date,
    upperBound: Date,
    name?: string,
    agencyFilters?: AgencyFilters,
    adminFilters?: AdminFilters,
    brandFilters?: BrandFilters,
    influencerFilters?: InfluencerFilters
  ): Promise<PaginatedResponse<ICampaign>>
  getTotalCampaignsAndRevenue(
    lowerBound: Date,
    upperBound: Date,
    brandProfileId?: string,
    agencyProfileId?: string,
    influencerProfileId?: string
  ): Promise<CampaignStats>
  releaseIncentive(id: string): Promise<void>
  generateBrandReport(brandId?: string, id?: string): Promise<any>
  sendConfirmationMail(id: string): Promise<void>
}

export interface ICampaignDeliverablesService
  extends IBaseService<ICampaignDeliverables, ICampaignDeliverablesCRUD> {
  insertMany(data: DeepPartial<ICampaignParticipants>[]): Promise<void>
  deleteMany(ids: Array<string>): Promise<void>
}

export interface ICampaignParticipantsService
  extends IBaseService<ICampaignParticipants, ICampaignParticipantsCRUD> {
  insertMany(data: DeepPartial<ICampaignParticipants>[]): Promise<void>
  updateMany(data: Partial<ICampaignParticipants>[]): Promise<void>
  getTotalCampaignsAndRevenue(
    lowerBound: Date,
    upperBound: Date,
    influencerProfileId?: string,
    agencyProfileId?: string
  ): Promise<CampaignStats>
}

export interface ICampaignInsightsService {}
