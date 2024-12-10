export type PayrollWebhookPayload = {
  type: string
  payrollId: string
  payrollHistoryId: string
  presentSalaryMonth: number
  payrollDate: Date
  incentive: number
}

export type SharePaySlipRequest = {
  emails: string[]
  subject: string
  message: string
  invoiceId: string
}
