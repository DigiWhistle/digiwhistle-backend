import { Router } from 'express'
import { roleService } from '../modules/user'
import { RoleController } from '../controller/role-controller'

const roleRouter = Router()
const roleController = new RoleController(roleService)

roleRouter.get('/', roleController.getAllController.bind(roleController))

export default roleRouter
