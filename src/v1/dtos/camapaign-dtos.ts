import { DeepPartial } from 'typeorm'
import { Enum } from '../../constants'
import {
  ICampaign,
  ICampaignDeliverables,
  ICampaignParticipants,
} from '../modules/campaign/interface'
import { v4 as uuidv4 } from 'uuid'
import {
  CampaignStats,
  ICampaignAgencyData,
  ICampaignCardsRequest,
  ICampaignInfluencerData,
} from '../modules/campaign/types'
import millify from 'millify'
import moment from 'moment-timezone'

export class CampaignDTO {
  private static groupDeliverableByInfluencerName(
    deliverables: ICampaignDeliverables[]
  ) {
    const mp: Map<
      string,
      Array<{
        id: string
        title: string
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
        deliverableLink: string | null
        er: number | null
        cpv: number | null
        desc: string | null
      }>
    > = new Map()

    deliverables.map((deliverable: ICampaignDeliverables) => {
      let data = mp.get(deliverable.name)

      if (data === undefined) {
        mp.set(deliverable.name, [
          {
            id: deliverable.id,
            title: deliverable.title,
            platform: deliverable.platform,
            status: deliverable.status,
            deliverableLink: deliverable.link,
            er: deliverable.engagementRate,
            cpv: deliverable.cpv,
            desc: deliverable.desc,
          },
        ])
      } else {
        data = [
          ...data,
          {
            id: deliverable.id,
            title: deliverable.title,
            platform: deliverable.platform,
            status: deliverable.status,
            deliverableLink: deliverable.link,
            er: deliverable.engagementRate,
            cpv: deliverable.cpv,
            desc: deliverable.desc,
          },
        ]
        mp.set(deliverable.name, data)
      }
    })

    const influencer: Array<{
      id: string
      name: string
      deliverables: Array<{
        id: string
        title: string
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
        deliverableLink: string | null
        er: number | null
        cpv: number | null
      }>
    }> = []

    for (const [key, data] of mp) {
      influencer.push({
        name: key,
        id: uuidv4(),
        deliverables: data,
      })
    }

    return influencer
  }

  private static groupDeliverablesByInfluencers(data: ICampaignParticipants[]) {
    const mp: Map<
      string,
      Array<{
        id: string
        title: string
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
        deliverableLink: string | null
        er: number | null
        cpv: number | null
      }>
    > = new Map()

    const influencer: Array<{
      name: string
      deliverables: Array<{
        id: string
        title: string
        platform: Enum.Platform
        status: Enum.CampaignDeliverableStatus
        deliverableLink: string | null
        er: number | null
        cpv: number | null
      }>
    }> = []

    data.forEach((value: ICampaignParticipants) => {
      value.deliverables.forEach((deliverable: ICampaignDeliverables) => {
        let value = mp.get(deliverable.name)

        if (value === undefined) {
          mp.set(deliverable.name, [
            {
              id: deliverable.id,
              title: deliverable.title,
              platform: deliverable.platform,
              status: deliverable.status,
              deliverableLink: deliverable.link,
              er: deliverable.engagementRate,
              cpv: deliverable.cpv,
            },
          ])
        } else {
          value = [
            ...value,
            {
              id: deliverable.id,
              title: deliverable.title,
              platform: deliverable.platform,
              status: deliverable.status,
              deliverableLink: deliverable.link,
              er: deliverable.engagementRate,
              cpv: deliverable.cpv,
            },
          ]
          mp.set(deliverable.name, value)
        }
      })
    })

    for (const [key, value] of mp) {
      influencer.push({
        name: key,
        deliverables: value,
      })
    }

    return influencer
  }

  static generateInvoiceDueDate(
    paymentTerms: Enum.PaymentTerms,
    invoiceDate: Date
  ) {
    switch (paymentTerms) {
      case Enum.PaymentTerms.DAYS_0:
        return moment(invoiceDate).add(0, 'days')
      case Enum.PaymentTerms.DAYS_30:
        return moment(invoiceDate).add(30, 'days')
      case Enum.PaymentTerms.DAYS_60:
        return moment(invoiceDate).add(60, 'days')
    }
  }

  static transformationForAdminAndEmployee(data: ICampaign) {
    const saleInvoice = data?.saleInvoices
    let paymentStatus: Enum.InvoiceStatus = Enum.InvoiceStatus.PENDING
    let paymentPercent: string | null = null

    if (saleInvoice && saleInvoice.length > 0) {
      paymentStatus = saleInvoice[0].paymentStatus
      if (paymentStatus === Enum.InvoiceStatus.PENDING) {
        let paymentValue =
          (saleInvoice[0].received /
            (saleInvoice[0].balanceAmount + saleInvoice[0].received)) *
          100
        paymentPercent = paymentValue.toFixed(2) + '%'
      }
    }

    return {
      id: data.id,
      name: data.name,
      code: data.code,
      brandName: data.brandName,
      startDate: data.startDate,
      endDate: data.endDate,
      commercial: data.commercial,
      incentiveWinner:
        data.manager?.firstName +
        (data.manager?.lastName === null ? '' : ' ' + data.manager?.lastName) +
        ' 5% (incentive)',
      incentiveReleased: data.incentiveReleased,
      status: data.status,
      paymentStatus: paymentStatus,
      paymentPercent: paymentPercent,
      participants: data.participants.map((participant) => {
        if (participant.influencerProfile !== null) {
          return {
            type: 'influencer',
            id: participant.id,
            name:
              participant.influencerProfile.firstName +
              (participant.influencerProfile.lastName === null
                ? ''
                : ' ' + participant.influencerProfile.lastName),
            exclusive: participant.influencerProfile.exclusive,
            invoice: participant.invoice,
            commercialBrand: participant.commercialBrand,
            commercialCreator: participant.commercialCreator,
            toBeGiven: participant.toBePaid,
            margin: participant.margin,
            paymentStatus: participant.paymentStatus,
            invoiceStatus: participant.invoiceStatus,
            confirmationSent: participant.confirmationSent,
            paymentTerms: participant.paymentTerms,
            deliverables: participant.deliverables.map((deliverable) => {
              return {
                id: deliverable.id,
                title: deliverable.title,
                platform: deliverable.platform,
                status: deliverable.status,
                deliverableLink: deliverable.link,
                er: deliverable.engagementRate,
                cpv: deliverable.cpv,
                desc: deliverable.desc,
              }
            }),
          }
        } else {
          const influencerGroupedData = this.groupDeliverableByInfluencerName(
            participant.deliverables
          )
          return {
            type: 'agency',
            id: participant.id,
            name: participant?.agencyProfile?.name,
            invoice: participant.invoice,
            commercialBrand: participant.commercialBrand,
            commercialCreator: participant.commercialCreator,
            toBeGiven: participant.toBePaid,
            margin: participant.margin,
            confirmationSent: participant.confirmationSent,
            paymentStatus: participant.paymentStatus,
            invoiceStatus: participant.invoiceStatus,
            paymentTerms: participant.paymentTerms,
            influencer: influencerGroupedData,
          }
        }
      }),
    }
  }

  static generateInvoiceRaiseDate(
    paymentTerms: Enum.INFLUENCER_PAYMENT_TERMS,
    updatedAt: Date
  ) {
    switch (paymentTerms) {
      case Enum.INFLUENCER_PAYMENT_TERMS.DAYS_30:
        return moment(updatedAt).add(30, 'days')
      case Enum.INFLUENCER_PAYMENT_TERMS.DAYS_60:
        return moment(updatedAt).add(60, 'days')
      default:
        return moment(updatedAt).add(0, 'days')
    }
  }

  static transformationForInfluencer(
    data: ICampaign,
    influencerProfileId: string
  ) {
    const influencerDetails = data.participants.filter((data) => {
      return (
        data.influencerProfile !== null &&
        data.influencerProfile.id === influencerProfileId
      )
    })

    const invoice = data.purchaseInvoices?.filter((invoice) => {
      invoice.influencerProfile?.id === influencerProfileId
    })

    const invoiceDueDate =
      invoice !== undefined && invoice.length > 0
        ? this.generateInvoiceDueDate(
            invoice[0].paymentTerms,
            invoice[0].invoiceDate
          )
        : null

    const updatedAt = influencerDetails[0].deliverables.map((deliverable) => {
      return deliverable.updatedAt
    })

    let latestUpdatedAt: Date | null = null

    if (updatedAt.length > 0) {
      latestUpdatedAt = updatedAt[0]

      for (let i = 0; i < updatedAt.length; i++) {
        if (updatedAt[i] > latestUpdatedAt) {
          latestUpdatedAt = updatedAt[i]
        }
      }
    }

    let isRaiseInvoice = false

    if (
      influencerDetails[0].invoiceStatus ===
      Enum.CampaignInvoiceStatus.GENERATED
    ) {
      isRaiseInvoice = false
    } else if (
      influencerDetails[0].paymentTerms ===
      Enum.INFLUENCER_PAYMENT_TERMS.ADVANCE
    ) {
      isRaiseInvoice = true
    } else if (latestUpdatedAt !== null) {
      const raiseInvoiceDate = this.generateInvoiceRaiseDate(
        influencerDetails[0].paymentTerms,
        latestUpdatedAt
      )

      if (raiseInvoiceDate.isBefore(new Date())) {
        isRaiseInvoice = true
      }
    }

    return {
      campaignId: data.id,
      name: data.name,
      code: data.code,
      brandName: data.brand?.name,
      startDate: data.startDate,
      endDate: data.endDate,
      poc:
        data.manager.firstName +
        (data.manager.lastName === null ? '' : ' ' + data.manager.lastName) +
        ' DW (POC)',
      file:
        invoice !== undefined &&
        invoice.length > 0 &&
        invoice[0]?.file !== undefined
          ? invoice[0]?.file
          : null,
      paymentStatus: influencerDetails[0].paymentStatus,
      commercial: influencerDetails[0].commercialCreator,
      toBeGiven: influencerDetails[0].toBePaid,
      invoice: influencerDetails[0].invoice,
      invoiceStatus: influencerDetails[0].invoiceStatus,
      deliverable: influencerDetails[0].deliverables,
      participantId: influencerDetails[0].id,
      invoiceDueDate: invoiceDueDate,
      isRaiseInvoice: isRaiseInvoice,
    }
  }

  static transformationForBrands(data: ICampaign) {
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      brandName: data.brandName,
      startDate: data.startDate,
      endDate: data.endDate,
      capital: data.commercial,
      poc:
        data.manager.firstName +
        (data.manager.lastName === null ? '' : ' ' + data.manager.lastName) +
        ' DW (POC)',
      status: data.status,
      paymentStatus: data.paymentStatus,

      participants: this.groupDeliverablesByInfluencers(data.participants),
    }
  }

  static transformationForAgency(data: ICampaign, agencyProfileId: string) {
    const agencyDetails = data.participants.filter((data) => {
      return (
        data.agencyProfile !== null && data.agencyProfile.id === agencyProfileId
      )
    })

    const updatedAt = agencyDetails[0].deliverables.map((deliverable) => {
      return deliverable.updatedAt
    })

    let latestUpdatedAt: Date | null = null

    if (updatedAt.length > 0) {
      latestUpdatedAt = updatedAt[0]

      for (let i = 0; i < updatedAt.length; i++) {
        if (updatedAt[i] > latestUpdatedAt) {
          latestUpdatedAt = updatedAt[i]
        }
      }
    }

    let isRaiseInvoice = false
    if (
      agencyDetails[0].invoiceStatus === Enum.CampaignInvoiceStatus.GENERATED
    ) {
      isRaiseInvoice = false
    } else if (
      agencyDetails[0].paymentTerms === Enum.INFLUENCER_PAYMENT_TERMS.ADVANCE
    ) {
      isRaiseInvoice = true
    } else if (latestUpdatedAt !== null) {
      const raiseInvoiceDate = this.generateInvoiceRaiseDate(
        agencyDetails[0].paymentTerms,
        latestUpdatedAt
      )

      if (raiseInvoiceDate.isBefore(new Date())) {
        isRaiseInvoice = true
      }
    }

    return {
      id: data.id,
      name: data.name,
      code: data.code,
      brandName: data.brandName,
      startDate: data.startDate,
      endDate: data.endDate,
      commercial: agencyDetails[0].toBePaid,
      poc:
        data.manager.firstName +
        (data.manager.lastName === null ? '' : ' ' + data.manager.lastName) +
        ' DW (POC)',
      status: data.status,
      paymentStatus: data.paymentStatus,
      invoiceStatus: agencyDetails[0].invoiceStatus,
      participants: this.groupDeliverableByInfluencerName(
        agencyDetails[0].deliverables
      ),
      isRaiseInvoice: isRaiseInvoice,
    }
  }

  static transformationForParticipantsAndDeliverablesFromCampaigns(
    data: ICampaignCardsRequest
  ) {
    const participantData: Partial<ICampaignParticipants>[] = []
    const deliverableData: DeepPartial<ICampaignDeliverables>[] = []
    const participants = data.participants
    participants.map((value) => {
      participantData.push({
        id: value.id,
        commercialBrand: value.commercialBrand,
        commercialCreator: value.commercialCreator,
        paymentStatus: value.paymentStatus,
        invoiceStatus: value.invoiceStatus,
        toBePaid: value.toBeGiven,
        margin: value.margin,
        invoice: value.invoice,
        paymentTerms: value.paymentTerms,
      })

      if (value.type === 'influencer') {
        const participant = value as ICampaignInfluencerData
        participant.deliverables.map((deliverable) => {
          deliverableData.push({
            id: deliverable.id,
            cpv: deliverable.cpv,
            engagementRate: deliverable.er,
            platform: deliverable.platform,
            status: deliverable.status,
            link: deliverable.deliverableLink,
            title: deliverable.title,
            name: value.name,
            desc: deliverable.desc,
            campaignParticipant: {
              id: value.id,
            },
          })
        })
      } else if (value.type === 'agency') {
        const participant = value as ICampaignAgencyData
        participant.influencer.map((influencer) => {
          influencer.deliverables.map((deliverable) => {
            deliverableData.push({
              id: deliverable.id,
              cpv: deliverable.cpv,
              engagementRate: deliverable.er,
              platform: deliverable.platform,
              status: deliverable.status,
              link: deliverable.deliverableLink,
              title: deliverable.title,
              name: value.name,
              desc: deliverable.desc,
              campaignParticipant: {
                id: value.id,
              },
            })
          })
        })
      }
    })

    return {
      participants: participantData,
      deliverables: deliverableData,
    }
  }

  static transformationForCampaignData(data: ICampaign) {
    const _participants = data.participants.map((value) => {
      if (value.influencerProfile !== null) {
        return {
          profileId: value.influencerProfile?.id,
          email: value.email,
          id: value.id,
          roleId: Enum.ROLES.INFLUENCER,
          profilePic: value.influencerProfile?.profilePic,
        }
      } else {
        return {
          profileId: value.agencyProfile?.id,
          email: value.email,
          id: value.id,
          roleId: Enum.ROLES.AGENCY,
          profilePic: null,
        }
      }
    })

    const _manager = {
      id: data.manager?.id,
      name:
        data.manager?.firstName +
        (data.manager?.lastName === null ? '' : ' ' + data.manager?.lastName),
    }

    const _incentiveWinner = {
      id: data.incentiveWinner?.id,
      name:
        data.incentiveWinner?.firstName +
        (data.incentiveWinner?.lastName === null
          ? ''
          : ' ' + data.incentiveWinner?.lastName),
    }

    const _brand = {
      id: data.brand?.id,
      name: data.brand?.name,
    }

    const _data = {
      ...data,
      participants: _participants,
      manager: _manager,
      incentiveWinner: _incentiveWinner,
      brand: _brand,
    }

    return _data
  }

  static transformationForCampaignStats(
    data: CampaignStats,
    roleId: Enum.ROLES
  ) {
    if (roleId === Enum.ROLES.ADMIN || roleId === Enum.ROLES.EMPLOYEE) {
      return [
        {
          label: 'Total Campaigns',
          value: millify(data.totalCampaign),
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Active Campaigns',
          value: millify(data.totalActiveCampaign),
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Total Comm.Brand',
          value: millify(data.totalCommercialBrand),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
        {
          label: 'Total Comm.Creator',
          value: millify(data.totalCommercialCreator),
          subValue: '',
          icon: 'CurrencyRupeeIcon',
        },
        {
          label: 'Total To Be Paid',
          value: millify(data.totalToBeGiven),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
        {
          label: 'Total Margin',
          value: millify(data.totalMargin),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
        {
          label: 'Total Revenue',
          value: millify(data.totalRevenue),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
        {
          label: 'Pending Incentive',
          value: millify(data.pendingIncentive),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
        {
          label: 'Total Incentive',
          value: millify(data.totalIncentive),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
      ]
    } else if (roleId === Enum.ROLES.BRAND) {
      return [
        {
          label: 'Total Campaigns',
          value: millify(data.totalCampaign),
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Total Capital',
          value: millify(data.totalRevenue === null ? 0 : data.totalRevenue),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
      ]
    } else if (
      roleId === Enum.ROLES.INFLUENCER ||
      roleId === Enum.ROLES.AGENCY
    ) {
      return [
        {
          label: 'Total Campaigns',
          value: millify(data.totalCampaign),
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Total Revenue',
          value: millify(data.totalRevenue === null ? 0 : data.totalRevenue),
          subValue: '',
          iconName: 'CurrencyRupeeIcon',
        },
      ]
    }
  }

  static transformationForCampaignSearchByCode(data: ICampaign) {
    const { id, name, code, brand } = data

    return {
      id,
      name,
      code,
      brand: brand?.name,
    }
  }

  static transformationForCampaignSearchByCodeForInvoice(
    data: ICampaign,
    userId: string
  ) {
    const { id, name, code, brand, participants } = data

    const influencer = participants.filter((participant) => {
      return participant.influencerProfile?.user?.id === userId
    })

    const agency = participants.filter((participant) => {
      return participant.agencyProfile?.user?.id === userId
    })

    if (influencer.length === 0 && agency.length === 0) return {}

    const panNo =
      influencer.length > 0
        ? influencer[0].influencerProfile?.panNo
        : agency[0].agencyProfile?.panNo

    const paymentTerms =
      influencer.length > 0
        ? influencer[0].paymentTerms
        : agency[0].paymentTerms

    const gstNo =
      influencer.length > 0
        ? influencer[0].influencerProfile?.gstNo
        : agency[0].agencyProfile?.gstNo

    const toBeGiven =
      influencer.length > 0 ? influencer[0].toBePaid : agency[0].toBePaid

    const cgst = gstNo?.includes('09')
      ? 0
      : 0.09 * (toBeGiven == null ? 0 : toBeGiven)

    const igst = gstNo?.includes('09')
      ? 0.18 * (toBeGiven == null ? 0 : toBeGiven)
      : 0

    const sgst = gstNo?.includes('09')
      ? 0
      : 0.09 * (toBeGiven == null ? 0 : toBeGiven)

    return {
      campaignId: id,
      campaignName: name,
      campaignCode: code,
      brand: {
        id: brand?.id,
        name: brand?.name,
      },
      panNo: panNo,
      paymentTerms: paymentTerms,
      cgst: cgst,
      igst: igst,
      sgst: sgst,
      totalInvoiceAmount:
        (toBeGiven == null ? 0 : toBeGiven) + (cgst + igst + sgst),
      totalAmount: toBeGiven,
      paymentStatus: Enum.InvoiceStatus.PENDING,
    }
  }
}
