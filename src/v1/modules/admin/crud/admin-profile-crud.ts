import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IAdminProfile, IAdminProfileCRUD } from '../interface'

class AdminProfileCRUD
  extends CRUDBase<IAdminProfile>
  implements IAdminProfileCRUD
{
  private static instance: IAdminProfileCRUD | null = null

  static getInstance(AdminProfile: EntityTarget<IAdminProfile>) {
    if (AdminProfileCRUD.instance === null) {
      AdminProfileCRUD.instance = new AdminProfileCRUD(AdminProfile)
    }
    return AdminProfileCRUD.instance
  }

  private constructor(adminProfile: EntityTarget<IAdminProfile>) {
    super(adminProfile)
  }
}

export { AdminProfileCRUD }
