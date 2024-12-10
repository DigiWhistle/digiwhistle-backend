import { Enum } from '../../../../constants'

const addSaleInvoiceSchema = {
  type: 'object',
  properties: {
    campaign: { type: 'string', format: 'uuid', nullable: false },
    gstTin: { type: 'string', nullable: false },
    invoiceNo: { type: 'string', nullable: false },
    invoiceDate: { type: 'string', format: 'date-time', nullable: false },
    amount: { type: 'number', nullable: false },
    sgst: { type: 'number', nullable: false },
    cgst: { type: 'number', nullable: false },
    igst: { type: 'number', nullable: false },
    total: { type: 'number', nullable: false },
    tds: { type: 'number', nullable: false },
    received: { type: 'number', nullable: false },
    balanceAmount: { type: 'number', nullable: false },
    month: { type: 'string', nullable: false },
    paymentStatus: {
      type: 'string',
      enum: [...Object.values(Enum.InvoiceStatus)],
      nullable: false,
    },
  },
  required: [
    'campaign',
    'gstTin',
    'invoiceNo',
    'invoiceDate',
    'amount',
    'sgst',
    'cgst',
    'igst',
    'total',
    'tds',
    'received',
    'balanceAmount',
    'month',
    'paymentStatus',
  ],
  additionalProperties: false,
}

const updateSaleInvoiceSchema = {
  type: 'object',
  properties: {
    gstTin: { type: 'string', nullable: false },
    invoiceNo: { type: 'string', nullable: false },
    invoiceDate: { type: 'string', format: 'date-time', nullable: false },
    amount: { type: 'number', nullable: false },
    sgst: { type: 'number', nullable: false },
    cgst: { type: 'number', nullable: false },
    igst: { type: 'number', nullable: false },
    total: { type: 'number', nullable: false },
    tds: { type: 'number', nullable: false },
    received: { type: 'number', nullable: false },
    balanceAmount: { type: 'number', nullable: false },
    month: { type: 'string', nullable: false },
    paymentStatus: {
      type: 'string',
      enum: [...Object.values(Enum.InvoiceStatus)],
      nullable: false,
    },
  },
  additionalProperties: false,
}

export { addSaleInvoiceSchema, updateSaleInvoiceSchema }
