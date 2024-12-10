export const shareInvoiceSchema = {
  type: 'object',

  properties: {
    invoiceId: { type: 'string', format: 'uuid', nullable: false },
    emails: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
        nullable: false,
      },
      minItems: 1,
      uniqueItems: true,
    },
    subject: {
      type: 'string',
      nullable: false,
    },
    message: {
      type: 'string',
      nullable: false,
    },
  },
  required: ['emails', 'subject', 'message'],
  additionalProperties: false,
}
