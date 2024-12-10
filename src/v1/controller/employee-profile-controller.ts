import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import { IExtendedRequest } from '../interface'
import {
  IEmployeeProfile,
  IEmployeeProfileCRUD,
  IEmployeeProfileService,
} from '../modules/admin/interface'
import { Request, Response } from 'express'
import { IUserService } from '../modules/user/interface'

export class EmployeeProfileController extends BaseController<
  IEmployeeProfile,
  IEmployeeProfileCRUD,
  IEmployeeProfileService
> {
  private readonly userService: IUserService

  constructor(
    employeeProfileService: IEmployeeProfileService,
    userService: IUserService
  ) {
    super(employeeProfileService)
    this.userService = userService
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.findUserProfileByMobileNoOrUserId(
        req.body.mobileNo,
        req.body.user
      )

      if (user !== null)
        throw new HttpException(
          400,
          'user with same details already exists, pls use different details'
        )

      const data = await this.service.add(req.body)
      return responseHandler(
        201,
        res,
        'Request Submitted Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getByUserIdController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user.id
      const profile = await this.service.findOne({
        user: {
          id: userId,
        },
      })
      let user: any = req.user
      delete user.role

      return responseHandler(
        200,
        res,
        'Profile Fetched!!',
        {
          ...profile,
          user: req.user,
        },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async updateController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params?.id

      if (typeof id !== 'string') throw new HttpException(400, 'Missing Id!!')

      const data = await this.service.update({ id: id }, req.body, ['user'])

      return responseHandler(200, res, 'Updated Successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async findEmployeesController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { name, email } = req.query

      if (typeof name === 'string') {
        const data = await this.service.findEmployeesByName(name)

        const _data = data.map((value) => {
          return {
            name:
              value.firstName +
              (value.lastName === null ? '' : ' ' + value.lastName),
            id: value.id,
          }
        })

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      }

      if (typeof email === 'string') {
        const data = await this.service.findEmployeesByEmail(email)

        const _data = data.map((value) => {
          return {
            name:
              value.firstName +
              (value.lastName === null ? '' : ' ' + value.lastName),
            email: value.user.email,
            id: value.id,
          }
        })

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      }

      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
