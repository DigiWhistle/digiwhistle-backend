import { Between, DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ICampaignParticipants, ICampaignParticipantsCRUD } from '../interface'
import { CampaignStats } from '../types'

class CampaignParticipantsCRUD
  extends CRUDBase<ICampaignParticipants>
  implements ICampaignParticipantsCRUD
{
  private static instance: ICampaignParticipantsCRUD | null = null

  private constructor(
    campaignParticipants: EntityTarget<ICampaignParticipants>
  ) {
    super(campaignParticipants)
  }

  static getInstance = (
    campaignParticipants: EntityTarget<ICampaignParticipants>
  ) => {
    if (CampaignParticipantsCRUD.instance === null)
      CampaignParticipantsCRUD.instance = new CampaignParticipantsCRUD(
        campaignParticipants
      )
    return CampaignParticipantsCRUD.instance
  }

  async insertMany(data: DeepPartial<ICampaignParticipants>[]): Promise<void> {
    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(this.repository.target)
        .values(data)
        .orUpdate(['updatedAt'], ['id'])
        .setParameters(['updatedAt', new Date()])
        .execute()
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async updateMany(data: Partial<ICampaignParticipants>[]): Promise<void> {
    try {
      const promises: Promise<ICampaignParticipants>[] = []

      data.forEach((value) => {
        promises.push(this.update({ id: value.id }, value))
      })

      await Promise.all(promises)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getTotalCampaignsAndRevenue(
    lowerBound: Date,
    upperBound: Date,
    influencerProfileId?: string,
    agencyProfileId?: string
  ): Promise<CampaignStats> {
    try {
      if (typeof influencerProfileId === 'string') {
        const data = await this.repository.find({
          where: {
            campaign: [
              { startDate: Between(lowerBound, upperBound) },
              { endDate: Between(lowerBound, upperBound) },
            ],
            influencerProfile: {
              id: influencerProfileId,
            },
          },
        })

        let totalRevenue = 0
        data.forEach((value) => {
          totalRevenue += value.toBePaid === null ? 0 : value.toBePaid
        })

        return {
          totalCampaign: data.length,
          totalRevenue: totalRevenue,
          totalCommercialBrand: 0,
          totalCommercialCreator: 0,
          totalToBeGiven: 0,
          totalMargin: 0,
          totalIncentive: 0,
          pendingIncentive: 0,
          totalActiveCampaign: 0,
        }
      } else {
        const data = await this.repository.find({
          where: {
            campaign: [
              { startDate: Between(lowerBound, upperBound) },
              { endDate: Between(lowerBound, upperBound) },
            ],
            agencyProfile: {
              id: agencyProfileId,
            },
          },
        })

        let totalRevenue = 0
        data.forEach((value) => {
          totalRevenue += value.toBePaid === null ? 0 : value.toBePaid
        })

        return {
          totalCampaign: data.length,
          totalRevenue: totalRevenue,
          totalCommercialBrand: 0,
          totalCommercialCreator: 0,
          totalToBeGiven: 0,
          totalMargin: 0,
          pendingIncentive: 0,
          totalIncentive: 0,
          totalActiveCampaign: 0,
        }
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { CampaignParticipantsCRUD }
