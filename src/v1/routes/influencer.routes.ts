import { Router } from 'express'
import {
  influencerProfileService,
  influencerService,
  influencerStatsService,
} from '../modules/influencer'
import { InfluencerProfileController } from '../controller/influencer-profile-controller'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { BaseValidator } from '../../utils'
import {
  addInfluencerProfileSchema,
  updateInfluencerProfileSchema,
  inviteInfluencerSchema,
  addInfluencerSchema,
} from '../modules/influencer/validators'
import { userService } from '../modules/user'
import { InfluencerController } from '../controller'

const influencerRouter = Router()

const influencerProfileController = new InfluencerProfileController(
  influencerProfileService,
  userService,
  influencerStatsService
)

const influencerController = new InfluencerController(
  influencerService,
  influencerStatsService,
  userService
)

const addInfluencerProfileValidator = new BaseValidator(
  addInfluencerProfileSchema
)

const updateInfluencerProfileValidator = new BaseValidator(
  updateInfluencerProfileSchema
)

const addInfluencerValidator = new BaseValidator(addInfluencerSchema)
const inviteInfluencerValidator = new BaseValidator(inviteInfluencerSchema)

influencerRouter.post(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  addInfluencerValidator.validateInput.bind(addInfluencerValidator),
  influencerController.addInfluencerController.bind(influencerController)
)

influencerRouter.get(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  influencerController.getAllInfluencerController.bind(influencerController)
)

influencerRouter.get(
  '/list',
  influencerController.getInfluencersListController.bind(influencerController)
)

influencerRouter.get(
  '/explore',
  verifyToken,
  influencerController.exploreInfluencerController.bind(influencerController)
)

influencerRouter.get(
  '/stats',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  influencerController.getInfluencerStatsController.bind(influencerController)
)

influencerRouter.get(
  '/request',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  influencerController.getAllInfluencerRequestsController.bind(
    influencerController
  )
)

influencerRouter.post(
  '/invite',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  inviteInfluencerValidator.validateInput.bind(inviteInfluencerValidator),
  influencerController.inviteInfluencerController.bind(influencerController)
)

influencerRouter.post(
  '/profile',
  addInfluencerProfileValidator.validateInput.bind(
    addInfluencerProfileValidator
  ),
  influencerProfileController.addController.bind(influencerProfileController)
)

influencerRouter.get(
  '/profile',
  verifyToken,
  influencerProfileController.getByUserIdController.bind(
    influencerProfileController
  )
)

influencerRouter.get(
  '/profile/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.INFLUENCER, Enum.ROLES.EMPLOYEE, Enum.ROLES.ADMIN]),
  influencerProfileController.getByIdController.bind(
    influencerProfileController
  )
)

influencerRouter.patch(
  '/profile/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.INFLUENCER, Enum.ROLES.EMPLOYEE, Enum.ROLES.ADMIN]),
  updateInfluencerProfileValidator.validateInput.bind(
    updateInfluencerProfileValidator
  ),
  influencerProfileController.updateController.bind(influencerProfileController)
)

export default influencerRouter
