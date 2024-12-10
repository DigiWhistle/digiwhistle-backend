import { HttpException } from '../../../../utils'
import {
  IInstagramService,
  ITwitterService,
  IYoutubeService,
} from '../../influencer/interface'
import { ICampaignService } from '../interface'
import { ICampaignInsightsService } from '../interface/IServices'

class CampaignInsightsService implements ICampaignInsightsService {
  private static instance: ICampaignInsightsService | null = null
  private readonly campaignService: ICampaignService
  private readonly instagramService: IInstagramService
  private readonly youtubeService: IYoutubeService
  private readonly twitterService: ITwitterService

  constructor(
    campaignService: ICampaignService,
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService
  ) {
    this.campaignService = campaignService
    this.instagramService = instagramService
    this.youtubeService = youtubeService
    this.twitterService = twitterService
  }

  static getInstance = (
    campaignService: ICampaignService,
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService
  ) => {
    if (CampaignInsightsService.instance === null) {
      CampaignInsightsService.instance = new CampaignInsightsService(
        campaignService,
        instagramService,
        youtubeService,
        twitterService
      )
    }
    return CampaignInsightsService.instance
  }

  async updateCampaignInsights(campaignId: string) {
    try {
      const campaign = this.campaignService.findOne({ id: campaignId }, [
        'participants',
        'participants.deliverables',
      ])
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
