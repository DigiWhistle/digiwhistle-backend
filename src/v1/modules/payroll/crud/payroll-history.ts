import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IPayrollHistory, IPayrollHistoryCRUD } from '../interface'

export class PayrollHistoryCRUD
  extends CRUDBase<IPayrollHistory>
  implements IPayrollHistoryCRUD
{
  private static instance: IPayrollHistoryCRUD | null = null

  static getInstance = (payrollHistory: EntityTarget<IPayrollHistory>) => {
    if (PayrollHistoryCRUD.instance === null) {
      PayrollHistoryCRUD.instance = new PayrollHistoryCRUD(payrollHistory)
    }
    return PayrollHistoryCRUD.instance
  }
  private constructor(payrollHistory: EntityTarget<IPayrollHistory>) {
    super(payrollHistory)
  }
}
