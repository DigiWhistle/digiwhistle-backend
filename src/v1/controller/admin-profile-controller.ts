import { BaseController, errorHandler, HttpException } from '../../utils'
import { IBaseController } from '../../utils/base-controller'
import { responseHandler } from '../../utils/response-handler'
import { IExtendedRequest } from '../interface'
import {
  IAdminProfile,
  IAdminProfileCRUD,
  IAdminProfileService,
} from '../modules/admin/interface'
import { Request, Response } from 'express'
import { IUserService } from '../modules/user/interface'

export class AdminProfileController extends BaseController<
  IAdminProfile,
  IAdminProfileCRUD,
  IAdminProfileService
> {
  private readonly userService: IUserService

  constructor(
    adminProfileService: IAdminProfileService,
    userService: IUserService
  ) {
    super(adminProfileService)
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
}
