import { Router } from 'express'
import { brandProfileService } from '../modules/brands'
import { BrandProfileController } from '../controller'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { BaseValidator } from '../../utils'
import {
  addBrandProfileSchema,
  updateBrandProfileSchema,
} from '../modules/brands/validators'
import { userService } from '../modules/user'

const brandRouter = Router()

const brandProfileController = new BrandProfileController(
  brandProfileService,
  userService
)
const addBrandProfileValidator = new BaseValidator(addBrandProfileSchema)
const updateBrandProfileValidator = new BaseValidator(updateBrandProfileSchema)

brandRouter.post(
  '/profile',
  addBrandProfileValidator.validateInput.bind(addBrandProfileValidator),
  brandProfileController.addController.bind(brandProfileController)
)

brandRouter.get(
  '/profile',
  verifyToken,
  brandProfileController.getByUserIdController.bind(brandProfileController)
)

brandRouter.get(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  brandProfileController.getAllBrandsController.bind(brandProfileController)
)

brandRouter.get(
  '/list',
  brandProfileController.getBrandsListController.bind(brandProfileController)
)

brandRouter.get(
  '/search',
  verifyToken,
  brandProfileController.findBrandsController.bind(brandProfileController)
)

brandRouter.patch(
  '/profile/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.BRAND, Enum.ROLES.EMPLOYEE, Enum.ROLES.ADMIN]),
  updateBrandProfileValidator.validateInput.bind(updateBrandProfileValidator),
  brandProfileController.updateController.bind(brandProfileController)
)

export default brandRouter
