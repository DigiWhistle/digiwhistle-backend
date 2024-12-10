const addEmployeeProfileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: false },
    user: { type: 'string', nullable: false },
    profilePic: { type: 'string', nullable: true },
    designation: { type: 'string', nullable: false },
  },
  required: ['firstName', 'mobileNo', 'user', 'designation'],
  additionalProperties: false,
}

const updateEmployeeProfileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: false },
    profilePic: { type: 'string', nullable: true },
    designation: { type: 'string', nullable: false },
    aadharNo: { type: 'string', nullable: true },
    panNo: { type: 'string', nullable: true },
    bankName: { type: 'string', nullable: true },
    bankAccountNumber: { type: 'string', nullable: true },
    bankIfscCode: { type: 'string', nullable: true },
    bankAccountHolderName: { type: 'string', nullable: true },
  },

  additionalProperties: false,
}

export { addEmployeeProfileSchema, updateEmployeeProfileSchema }
