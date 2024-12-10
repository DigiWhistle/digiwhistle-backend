import { Request, Response } from 'express'
import { BaseController, errorHandler, IBaseController } from '../../utils'
import {
  ICampaignParticipants,
  ICampaignParticipantsCRUD,
  ICampaignParticipantsService,
} from '../modules/campaign/interface'
import { responseHandler } from '../../utils/response-handler'

class CampaignParticipantsController extends BaseController<
  ICampaignParticipants,
  ICampaignParticipantsCRUD,
  ICampaignParticipantsService
> {
  constructor(service: ICampaignParticipantsService) {
    super(service)
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body

      if (data.roleId === 4) {
        await this.service.add({
          campaign: {
            id: data.campaignId,
          },
          email: data.email,
          influencerProfile: {
            id: data.profileId,
          },
        })
      } else if (data.roleId === 5) {
        await this.service.add({
          campaign: {
            id: data.campaignId,
          },
          email: data.email,
          agencyProfile: {
            id: data.profileId,
          },
        })
      }

      return responseHandler(
        200,
        res,
        'Participant added successfully',
        null,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { CampaignParticipantsController }
