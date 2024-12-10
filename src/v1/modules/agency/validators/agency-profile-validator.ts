const addAgencyProfileSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: false },
    pocFirstName: { type: 'string', nullable: true },
    pocLastName: { type: 'string', nullable: false },
    mobileNo: { type: 'string', nullable: false },
    user: { type: 'string', nullable: false },
    websiteURL: { type: 'string', nullable: false },
  },
  required: ['pocFirstName', 'name', 'mobileNo', 'user', 'websiteURL'],
  additionalProperties: false,
}

const updateAgencyProfileSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    pocFirstName: { type: 'string', nullable: true },
    pocLastName: { type: 'string', nullable: true },
    mobileNo: { type: 'string', nullable: true },
    websiteURL: { type: 'string', nullable: true },
    profilePic: { type: 'string', nullable: true },
    aadharNo: { type: 'string', nullable: true },
    panNo: { type: 'string', nullable: true },
    gstNo: { type: 'string', nullable: true },
    msmeNo: { type: 'string', nullable: true },
    bankName: { type: 'string', nullable: true },
    bankAccountNumber: { type: 'string', nullable: true },
    bankIfscCode: { type: 'string', nullable: true },
    bankAccountHolderName: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    state: { type: 'string', nullable: true },
    pincode: { type: 'string', nullable: true },
  },
  additionalProperties: false,
}

export { addAgencyProfileSchema, updateAgencyProfileSchema }
