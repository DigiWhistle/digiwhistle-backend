import { Request, Response } from 'express'
import { errorHandler, HttpException } from '../../utils'
import { IAdminService, IEmployeeService } from '../modules/admin/interface'
import { responseHandler } from '../../utils/response-handler'
import { IUserService } from '../modules/user/interface'
import { AdminDTO } from '../dtos'

class AdminController {
  private readonly adminService: IAdminService
  private readonly employeeService: IEmployeeService
  private readonly userService: IUserService

  constructor(
    adminService: IAdminService,
    employeeService: IEmployeeService,
    userService: IUserService
  ) {
    this.adminService = adminService
    this.employeeService = employeeService
    this.userService = userService
  }

  async addAdminOrEmployeeController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const data = req.body

      const { email, mobileNo } = req.body

      const user = await this.userService.findUserByMobileNoAndEmail(
        mobileNo,
        email
      )

      if (user !== null)
        throw new HttpException(409, 'User already exist with same details')

      if (data.role === 'admin') await this.adminService.addAdmin(req.body)

      if (data.role === 'employee')
        await this.employeeService.addEmployee(req.body)

      return responseHandler(200, res, 'Added Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllAdminAndEmployees(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { page, limit, name } = req.query

      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      const data = await this.userService.findAllAdminAndEmployees(
        parseInt(page),
        parseInt(limit),
        name as string
      )

      const _data = data.data.map((value) => {
        return AdminDTO.transformationForAdminAndEmployee(value)
      })

      return responseHandler(
        200,
        res,
        'Fetched Successfully',
        {
          data: _data,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async findStatsController(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.userService.findOverallUserStats()

      const _data = AdminDTO.transformationForUserStats(data)

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { AdminController }
