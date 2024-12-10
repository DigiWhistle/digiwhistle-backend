import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import {
  ICreditNote,
  ICreditNoteCRUD,
  ICreditNoteService,
} from '../modules/invoice/interface'
import { Request, Response } from 'express'

export class CreditNoteController extends BaseController<
  ICreditNote,
  ICreditNoteCRUD,
  ICreditNoteService
> {
  constructor(creditNoteService: ICreditNoteService) {
    super(creditNoteService)
  }

  async downloadCreditNoteController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.query

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const url = await this.service.downloadCreditNote(id)

      return responseHandler(
        200,
        res,
        'Downloaded Successfully',
        { url: url },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
