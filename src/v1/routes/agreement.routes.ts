import { AgreementController } from '../controller/agreement-controller'
import { Router } from 'express'
import { AgreementService } from '../modules/utils/agreement-service'
import { ZohoSignService } from '../modules/utils/zoho-sign-service'
import { AxiosService } from '../utils'
import { userService } from '../modules/user'
import { influencerProfileService } from '../modules/influencer'
import { agencyProfileService } from '../modules/agency'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'

const agreementRouter = Router()
const agreementController = new AgreementController(
  AgreementService.getInstance(
    userService,
    influencerProfileService,
    agencyProfileService,
    ZohoSignService.getInstance(AxiosService.getInstance())
  )
)

agreementRouter.post(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  agreementController.sendAgreement.bind(agreementController)
)

export default agreementRouter
