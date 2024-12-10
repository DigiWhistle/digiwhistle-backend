import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import {
  IPurchaseInvoice,
  IPurchaseInvoiceCRUD,
  IPurchaseInvoiceService,
} from '../modules/invoice/interface'
import { Request, Response } from 'express'
import { IExtendedRequest } from '../interface'
import { Enum } from '../../constants'
import { PurchaseInvoiceDTO } from '../dtos/purchase-invoice-dtos'
import { IUserService } from '../modules/user/interface'
import { v4 as uuidv4 } from 'uuid'
export class PurchaseInvoiceController extends BaseController<
  IPurchaseInvoice,
  IPurchaseInvoiceCRUD,
  IPurchaseInvoiceService
> {
  private readonly userService: IUserService
  constructor(
    purchaseInvoiceService: IPurchaseInvoiceService,
    userService: IUserService
  ) {
    super(purchaseInvoiceService)
    this.userService = userService
  }

  async getAllController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { page, limit } = req.query
      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      const { invoiceNo } = req.query
      const { startDate, endDate } = req.query

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      const upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      const { user } = req

      if (
        user.role.id === Enum.ROLES.ADMIN ||
        user.role.id === Enum.ROLES.EMPLOYEE
      ) {
        const data = await this.service.getAllPurchaseInvoices(
          parseInt(page),
          parseInt(limit),
          lowerBound,
          upperBound,
          invoiceNo as string
        )

        const _data = data.data.map((value) => {
          return PurchaseInvoiceDTO.transformationForAdmin(value)
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
      } else if (user.role.id === Enum.ROLES.INFLUENCER) {
        const influencer = await this.userService.findOne({ id: user.id }, [
          'influencerProfile',
        ])

        if (influencer === null)
          throw new HttpException(404, 'Influencer Not Found')

        const data = await this.service.getAllPurchaseInvoices(
          parseInt(page),
          parseInt(limit),
          lowerBound,
          upperBound,
          invoiceNo as string,
          influencer.influencerProfile?.id,
          undefined
        )

        const _data = data.data.map((value) => {
          return PurchaseInvoiceDTO.transformationForInfluencerAndAgency(value)
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
      } else if (user.role.id === Enum.ROLES.AGENCY) {
        const agency = await this.userService.findOne({ id: user.id }, [
          'agencyProfile',
        ])

        if (agency === null) throw new HttpException(404, 'Agency Not Found')

        const data = await this.service.getAllPurchaseInvoices(
          parseInt(page),
          parseInt(limit),
          lowerBound,
          upperBound,
          invoiceNo as string,
          undefined,
          agency.agencyProfile?.id
        )

        const _data = data.data.map((value) => {
          return PurchaseInvoiceDTO.transformationForInfluencerAndAgency(value)
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
      }

      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async shareInvoiceController(req: Request, res: Response): Promise<Response> {
    try {
      await this.service.sharePurchaseInvoice(req.body)
      return responseHandler(200, res, 'Shared Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async downloadPurchaseInvoiceReportController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { startDate, endDate } = req.body

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      const upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      const url = await this.service.downloadPurchaseInvoiceReport(
        lowerBound,
        upperBound
      )

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

  async releaseSalaryController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.query

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const idempotencyKey = req.headers['x-idempotency-key'] as string

      if (!idempotencyKey) {
        throw new HttpException(400, 'Invalid Idempotency Key')
      }

      await this.service.releasePayment(id, idempotencyKey)

      return responseHandler(200, res, 'Payment Done Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
