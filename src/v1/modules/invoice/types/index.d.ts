export type ShareInvoiceRequest = {
  invoiceId: string
  emails: string[]
  subject: string
  message: string
}

export type PurchaseInvoiceWebhookPayload = {
  invoiceId: string
  type: string
}
