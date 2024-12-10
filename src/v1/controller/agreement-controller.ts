import { Request, Response } from 'express'
import { IAgreementService } from '../modules/utils/agreement-service'
import { errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'

export class AgreementController {
  private readonly agreementService: IAgreementService
  constructor(agreementService: IAgreementService) {
    this.agreementService = agreementService
  }

  public async sendAgreement(req: Request, res: Response) {
    try {
      const userId = req.body?.userId

      if (typeof userId !== 'string')
        throw new HttpException(400, 'Invalid UserId')

      await this.agreementService.sendAgreement(userId)

      return responseHandler(200, res, 'Agreement sent', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
