import { ContactUsController } from '../controller'
import { contactUsFormService } from '../modules/landing'
import { BaseValidator } from '../../utils'
import { Router } from 'express'
import { contactUsFormSchema } from '../modules/landing/validators'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { ContactUsConfigController } from '../controller/contactus-config-controller'
import { contactUsConfigService } from '../modules/landing'
import { contactUsConfigSchema } from '../modules/landing/validators'

const contactUsConfigController = new ContactUsConfigController(
  contactUsConfigService
)

const contactUsConfigValidator = new BaseValidator(contactUsConfigSchema)

const contactUsController = new ContactUsController(contactUsFormService)
const contactUsValidator = new BaseValidator(contactUsFormSchema)

const contactUsRouter = Router()

contactUsRouter.post(
  '/',
  contactUsValidator.validateInput.bind(contactUsValidator),
  contactUsController.addController.bind(contactUsController)
)

contactUsRouter.get(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  contactUsController.getAllPaginated.bind(contactUsController)
)

contactUsRouter.post(
  '/view',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  contactUsController.setViewedController.bind(contactUsController)
)

contactUsRouter.delete(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  contactUsController.deleteController.bind(contactUsController)
)

contactUsRouter.put(
  '/config',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN]),
  contactUsConfigValidator.validateInput.bind(contactUsConfigValidator),
  contactUsConfigController.updateController.bind(contactUsConfigController)
)

contactUsRouter.get(
  '/config',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN]),
  contactUsConfigController.getAllController.bind(contactUsConfigController)
)

export default contactUsRouter
