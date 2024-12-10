import { Between, EntityTarget, FindOptions, FindOptionsWhere } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ICampaign, ICampaignCRUD } from '../interface'
import { CampaignStats } from '../types'
import { Enum } from '../../../../constants'

class CampaignCRUD extends CRUDBase<ICampaign> implements ICampaignCRUD {
  private static instance: ICampaignCRUD | null = null

  private constructor(campaign: EntityTarget<ICampaign>) {
    super(campaign)
  }

  static getInstance = (campaign: EntityTarget<ICampaign>) => {
    if (CampaignCRUD.instance === null)
      CampaignCRUD.instance = new CampaignCRUD(campaign)
    return CampaignCRUD.instance
  }

  async getTotalCampaignsAndRevenue(
    lowerBound: Date,
    upperBound: Date,
    brandProfileId?: string
  ): Promise<CampaignStats> {
    try {
      console.log(lowerBound, upperBound)

      let query: FindOptionsWhere<ICampaign>[] = [
        {
          startDate: Between(lowerBound, upperBound),
        },
        {
          endDate: Between(lowerBound, upperBound),
        },
      ]

      if (typeof brandProfileId === 'string') {
        query[0] = {
          ...query[0],
          brand: {
            id: brandProfileId,
          },
        }

        query[1] = {
          ...query[1],
          brand: {
            id: brandProfileId,
          },
        }
      }

      const campaigns = await this.findAll(query, [
        'participants',
        'participants.deliverables',
      ])

      const result: CampaignStats = {
        totalCampaign: campaigns.length,
        totalCommercialBrand: 0,
        totalCommercialCreator: 0,
        totalToBeGiven: 0,
        totalMargin: 0,
        totalIncentive: 0,
        pendingIncentive: 0,
        totalRevenue: 0,
        totalActiveCampaign: 0,
      }

      campaigns.forEach((value) => {
        result.totalCommercialBrand += value.commercial
        result.totalRevenue += value.commercial
        let totalMargin = 0
        let allLive = true

        value.participants.forEach((participant) => {
          result.totalCommercialCreator +=
            participant.commercialCreator === null
              ? 0
              : participant.commercialCreator
          ;(result.totalToBeGiven +=
            participant.toBePaid === null ? 0 : participant.toBePaid),
            (result.totalMargin +=
              participant.margin === null ? 0 : participant.margin)
          totalMargin += participant.margin === null ? 0 : participant.margin

          participant.deliverables.forEach((deliverable) => {
            if (
              deliverable.status === Enum.CampaignDeliverableStatus.NOT_LIVE
            ) {
              allLive = false
            }
          })
        })
        result.totalIncentive += totalMargin * 0.05
        if (value.incentiveReleased === false) {
          result.pendingIncentive += totalMargin * 0.05
        }

        if (!allLive) {
          result.totalActiveCampaign++
        }
      })

      return result
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { CampaignCRUD }
