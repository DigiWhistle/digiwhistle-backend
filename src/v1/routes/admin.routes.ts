import { Router } from 'express'
import {
  adminProfileService,
  adminService,
  employeeService,
} from '../modules/admin'
import { AdminController, AdminProfileController } from '../controller'
import { authorizeUser } from '../middleware'
import { Enum } from '../../constants'
import { BaseValidator } from '../../utils'
import {
  addAdminOrEmployeeSchema,
  addAdminProfileSchema,
  updateAdminProfileSchema,
} from '../modules/admin/validators'
import { verifyToken } from '../middleware'
import { userService } from '../modules/user'

const adminRouter = Router()

const adminProfileController = new AdminProfileController(
  adminProfileService,
  userService
)

const adminController = new AdminController(
  adminService,
  employeeService,
  userService
)

const addAdminProfileValidator = new BaseValidator(addAdminProfileSchema)
const updateAdminProfileValidator = new BaseValidator(updateAdminProfileSchema)

const addEmployeeOrAdminValidator = new BaseValidator(addAdminOrEmployeeSchema)

adminRouter.post(
  '/add',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN]),
  addEmployeeOrAdminValidator.validateInput.bind(addEmployeeOrAdminValidator),
  adminController.addAdminOrEmployeeController.bind(adminController)
)

adminRouter.get(
  '/stats',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  adminController.findStatsController.bind(adminController)
)

adminRouter.get(
  '/all',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  adminController.getAllAdminAndEmployees.bind(adminController)
)

adminRouter.post(
  '/profile',
  addAdminProfileValidator.validateInput.bind(addAdminProfileValidator),
  adminProfileController.addController.bind(adminProfileController)
)

adminRouter.get(
  '/profile',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN]),
  adminProfileController.getByUserIdController.bind(adminProfileController)
)

adminRouter.patch(
  '/profile/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN]),
  updateAdminProfileValidator.validateInput.bind(updateAdminProfileValidator),
  adminProfileController.updateController.bind(adminProfileController)
)

export default adminRouter
