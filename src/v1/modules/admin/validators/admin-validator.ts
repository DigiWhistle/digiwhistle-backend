const addAdminOrEmployeeSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    mobileNo: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string' },
    designation: { type: 'string' },
    profilePic: { type: 'string', format: 'uri', nullable: true },
  },
  required: ['firstName', 'mobileNo', 'email', 'role'],
  additionalProperties: false,
}

export { addAdminOrEmployeeSchema }
