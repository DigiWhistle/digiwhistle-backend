import { Enum } from '../../../../constants'

const addCampaignDeliverableSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    desc: { type: 'string' },
    platform: {
      type: 'string',
      enum: Object.values(Enum.Platform),
    },
    status: {
      type: 'string',
      enum: Object.values(Enum.CampaignDeliverableStatus),
    },
    link: { type: ['string', 'null'] },
    engagementRate: { type: ['number', 'null'] },
    cpv: { type: ['number', 'null'] },
    campaignParticipant: { type: 'string', format: 'uuid' },
  },
  required: ['name', 'desc', 'platform', 'campaignParticipant'],
  additionalProperties: false,
}

const updateCampaignDeliverableSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    desc: { type: 'string' },
    platform: {
      type: 'string',
      enum: Object.values(Enum.Platform),
    },
    status: {
      type: 'string',
      enum: Object.values(Enum.CampaignDeliverableStatus),
    },
    link: { type: ['string', 'null'] },
    engagementRate: { type: ['number', 'null'] },
    cpv: { type: ['number', 'null'] },
  },
  additionalProperties: false,
}

export { addCampaignDeliverableSchema, updateCampaignDeliverableSchema }
