import Router from 'express'
import { AxiosService, RazorpayService } from '../utils'
import { RazorpayController } from '../controller/razorpay-controller'
import { payrollService } from '../modules/payroll'
import { purchaseInvoiceService } from '../modules/invoice'

const razorpayRouter = Router()
const razorpayController = new RazorpayController(
  RazorpayService.getInstance(AxiosService.getInstance()),
  payrollService,
  purchaseInvoiceService
)

razorpayRouter.post(
  '/webhook',
  razorpayController.webhook.bind(razorpayController)
)

export default razorpayRouter
