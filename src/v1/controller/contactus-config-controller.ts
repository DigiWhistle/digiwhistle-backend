import { Request, Response } from 'express'
import { BaseController, HttpException } from '../../utils'
import {
  IContactUsConfig,
  IContactUsConfigCRUD,
  IContactUsConfigService,
} from '../modules/landing/interface'
import { ContactUsConfigDTO } from '../dtos/contactus-config-dtos'
import { responseHandler } from '../../utils/response-handler'

export class ContactUsConfigController extends BaseController<
  IContactUsConfig,
  IContactUsConfigCRUD,
  IContactUsConfigService
> {
  constructor(contactUsConfigService: IContactUsConfigService) {
    super(contactUsConfigService)
  }

  async getAllController(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.service.findAll(undefined, ['employee'])

      const _data = ContactUsConfigDTO.transformationForAllConfig(data)

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async updateController(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body

      const _data = ContactUsConfigDTO.transformationForAddConfig(data)

      await this.service.insertMany(_data)

      return responseHandler(200, res, 'Done Successfully', {}, req)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
