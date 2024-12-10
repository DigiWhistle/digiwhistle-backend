import {
  BaseController,
  errorHandler,
  HttpException,
  IBaseController,
} from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import { RemarksDTO } from '../dtos/remarks-dtos'
import { IExtendedRequest } from '../interface'
import {
  IRemarks,
  IRemarksCRUD,
  IRemarksService,
} from '../modules/admin/interface'
import { Request, Response } from 'express'

export class RemarksController extends BaseController<
  IRemarks,
  IRemarksCRUD,
  IRemarksService
> {
  private readonly remarksService: IRemarksService

  constructor(remarksService: IRemarksService) {
    super(remarksService)
  }

  async addController(req: IExtendedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user.id
      const data = await this.service.add({ remarker: userId, ...req.body })
      return responseHandler(201, res, 'Added Successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getRemarksByUserIdController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.query

      if (typeof userId !== 'string')
        throw new HttpException(400, 'Invalid UserId')

      const data = await this.service.findAll(
        {
          userId: userId,
        },
        ['remarker', 'remarker.employeeProfile', 'remarker.adminProfile'],
        { createdAt: 'DESC' }
      )

      const _data = RemarksDTO.transformationForRemarksByUserId(data)

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async deleteController(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { userId } = req.query

      if (typeof id === 'string') await this.service.delete({ id })
      else if (typeof userId === 'string')
        await this.service.clearAllRemarksByUserId(userId)

      return responseHandler(200, res, 'Deleted Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
