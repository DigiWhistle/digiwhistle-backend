import Router from 'express'
import { PayrollController } from '../controller/payroll-controller'
import { payrollService } from '../modules/payroll'
import { BaseValidator } from '../../utils'
import {
  addPayrollSchema,
  updatePayrollSchema,
  sharePaySlipSchema,
} from '../modules/payroll/validators'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { authorizeAccounts } from '../middleware/authorizeAccounts'
import { employeeProfileService } from '../modules/admin'

const payrollRouter = Router()
const payrollController = new PayrollController(
  payrollService,
  employeeProfileService
)

const addPayrollValidator = new BaseValidator(addPayrollSchema)
const updatePayrollValidator = new BaseValidator(updatePayrollSchema)
const sharePaySlipValidator = new BaseValidator(sharePaySlipSchema)

payrollRouter.post(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  addPayrollValidator.validateInput.bind(addPayrollValidator),
  payrollController.addController.bind(payrollController)
)

payrollRouter.post(
  '/share',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  sharePaySlipValidator.validateInput.bind(sharePaySlipValidator),
  payrollController.sharePaySlipController.bind(payrollController)
)

payrollRouter.patch(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  updatePayrollValidator.validateInput.bind(updatePayrollValidator),
  payrollController.updateController.bind(payrollController)
)

payrollRouter.get(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  payrollController.getAllController.bind(payrollController)
)

payrollRouter.get(
  '/employee',
  verifyToken,
  authorizeUser([Enum.ROLES.EMPLOYEE]),
  payrollController.getAllPayrollByEmployee.bind(payrollController)
)

payrollRouter.get(
  '/download',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  payrollController.generatePaySlipController.bind(payrollController)
)

payrollRouter.get(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  payrollController.getByIdController.bind(payrollController)
)

payrollRouter.delete(
  '/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  payrollController.deleteController.bind(payrollController)
)

payrollRouter.post(
  '/release',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  payrollController.releaseSalaryController.bind(payrollController)
)

export default payrollRouter

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFwV2dBMm1jVWFQNFVkbEFhUzhaTEw4NVZsejIiLCJpYXQiOjE3Mjg4OTI4MDcsImV4cCI6MjA0                                     NDQ2ODgwN30.hUThFSgzMKlHZUEAv5c0gTfP6OKHSR8R3vFu-vPaNaQ\
