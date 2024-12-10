const addRemarksSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', nullable: false },
    userId: { type: 'string', nullable: false },
  },
  required: ['message', 'userId'],
  additionalProperties: false,
}

const updateRemarksSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', nullable: false },
  },
  additionalProperties: false,
}

export { addRemarksSchema, updateRemarksSchema }
