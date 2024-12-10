import { Router } from 'express'
import { CampaignParticipantsController } from '../controller/campaign-participants-controller'
import { campaignParticipantsService } from '../modules/campaign'

const campaignParticipantController = new CampaignParticipantsController(
  campaignParticipantsService
)

const campaignParticipantRouter = Router()

campaignParticipantRouter.delete(
  '/:id',
  campaignParticipantController.deleteController.bind(
    campaignParticipantController
  )
)

export default campaignParticipantRouter
