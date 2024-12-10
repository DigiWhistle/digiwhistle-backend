const addCampaignParticipantsSchema = {
  type: 'object',
  properties: {
    campaignId: { type: 'string' },
    email: { type: 'string' },
    profileId: { type: 'string' },
    roleId: { type: 'number' },
  },
  required: ['campaignId', 'email', 'profileId', 'roleId'],
  additionalProperties: false,
}

export { addCampaignParticipantsSchema }
