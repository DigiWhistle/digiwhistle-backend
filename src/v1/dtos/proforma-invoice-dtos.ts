import { Enum } from '../../constants'
import {
  ICampaignDeliverables,
  ICampaignParticipants,
} from '../modules/campaign/interface'
import { IProformaInvoice } from '../modules/invoice/interface'

export class ProformaInvoiceDTO {
  private static groupDeliverablesByInfluencerName(
    participant: ICampaignParticipants
  ) {
    const deliverables = participant.deliverables
    const mp: Map<string, ICampaignDeliverables[]> = new Map()

    deliverables.map((value) => {
      const data = mp.get(value.name)
      if (data === undefined) {
        mp.set(value.name, [value])
      } else mp.set(value.name, [...data, value])
    })

    const _data: Array<{
      name: string
      deliverables: Array<{
        id: string
        name: string
        desc: string | null
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
      }>
    }> = []

    for (const [key, value] of mp) {
      _data.push({
        name: key,
        deliverables: value.map((deliverable) => {
          return {
            id: deliverable.id,
            name: deliverable.name,
            desc: deliverable.title,
            platform: deliverable.platform,
            status: deliverable.status,
          }
        }),
      })
    }

    return _data
  }
  static transformationForProformaInvoice(proformaInvoice: IProformaInvoice) {
    const participants = proformaInvoice.campaign.participants
    const _deliverables: Array<{
      name: string
      deliverables: Array<{
        id: string
        name: string
        desc: string | null
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
      }>
    }> = []

    participants.forEach((participant) => {
      if (participant.influencerProfile !== null) {
        _deliverables.push({
          name:
            participant.influencerProfile.firstName +
            (participant.influencerProfile.lastName !== null
              ? ' ' + participant.influencerProfile.lastName
              : ''),
          deliverables: participant.deliverables.map((deliverable) => {
            return {
              id: deliverable.id,
              name: deliverable.name,
              desc: deliverable.title,
              platform: deliverable.platform,
              status: deliverable.status,
            }
          }),
        })
      } else {
        const value = this.groupDeliverablesByInfluencerName(participant)
        _deliverables.push(...value)
      }
    })

    return {
      id: proformaInvoice.id,
      invoiceNumber: proformaInvoice.invoiceNo,
      invoiceNo: proformaInvoice.billNo,
      invoiceDate: new Date(proformaInvoice.billDate).toDateString(),
      issueDate: new Date(proformaInvoice.invoiceDate).toDateString(),
      amount: proformaInvoice.total,
      month: proformaInvoice.month,
      gstTin: proformaInvoice.gstTin,
      tds: proformaInvoice.tds,
      balance: proformaInvoice.balanceAmount,
      received: proformaInvoice.received,
      taxableAmount: proformaInvoice.amount,
      brandName: proformaInvoice.campaign.brand?.name,
      code: proformaInvoice.campaign.code,
      name: proformaInvoice.campaign.name,
      campaignDuration:
        proformaInvoice.campaign.startDate +
        ' - ' +
        proformaInvoice.campaign.endDate,
      sgst: proformaInvoice.sgst,
      cgst: proformaInvoice.cgst,
      igst: proformaInvoice.igst,
      total: proformaInvoice.total,
      deliverables: _deliverables,
    }
  }
}
