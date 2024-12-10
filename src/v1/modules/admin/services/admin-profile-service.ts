import { BaseService, HttpException } from '../../../../utils'
import { IAdminProfile, IAdminProfileCRUD } from '../interface'
import { IAdminProfileService } from '../interface/IService'

class AdminProfileService
  extends BaseService<IAdminProfile, IAdminProfileCRUD>
  implements IAdminProfileService
{
  private static instance: IAdminProfileService | null = null

  static getInstance(adminProfileCRUD: IAdminProfileCRUD) {
    if (AdminProfileService.instance === null) {
      AdminProfileService.instance = new AdminProfileService(adminProfileCRUD)
    }

    return AdminProfileService.instance
  }

  private constructor(adminProfileCRUD: IAdminProfileCRUD) {
    super(adminProfileCRUD)
  }
}

export { AdminProfileService }
