import { HttpException } from '../../../../utils'
import { IMailerService } from '../../../utils'
import { IGoogleAuthService } from '../../auth/interface'
import { IRoleService } from '../../user/interface'
import { IEmployeeCRUD, IEmployeeService } from '../interface'
import { AddAdminOrEmployeeInput } from '../types'

class EmployeeService implements IEmployeeService {
  private readonly mailerService: IMailerService
  private readonly googleAuthService: IGoogleAuthService
  private readonly roleService: IRoleService
  private readonly employeeCRUD: IEmployeeCRUD

  private static instance: IEmployeeService | null = null

  static getInstance = (
    mailerService: IMailerService,
    googleAuthService: IGoogleAuthService,
    roleService: IRoleService,
    employeeCRUD: IEmployeeCRUD
  ) => {
    if (EmployeeService.instance === null) {
      EmployeeService.instance = new EmployeeService(
        mailerService,
        googleAuthService,
        roleService,
        employeeCRUD
      )
    }
    return EmployeeService.instance
  }

  private constructor(
    mailerService: IMailerService,
    googleAuthService: IGoogleAuthService,
    roleService: IRoleService,
    employeeCRUD: IEmployeeCRUD
  ) {
    this.mailerService = mailerService
    this.googleAuthService = googleAuthService
    this.roleService = roleService
    this.employeeCRUD = employeeCRUD
  }

  async addEmployee(data: AddAdminOrEmployeeInput): Promise<void> {
    const { uid } = await this.googleAuthService
      .createUser(data.email)
      .catch((err) => {
        throw new HttpException(500, err?.message ?? 'Internal Server Error')
      })

    try {
      const _role = await this.roleService.findOne({ name: data.role }, [])

      if (_role === null) throw new HttpException(400, 'Invalid Role')

      await this.employeeCRUD.addEmployee({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        roleId: _role.id,
        userId: uid,
        email: data.email,
        designation: data.designation,
      })

      this.mailerService
        .sendMail(
          data.email,
          'You are invited to Join Digiwhistle',
          `<p>You are invited to Join your team, please login at the following link:</p><p>${process.env.FRONTEND_URL}/login</p><p> Your credentials are:</p><p>email: ${data.email}<br>password: 'digiwhistle@123'</p>`
        )
        .then()
        .catch((e) => {
          console.log(e)
        })
    } catch (e) {
      await this.googleAuthService.deleteUser(uid)
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }
}
export { EmployeeService }
