import { IAdminCRUD } from '../interface/ICRUD'
import { AddAdmin } from '../types'
import { AppDataSource } from '../../../../config'
import { User } from '../../user/models'
import { AdminProfile } from '../models'
import { HttpException } from '../../../../utils'

class AdminCRUD implements IAdminCRUD {
  private static instance: IAdminCRUD | null = null

  static getInstance = () => {
    if (AdminCRUD.instance === null) {
      AdminCRUD.instance = new AdminCRUD()
    }
    return AdminCRUD.instance
  }

  private constructor() {}

  async addAdmin(data: AddAdmin): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()

      const userRepository = queryRunner.manager.getRepository(User)
      await userRepository.save({
        email: data.email,
        id: data.userId,
        role: {
          id: 1,
        },
        isVerified: true,
        isApproved: true,
        isPaused: false,
      })

      const adminProfileRepository =
        queryRunner.manager.getRepository(AdminProfile)

      await adminProfileRepository.save({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        user: {
          id: data.userId,
        },
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

export { AdminCRUD }
