const addInfluencerSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    mobileNo: { type: 'string' },
    email: { type: 'string', format: 'email' },
    twitterURL: { type: 'string', format: 'uri', nullable: true },
    youtubeURL: { type: 'string', format: 'uri', nullable: true },
    instagramURL: { type: 'string', format: 'uri', nullable: true },
    linkedInURL: { type: 'string', format: 'uri', nullable: true },
    location: { type: 'string', nullable: true },
    instagramCommercial: { type: 'number', nullable: true },
    twitterCommercial: { type: 'number', nullable: true },
    youtubeCommercial: { type: 'number', nullable: true },
    linkedInCommercial: { type: 'number', nullable: true },
    rating: { type: 'number', nullable: true },
  },
  required: ['firstName', 'lastName', 'mobileNo', 'email'],
  additionalProperties: false,
}

const inviteInfluencerSchema = {
  type: 'object',
  properties: {
    emails: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email',
      },
      minItems: 1,
    },
    message: { type: 'string' },
    subject: { type: 'string' },
  },
  required: ['emails', 'message', 'subject'],
  additionalProperties: false,
}

export { inviteInfluencerSchema, addInfluencerSchema }
