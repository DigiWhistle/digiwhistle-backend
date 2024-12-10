import { Request, Response } from 'express'
import { IRazorpayService } from '../utils/razorpay-service'
import { errorHandler } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import { IPayrollService } from '../modules/payroll/interface'
import { IPurchaseInvoiceService } from '../modules/invoice/interface'

export class RazorpayController {
  private readonly razorpayService: IRazorpayService
  private readonly payrollService: IPayrollService
  private readonly purchaseInvoiceService: IPurchaseInvoiceService
  constructor(
    razorpayService: IRazorpayService,
    payrollService: IPayrollService,
    purchaseInvoiceService: IPurchaseInvoiceService
  ) {
    this.razorpayService = razorpayService
    this.payrollService = payrollService
    this.purchaseInvoiceService = purchaseInvoiceService
  }

  async webhook(req: Request, res: Response): Promise<Response> {
    try {
      const resp = await this.razorpayService.verifyWebhook(
        req.body,
        req.headers['x-razorpay-signature'] as string
      )

      if (resp) {
        const body = req.body
        const type = body.payload.payout.entity.notes.type
        const notes = body.payload.payout.entity.notes

        if (type === 'payroll') {
          await this.payrollService.handleWebhook(notes, body.event)
        } else if (type === 'purchase_invoice') {
          await this.purchaseInvoiceService.handleWebhook(notes, body.event)
        }
      }

      return responseHandler(200, res, 'Webhook Received Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
