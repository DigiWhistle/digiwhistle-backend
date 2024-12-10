import { Enum } from '../../../../constants'

const contactUsFormSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    followersCount: { type: 'string', nullable: true },
    profileLink: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: true },
    message: { type: 'string', nullable: true },
    personType: {
      type: 'string',
      enum: Object.values(Enum.PersonType),
    },
  },
  required: ['name', 'email', 'personType'],
  additionalProperties: false,
}

const contactUsConfigSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      followersCount: { type: 'string', nullable: true },
      employees: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            email: { type: 'string', nullable: false },
            id: { type: 'string', nullable: false },
          },
          required: ['email', 'id'],
          additionalProperties: false,
        },
      },
    },
    required: ['followersCount', 'employees'],
    additionalProperties: false,
  },
}

export { contactUsFormSchema, contactUsConfigSchema }
