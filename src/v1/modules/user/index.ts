import { RoleCRUD, UserCRUD } from './crud'
import { Role, User } from './models'
import { RoleService, UserService } from './service'

const roleCRUD = RoleCRUD.getInstance(Role)
const roleService = RoleService.getInstance(roleCRUD)

const userCRUD = UserCRUD.getInstance(User)
const userService = UserService.getInstance(userCRUD)

export { roleService, userService }
