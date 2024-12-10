import { DeepPartial } from 'typeorm'
import { BaseService } from '../../../../utils'
import {
  ICampaignParticipants,
  ICampaignParticipantsCRUD,
  ICampaignParticipantsService,
} from '../interface'
import { CampaignStats } from '../types'

class CampaignParticipantsService
  extends BaseService<ICampaignParticipants, ICampaignParticipantsCRUD>
  implements ICampaignParticipantsService
{
  private static instance: ICampaignParticipantsService | null = null

  private constructor(campaignParticipantsCRUD: ICampaignParticipantsCRUD) {
    super(campaignParticipantsCRUD)
  }

  static getInstance = (
    campaignParticipantsCRUD: ICampaignParticipantsCRUD
  ) => {
    if (CampaignParticipantsService.instance === null)
      CampaignParticipantsService.instance = new CampaignParticipantsService(
        campaignParticipantsCRUD
      )
    return CampaignParticipantsService.instance
  }

  async insertMany(data: DeepPartial<ICampaignParticipants>[]): Promise<void> {
    await this.crudBase.insertMany(data)
  }

  async updateMany(data: Partial<ICampaignParticipants>[]): Promise<void> {
    await this.crudBase.updateMany(data)
  }

  async getTotalCampaignsAndRevenue(
    lowerBound: Date,
    upperBound: Date,
    influencerProfileId?: string,
    agencyProfileId?: string
  ): Promise<CampaignStats> {
    return await this.crudBase.getTotalCampaignsAndRevenue(
      lowerBound,
      upperBound,
      influencerProfileId,
      agencyProfileId
    )
  }
}

export { CampaignParticipantsService }
