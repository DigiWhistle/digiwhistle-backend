import { Router } from 'express'
import { employeeProfileService } from '../modules/admin'
import { EmployeeProfileController } from '../controller/employee-profile-controller'
import { Enum } from '../../constants'
import { authorizeUser, verifyToken } from '../middleware'
import { BaseValidator } from '../../utils'
import {
  addEmployeeProfileSchema,
  updateEmployeeProfileSchema,
} from '../modules/admin/validators'
import { userService } from '../modules/user'

const employeeRouter = Router()

const employeeProfileController = new EmployeeProfileController(
  employeeProfileService,
  userService
)
const addEmployeeProfileValidator = new BaseValidator(addEmployeeProfileSchema)

const updateEmployeeProfileValidator = new BaseValidator(
  updateEmployeeProfileSchema
)

employeeRouter.post(
  '/profile',
  addEmployeeProfileValidator.validateInput.bind(addEmployeeProfileValidator),
  employeeProfileController.addController.bind(employeeProfileController)
)

employeeRouter.get(
  '/profile',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  employeeProfileController.getByUserIdController.bind(
    employeeProfileController
  )
)

employeeRouter.patch(
  '/profile/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.EMPLOYEE, Enum.ROLES.ADMIN]),
  updateEmployeeProfileValidator.validateInput.bind(
    updateEmployeeProfileValidator
  ),
  employeeProfileController.updateController.bind(employeeProfileController)
)

employeeRouter.get(
  '/search',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  employeeProfileController.findEmployeesController.bind(
    employeeProfileController
  )
)

export default employeeRouter
