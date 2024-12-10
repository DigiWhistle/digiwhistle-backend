import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import {
  ICampaignDeliverables,
  ICampaignDeliverablesCRUD,
  ICampaignDeliverablesService,
} from '../modules/campaign/interface'
import { Request, Response } from 'express'

class CampaignDeliverablesController extends BaseController<
  ICampaignDeliverables,
  ICampaignDeliverablesCRUD,
  ICampaignDeliverablesService
> {
  constructor(service: ICampaignDeliverablesService) {
    super(service)
  }

  async deleteManyController(req: Request, res: Response): Promise<Response> {
    try {
      let ids = req.body

      if (!Array.isArray(ids))
        throw new HttpException(400, 'Invalid Request Body')

      await this.service.deleteMany(ids)
      return responseHandler(200, res, 'Deleted Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { CampaignDeliverablesController }
