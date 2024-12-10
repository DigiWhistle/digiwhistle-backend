import { ICRUDBase } from '../../../../utils'
import { IPayroll, IPayrollHistory } from './IModel'

export interface IPayrollCRUD extends ICRUDBase<IPayroll> {
  incrementIncentive(employeeId: string, incentive: number): Promise<void>
}

export interface IPayrollHistoryCRUD extends ICRUDBase<IPayrollHistory> {}
