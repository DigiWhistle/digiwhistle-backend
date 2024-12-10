import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IEmployeeProfile, IEmployeeProfileCRUD } from '../interface'

class EmployeeProfileCRUD
  extends CRUDBase<IEmployeeProfile>
  implements IEmployeeProfileCRUD
{
  private static instance: IEmployeeProfileCRUD | null = null

  static getInstance(employeeProfile: EntityTarget<IEmployeeProfile>) {
    if (EmployeeProfileCRUD.instance === null) {
      EmployeeProfileCRUD.instance = new EmployeeProfileCRUD(employeeProfile)
    }
    return EmployeeProfileCRUD.instance
  }

  private constructor(employeeProfile: EntityTarget<IEmployeeProfile>) {
    super(employeeProfile)
  }
}

export { EmployeeProfileCRUD }
