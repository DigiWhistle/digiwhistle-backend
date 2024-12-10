import { Router } from 'express'
import { RemarksController } from '../controller'
import { remarksService } from '../modules/admin'
import { BaseValidator } from '../../utils'
import {
  addRemarksSchema,
  updateRemarksSchema,
} from '../modules/admin/validators'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'

const remarksRouter = Router()
const remarksController = new RemarksController(remarksService)

const addRemarksValidator = new BaseValidator(addRemarksSchema)
const updateRemarksValidator = new BaseValidator(updateRemarksSchema)

remarksRouter.post(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  addRemarksValidator.validateInput.bind(addRemarksValidator),
  remarksController.addController.bind(remarksController)
)

remarksRouter.put(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  updateRemarksValidator.validateInput.bind(updateRemarksValidator),
  remarksController.updateController.bind(remarksController)
)

remarksRouter.get(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  remarksController.getRemarksByUserIdController.bind(remarksController)
)

remarksRouter.delete(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  remarksController.deleteController.bind(remarksController)
)

remarksRouter.delete(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  remarksController.deleteController.bind(remarksController)
)

export default remarksRouter
