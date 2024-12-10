import { Router } from 'express'
import { CampaignController } from '../controller/campaign-controller'
import { userService } from '../modules/user'
import {
  campaignService,
  campaignParticipantsService,
  campaignDeliverablesService,
} from '../modules/campaign'
import {
  addCampaignSchema,
  updateCampaignSchema,
  updateCampaignCardsSchema,
} from '../modules/campaign/validators'
import { BaseValidator } from '../../utils'
import { Enum } from '../../constants'
import { authorizeUser, verifyToken } from '../middleware'

const campaignRouter = Router()
const campaignController = new CampaignController(
  campaignService,
  campaignParticipantsService,
  campaignDeliverablesService,
  userService
)

const addCampaignValidator = new BaseValidator(addCampaignSchema)
const updateCampaignValidator = new BaseValidator(updateCampaignSchema)
const updateCampaignCardsValidator = new BaseValidator(
  updateCampaignCardsSchema
)

campaignRouter.post(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  addCampaignValidator.validateInput.bind(addCampaignValidator),
  campaignController.addController.bind(campaignController)
)

campaignRouter.post(
  '/release/incentive',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  campaignController.releaseIncentive.bind(campaignController)
)

campaignRouter.get(
  '/report',
  campaignController.generateBrandReport.bind(campaignController)
)

campaignRouter.get(
  '/',
  verifyToken,
  campaignController.getAllController.bind(campaignController)
)

campaignRouter.patch(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  updateCampaignValidator.validateInput.bind(updateCampaignValidator),
  campaignController.updateController.bind(campaignController)
)

campaignRouter.get(
  '/stats',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.BRAND,
    Enum.ROLES.AGENCY,
    Enum.ROLES.INFLUENCER,
  ]),
  campaignController.getAllStatsController.bind(campaignController)
)

campaignRouter.delete(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  campaignController.deleteController.bind(campaignController)
)

campaignRouter.put(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  updateCampaignCardsValidator.validateInput.bind(updateCampaignCardsValidator),
  campaignController.updateCardsController.bind(campaignController)
)

campaignRouter.get(
  '/search',
  verifyToken,
  campaignController.searchCampaign.bind(campaignController)
)

campaignRouter.get(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  campaignController.getByIdController.bind(campaignController)
)

campaignRouter.post(
  '/sendEmail',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  campaignController.sendConfirmationEmail.bind(campaignController)
)

export default campaignRouter
