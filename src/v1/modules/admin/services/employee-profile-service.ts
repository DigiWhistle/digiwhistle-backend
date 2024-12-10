import { FindOptions, FindOptionsWhere, ILike } from 'typeorm'
import { Enum } from '../../../../constants'
import { BaseService, HttpException } from '../../../../utils'
import { IEmployeeProfile, IEmployeeProfileCRUD } from '../interface'
import { IEmployeeProfileService } from '../interface/IService'

class EmployeeProfileService
  extends BaseService<IEmployeeProfile, IEmployeeProfileCRUD>
  implements IEmployeeProfileService
{
  private static instance: IEmployeeProfileService | null = null

  static getInstance(EmployeeProfileCRUD: IEmployeeProfileCRUD) {
    if (EmployeeProfileService.instance === null) {
      EmployeeProfileService.instance = new EmployeeProfileService(
        EmployeeProfileCRUD
      )
    }

    return EmployeeProfileService.instance
  }

  private constructor(employeeProfileCRUD: IEmployeeProfileCRUD) {
    super(employeeProfileCRUD)
  }

  async findEmployeesByName(name: string): Promise<IEmployeeProfile[]> {
    try {
      const query: FindOptionsWhere<IEmployeeProfile>[] = [
        {
          firstName: ILike(`%${name}%`),
        },
        {
          lastName: ILike(`%${name}%`),
        },
      ]

      const data = await this.crudBase.findAll(query)

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findEmployeesByEmail(email: string): Promise<IEmployeeProfile[]> {
    try {
      const query: FindOptionsWhere<IEmployeeProfile>[] = [
        {
          user: {
            email: ILike(`%${email}%`),
          },
        },
      ]

      const data = await this.crudBase.findAll(query)

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { EmployeeProfileService }
