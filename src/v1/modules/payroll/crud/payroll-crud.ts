import { EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { IPayroll, IPayrollCRUD } from '../interface'

export class PayrollCRUD extends CRUDBase<IPayroll> implements IPayrollCRUD {
  private static instance: IPayrollCRUD | null = null

  static getInstance = (payroll: EntityTarget<IPayroll>) => {
    if (PayrollCRUD.instance === null) {
      PayrollCRUD.instance = new PayrollCRUD(payroll)
    }
    return PayrollCRUD.instance
  }
  private constructor(payroll: EntityTarget<IPayroll>) {
    super(payroll)
  }

  async incrementIncentive(
    employeeId: string,
    incentive: number
  ): Promise<void> {
    try {
      await this.repository.increment(
        {
          employeeProfile: {
            id: employeeId,
          },
        },
        'incentive',
        incentive
      )
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
