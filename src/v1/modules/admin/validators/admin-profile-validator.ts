const addAdminProfileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: false },
    user: { type: 'string', nullable: false },
    profilePic: { type: 'string', nullable: true },
  },
  required: ['firstName', 'mobileNo', 'user'],
  additionalProperties: false,
}

const updateAdminProfileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: true },
    profilePic: { type: 'string', nullable: true },
    aadharNo: { type: 'string', nullable: true },
    panNo: { type: 'string', nullable: true },
    bankName: { type: 'string', nullable: true },
    bankAccountNumber: { type: 'string', nullable: true },
    bankIfscCode: { type: 'string', nullable: true },
    bankAccountHolderName: { type: 'string', nullable: true },
  },
  additionalProperties: false,
}

export { addAdminProfileSchema, updateAdminProfileSchema }
