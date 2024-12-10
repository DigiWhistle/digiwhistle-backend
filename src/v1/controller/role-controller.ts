import { BaseController } from '../../utils'
import { IRole, IRoleCRUD, IRoleService } from '../modules/user/interface'

export class RoleController extends BaseController<
  IRole,
  IRoleCRUD,
  IRoleService
> {
  constructor(roleService: IRoleService) {
    super(roleService)
  }
}
