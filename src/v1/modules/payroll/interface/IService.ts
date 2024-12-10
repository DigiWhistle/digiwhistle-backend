import { DeepPartial } from 'typeorm'
import { IBaseService } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IPayrollCRUD, IPayrollHistoryCRUD } from './ICRUD'
import { IPayroll, IPayrollHistory } from './IModel'
import { PayrollWebhookPayload, SharePaySlipRequest } from '../types'
import { Enum } from '../../../../constants'

export interface IPayrollService extends IBaseService<IPayroll, IPayrollCRUD> {
  getAllPayroll(
    searchQuery: string,
    lowerBound: Date,
    upperBound: Date
  ): Promise<IPayroll[]>
  releaseSalary(id: string, idempotencyKey: string): Promise<void>
  getAllPayrollHistory(
    page: number,
    limit: number,
    lowerBound: Date,
    upperBound: Date,
    searchQuery?: string,
    employeeId?: string
  ): Promise<PaginatedResponse<IPayrollHistory>>
  handleWebhook(
    payload: PayrollWebhookPayload,
    event: Enum.WEBHOOK_EVENTS
  ): Promise<void>
  generatePaySlip(id: string): Promise<string>
  sharePaySlip(data: SharePaySlipRequest): Promise<void>
  incrementIncentive(employeeId: string, incentive: number): Promise<void>
}

export interface IPayrollHistoryService
  extends IBaseService<IPayrollHistory, IPayrollHistoryCRUD> {}
