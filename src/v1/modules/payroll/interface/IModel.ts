import { Enum } from '../../../../constants'
import { IEmployeeProfile } from '../../admin/interface'

export interface IPayroll {
  id: string
  employeeProfile: IEmployeeProfile
  basic: number
  hra: number
  others: number
  ctc: number
  employmentType: Enum.EmploymentType
  salaryMonth: number // set %12 after payroll done
  tds: number
  incentive: number // set 0 back after the payroll done
  workingDays: number // set back to default when payroll done
  payrollDate: Date
  fundAccountId: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface IPayrollHistory {
  id: string
  employeeProfile: IEmployeeProfile
  employmentType: Enum.EmploymentType
  ctc: number
  basic: number
  hra: number
  others: number
  workingDays: string
  salaryMonth: string
  incentive: number
  grossPay: number
  tds: number
  finalPay: number
  status: Enum.PaymentStatus
  paymentDate: Date
  createdAt: Date
  updatedAt: Date
}
