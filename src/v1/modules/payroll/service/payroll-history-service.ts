import { BaseService } from '../../../../utils'
import {
  IPayroll,
  IPayrollHistory,
  IPayrollHistoryCRUD,
  IPayrollHistoryService,
} from '../interface'

export class PayrollHistoryService
  extends BaseService<IPayrollHistory, IPayrollHistoryCRUD>
  implements IPayrollHistoryService
{
  private static instance: IPayrollHistoryService | null = null

  static getInstance = (payrollHistoryCRUD: IPayrollHistoryCRUD) => {
    if (PayrollHistoryService.instance === null) {
      PayrollHistoryService.instance = new PayrollHistoryService(
        payrollHistoryCRUD
      )
    }
    return PayrollHistoryService.instance
  }

  private constructor(payrollHistoryCRUD: IPayrollHistoryCRUD) {
    super(payrollHistoryCRUD)
  }
}
