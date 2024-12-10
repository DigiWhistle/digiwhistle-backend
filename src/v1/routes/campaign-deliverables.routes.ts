import { campaignDeliverablesService } from '../modules/campaign'
import { Router } from 'express'
import { CampaignDeliverablesController } from '../controller/campaign-deliverables-controller'

const campaignDeliverablesController = new CampaignDeliverablesController(
  campaignDeliverablesService
)

const campaignDeliverableRouter = Router()

campaignDeliverableRouter.delete(
  '/',
  campaignDeliverablesController.deleteManyController.bind(
    campaignDeliverablesController
  )
)

campaignDeliverableRouter.delete(
  '/:id',
  campaignDeliverablesController.deleteController.bind(
    campaignDeliverablesController
  )
)

export default campaignDeliverableRouter
