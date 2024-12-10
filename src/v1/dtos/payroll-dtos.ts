import { monthIndexToName, monthsToDays } from '../../constants'
import { IPayroll, IPayrollHistory } from '../modules/payroll/interface'

export class PayrollDTO {
  static transformationForPendingPayrollData(data: IPayroll) {
    const { employeeProfile, salaryMonth, ...payroll } = data

    return {
      name:
        employeeProfile?.firstName +
        (employeeProfile?.lastName ? ' ' + employeeProfile?.lastName : ''),
      email: employeeProfile?.user?.email,
      ...payroll,
      salaryMonth:
        monthIndexToName[salaryMonth] + `(${monthsToDays[salaryMonth]} days)`,
      bankName: employeeProfile?.bankName,
      bankAccountNumber: employeeProfile?.bankAccountNumber,
      bankIfscCode: employeeProfile?.bankIfscCode,
      panNo: employeeProfile?.panNo,
      grossPay: payroll.ctc,
      tds: (payroll.tds / 100) * payroll.ctc,
      finalPay:
        payroll.ctc - (payroll.tds / 100) * payroll.ctc + payroll.incentive,
    }
  }

  static transformationForPaidPayrollData(data: IPayrollHistory) {
    const { employeeProfile, ...payrollHistory } = data

    return {
      name:
        employeeProfile?.firstName +
        (employeeProfile?.lastName ? ' ' + employeeProfile?.lastName : ''),
      email: employeeProfile?.user?.email,
      bankName: employeeProfile?.bankName,
      bankAccountNumber: employeeProfile?.bankAccountNumber,
      bankIfscCode: employeeProfile?.bankIfscCode,
      panNo: employeeProfile?.panNo,
      ...payrollHistory,
    }
  }

  static transformationForEmployeePayroll(data: IPayrollHistory) {
    return {
      salaryMonth: data.salaryMonth,
      workingDays: data.workingDays,
      basic: data.basic,
      hra: data.hra,
      others: data.others,
      ctc: data.ctc,
      tds: data.tds,
      incentive: data.incentive,
      grossPay: data.grossPay,
      finalPay: data.finalPay,
      status: data.status,
      paymentDate: data.paymentDate,
      id: data.id,
    }
  }
}
