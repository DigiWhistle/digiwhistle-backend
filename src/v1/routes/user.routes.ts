import { Router } from 'express'
import { UserController } from '../controller/user-controller'
import { userService } from '../modules/user'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { googleAuthService } from '../modules/auth'

const userController = new UserController(userService, googleAuthService)
const userRouter = Router()

userRouter.get('/', verifyToken, userController.getUser.bind(userController))

userRouter.post(
  '/approve',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.approveUser.bind(userController)
)

userRouter.post(
  '/pause',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.pauseUser.bind(userController)
)

userRouter.post(
  '/reject',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.rejectUser.bind(userController)
)

userRouter.post(
  '/revert',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.revertAction.bind(userController)
)

userRouter.get(
  '/search',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.findUsersController.bind(userController)
)

userRouter.delete(
  '/',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  userController.deleteUser.bind(userController)
)

export default userRouter
