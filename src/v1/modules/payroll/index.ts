import { AxiosService, MailerService } from '../../utils'
import { RazorpayService } from '../../utils/razorpay-service'
import { PayrollCRUD, PayrollHistoryCRUD } from './crud'
import { Payroll, PayrollHistory } from './models'
import { PayrollService } from './service'
import { PayrollHistoryService } from './service'

const payrollService = PayrollService.getInstance(
  PayrollCRUD.getInstance(Payroll),
  RazorpayService.getInstance(AxiosService.getInstance()),
  PayrollHistoryService.getInstance(
    PayrollHistoryCRUD.getInstance(PayrollHistory)
  ),
  MailerService.getInstance()
)

const payrollHistoryService = PayrollHistoryService.getInstance(
  PayrollHistoryCRUD.getInstance(PayrollHistory)
)

export { payrollService, payrollHistoryService }
