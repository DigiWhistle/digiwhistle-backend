import { BaseService } from '../../../../utils'
import { IRole, IRoleService } from '../interface'
import { IRoleCRUD } from '../interface'

class RoleService
  extends BaseService<IRole, IRoleCRUD>
  implements IRoleService
{
  private static instance: IRoleService | null = null

  static getInstance(roleCRUD: IRoleCRUD): IRoleService {
    if (RoleService.instance === null) {
      RoleService.instance = new RoleService(roleCRUD)
    }
    return RoleService.instance
  }

  private constructor(roleCRUD: IRoleCRUD) {
    super(roleCRUD)
  }
}
export { RoleService }
