const authSchema = {
  type: 'object',
  properties: {
    idToken: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
  required: ['idToken'],
  additionalProperties: false,
}

const resetPasswordEmailSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
  required: ['email'],
  additionalProperties: false,
}

const resetPasswordSchema = {
  type: 'object',
  properties: {
    oobCode: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['oobCode', 'password'],
  additionalProperties: false,
}

const mobileOTPSchema = {
  type: 'object',
  properties: {
    mobileNo: {
      type: 'string',
    },
  },
  required: ['mobileNo'],
  additionalProperties: false,
}

const verifyMobileOTPSchema = {
  type: 'object',
  properties: {
    mobileNo: {
      type: 'string',
    },
    otp: {
      type: 'string',
    },
  },
  required: ['mobileNo', 'otp'],
  additionalProperties: false,
}

export {
  resetPasswordEmailSchema,
  resetPasswordSchema,
  authSchema,
  verifyMobileOTPSchema,
  mobileOTPSchema,
}
