import { IEmployeeCRUD } from '../interface/ICRUD'
import { AddEmployee } from '../types'
import { AppDataSource } from '../../../../config'
import { User } from '../../user/models'
import { EmployeeProfile } from '../models'
import { HttpException } from '../../../../utils'

class EmployeeCRUD implements IEmployeeCRUD {
  private static instance: IEmployeeCRUD | null = null

  static getInstance = () => {
    if (EmployeeCRUD.instance === null) {
      EmployeeCRUD.instance = new EmployeeCRUD()
    }
    return EmployeeCRUD.instance
  }

  private constructor() {}

  async addEmployee(data: AddEmployee): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()

      const userRepository = queryRunner.manager.getRepository(User)

      await userRepository.save({
        email: data.email,
        id: data.userId,
        role: {
          id: 2,
        },
        isVerified: true,
        isApproved: true,
        isPaused: false,
      })

      const employeeProfileRepository =
        queryRunner.manager.getRepository(EmployeeProfile)

      await employeeProfileRepository.save({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        user: {
          id: data.userId,
        },
        designation: data.designation,
      })

      await queryRunner.commitTransaction()
    } catch (e) {
      await queryRunner.rollbackTransaction()
      throw new HttpException(e?.errorCode, e?.message)
    } finally {
      await queryRunner.release()
    }
  }
}

export { EmployeeCRUD }
