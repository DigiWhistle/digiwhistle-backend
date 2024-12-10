import { Enum } from '../../../../constants'

export const addPayrollSchema = {
  type: 'object',
  properties: {
    employeeProfile: { type: 'string', format: 'uuid', nullable: false },
    basic: { type: 'number', nullable: false },
    hra: { type: 'number', nullable: false },
    others: { type: 'number', nullable: false },
    ctc: { type: 'number', nullable: false },
    employmentType: {
      type: 'string',
      enum: Object.values(Enum.EmploymentType),
      nullable: false,
    },
  },
  required: [
    'employeeProfile',
    'basic',
    'hra',
    'others',
    'ctc',
    'employmentType',
  ],
  additionalProperties: false,
}

export const updatePayrollSchema = {
  type: 'object',
  properties: {
    basic: { type: 'number', nullable: false },
    hra: { type: 'number', nullable: false },
    others: { type: 'number', nullable: false },
    ctc: { type: 'number', nullable: false },
    employmentType: {
      type: 'string',
      enum: Object.values(Enum.EmploymentType),
      nullable: false,
    },
    tds: { type: 'number', nullable: false },
    workingDays: { type: 'number', nullable: false },
    salaryMonth: { type: 'number', nullable: false },
    incentive: { type: 'number', nullable: false },
  },
  additionalProperties: false,
}

export const sharePaySlipSchema = {
  type: 'object',
  properties: {
    invoiceId: { type: 'string', format: 'uuid', nullable: false },
    emails: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
      },
    },
    subject: { type: 'string', nullable: false },
    message: { type: 'string', nullable: false },
  },
  required: ['invoiceId', 'emails', 'subject', 'message'],
  additionalProperties: false,
}
