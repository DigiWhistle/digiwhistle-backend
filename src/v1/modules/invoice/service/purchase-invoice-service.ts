import {
  Between,
  DeepPartial,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
} from 'typeorm'
import {
  AppLogger,
  BaseService,
  HttpException,
  uploadFileToFirebase,
} from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import {
  IPurchaseInvoice,
  IPurchaseInvoiceCRUD,
  IPurchaseInvoiceService,
} from '../interface'
import { PurchaseInvoiceWebhookPayload, ShareInvoiceRequest } from '../types'
import { IMailerService } from '../../../utils'
import { generateCSV } from '../utils'
import fs from 'fs'
import {
  ICampaignParticipants,
  ICampaignParticipantsService,
} from '../../campaign/interface'
import { Enum } from '../../../../constants'
import { Attachment } from 'nodemailer/lib/mailer'
import { IRazorpayService } from '../../../utils/razorpay-service'

export class PurchaseInvoiceService
  extends BaseService<IPurchaseInvoice, IPurchaseInvoiceCRUD>
  implements IPurchaseInvoiceService
{
  private static instance: IPurchaseInvoiceService | null = null
  private readonly mailerService: IMailerService
  private readonly campaignParticipantService: ICampaignParticipantsService
  private readonly razorpayService: IRazorpayService

  static getInstance = (
    purchaseInvoiceCRUD: IPurchaseInvoiceCRUD,
    mailerService: IMailerService,
    campaignParticipantService: ICampaignParticipantsService,
    razorpayService: IRazorpayService
  ) => {
    if (PurchaseInvoiceService.instance === null) {
      PurchaseInvoiceService.instance = new PurchaseInvoiceService(
        purchaseInvoiceCRUD,
        mailerService,
        campaignParticipantService,
        razorpayService
      )
    }
    return PurchaseInvoiceService.instance
  }

  private constructor(
    purchaseInvoiceCRUD: IPurchaseInvoiceCRUD,
    mailerService: IMailerService,
    campaignParticipantService: ICampaignParticipantsService,
    razorpayService: IRazorpayService
  ) {
    super(purchaseInvoiceCRUD)
    this.mailerService = mailerService
    this.campaignParticipantService = campaignParticipantService
    this.razorpayService = razorpayService
  }

  async add(data: DeepPartial<IPurchaseInvoice>): Promise<IPurchaseInvoice> {
    try {
      let Query: FindOptionsWhere<IPurchaseInvoice> = {
        campaign: {
          id: data.campaign as unknown as string,
        },
      }

      if (typeof data.influencerProfile === 'string') {
        Query = {
          ...Query,
          influencerProfile: {
            id: data.influencerProfile as unknown as string,
          },
        }
      } else if (typeof data.agencyProfile === 'string') {
        Query = {
          ...Query,
          agencyProfile: {
            id: data.agencyProfile as unknown as string,
          },
        }
      } else {
        throw new HttpException(400, 'Invalid Data')
      }

      const exitingInvoice = await this.crudBase.findOne(Query)

      if (exitingInvoice !== null)
        throw new HttpException(400, 'Invoice Already Exists')

      let query: FindOptionsWhere<ICampaignParticipants> = {
        campaign: {
          id: data.campaign as unknown as string,
        },
      }

      if (data.influencerProfile !== null) {
        query = {
          ...query,
          influencerProfile: {
            id: data.influencerProfile as unknown as string,
          },
        }
      } else if (data.agencyProfile !== null) {
        query = {
          ...query,
          agencyProfile: {
            id: data.agencyProfile as unknown as string,
          },
        }
      }

      const participant = await this.campaignParticipantService.findOne(query, [
        'deliverables',
        'influencerProfile',
        'agencyProfile',
      ])

      if (participant === null)
        throw new HttpException(
          400,
          'Not Part of this campaign, cannot process the invoice'
        )

      if (
        participant.influencerProfile !== null &&
        (participant.influencerProfile.bankAccountHolderName === null ||
          participant.influencerProfile.bankAccountNumber === null ||
          participant.influencerProfile.bankIfscCode === null ||
          participant.influencerProfile.panNo === null)
      ) {
        throw new HttpException(400, 'Bank details not provided')
      }

      if (
        participant.agencyProfile !== null &&
        (participant.agencyProfile.bankAccountHolderName === null ||
          participant.agencyProfile.bankAccountNumber === null ||
          participant.agencyProfile.bankIfscCode === null ||
          participant.agencyProfile.panNo === null)
      ) {
        throw new HttpException(400, 'Bank details not provided')
      }

      // keep it for future client may ask for it

      // participant.deliverables.map((deliverable) => {
      //   if (deliverable.status === Enum.CampaignDeliverableStatus.NOT_LIVE) {
      //     throw new HttpException(
      //       400,
      //       'All Deliverables are not live so cannot process invoice request'
      //     )
      //   }
      // })

      const resp = await this.crudBase.add(data)

      await this.campaignParticipantService
        .update(
          { id: participant.id },
          {
            invoice: resp.invoiceNo,
            invoiceStatus: Enum.CampaignInvoiceStatus.GENERATED,
          }
        )
        .catch(async (e) => {
          await this.crudBase.delete({ id: resp.id }).catch((e) => {
            AppLogger.getInstance().error(e)
          })
          throw new HttpException(e?.errorCode, e?.message)
        })

      return resp
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAllPurchaseInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    searchQuery: string,
    influencerProfileId?: string,
    agencyProfileId?: string
  ): Promise<PaginatedResponse<IPurchaseInvoice>> {
    try {
      let query: FindOptionsWhere<IPurchaseInvoice> = {
        invoiceDate: Between(startDate, endDate),
      }

      let Query: FindOptionsWhere<IPurchaseInvoice>[] = []

      if (typeof influencerProfileId === 'string') {
        query = {
          ...query,
          influencerProfile: {
            id: influencerProfileId,
          },
        }
      }

      if (typeof agencyProfileId === 'string') {
        query = {
          ...query,
          agencyProfile: {
            id: agencyProfileId,
          },
        }
      }

      if (typeof searchQuery === 'string' && searchQuery !== '') {
        Query = [
          {
            ...query,
            invoiceNo: ILike(`%${searchQuery}%`),
          },
          {
            ...query,
            influencerProfile: {
              firstName: ILike(`%${searchQuery}%`),
            },
          },
          {
            ...query,
            agencyProfile: {
              name: ILike(`%${searchQuery}%`),
            },
          },
        ]
      }

      if (Query.length === 0) {
        Query.push(query)
      }

      const data = await this.crudBase.findAllPaginated(
        page,
        limit,
        Query.length === 1 ? Query[0] : Query,
        ['campaign', 'campaign.brand', 'influencerProfile', 'agencyProfile'],
        {
          invoiceDate: 'DESC',
        }
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async sharePurchaseInvoice(data: ShareInvoiceRequest): Promise<void> {
    try {
      const { invoiceId, emails, subject, message } = data

      const invoice = await this.crudBase.findOne({ id: invoiceId })

      if (invoice === null) throw new HttpException(400, 'Invoice Not Found')

      const attachment: Attachment[] = []

      if (invoice.file !== null) {
        attachment.push({
          filename: `${invoice.invoiceNo}.pdf`,
          path: invoice.file,
        })
      }

      this.mailerService
        .sendMail(emails, subject, message, attachment)
        .then(() => {
          AppLogger.getInstance().info(
            `Invoice ${invoiceId} shared successfully`
          )
        })
        .catch((e) => {
          AppLogger.getInstance().error(
            `Error in sharing invoice ${invoiceId}: ${e}`
          )
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async downloadPurchaseInvoiceReport(
    startDate: Date,
    endDate: Date
  ): Promise<string> {
    try {
      let query: FindOptionsWhere<IPurchaseInvoice> = {
        invoiceDate: Between(startDate, endDate),
      }

      const data = await this.findAll(query, ['campaign', 'campaign.brand'], {
        invoiceDate: 'DESC',
      })

      const _data = data.map((value, index) => {
        return {
          SNo: index + 1,
          Campaign: value.campaign.name,
          Category:
            value.influencerProfile === null ? 'Agency Fee' : 'Influencer Fee',
          Brand: value.campaign.brand?.name,
          'Vendor Name': value.influencerProfile
            ? value.influencerProfile.firstName +
              (value.influencerProfile.lastName === null
                ? ''
                : ' ' + value.influencerProfile.lastName)
            : value.agencyProfile?.name,
          'Vendor PAN': value.pan,
          'Invoice No': value.invoiceNo,
          'Invoice Date': value.invoiceDate,
          'Total Amount': value.amount,
          IGST: value.igst,
          CGST: value.cgst,
          SGST: value.sgst,
          'Total Invoice Amount': value.totalAmount,
          TDS: value.tds,
          'Final Amount': value.finalAmount,
          'Amount Paid': value.finalAmount - value.balanceAmount,
          Balance: value.balanceAmount,
          'Payment Terms': value.paymentTerms,
          'TDS %': value.tdsPercentage,
          Section: value.tdsSection,
        }
      })

      const fields = [
        'SNo',
        'Campaign',
        'Category',
        'Brand',
        'Vendor Name',
        'Vendor PAN',
        'Invoice No',
        'Invoice Date',
        'Total Amount',
        'IGST',
        'CGST',
        'SGST',
        'Total Invoice Amount',
        'TDS',
        'Final Amount',
        'Amount Paid',
        'Balance',
        'Payment Terms',
        'TDS %',
        'Section',
      ]

      const csv = generateCSV(_data, fields)
      const filePath = `./reports/purchase_invoice_${new Date()}.csv`

      fs.writeFileSync(filePath, csv)

      const url = await uploadFileToFirebase(
        filePath,
        `reports/purchase_invoice_${new Date()}.csv`
      )

      fs.unlinkSync(filePath)

      return url
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async releasePayment(
    invoiceId: string,
    idempotencyKey: string
  ): Promise<void> {
    try {
      const invoice = await this.crudBase.findOne({ id: invoiceId }, [
        'influencerProfile',
        'agencyProfile',
      ])

      if (invoice === null) throw new HttpException(404, 'Invoice Not Found')

      if (invoice.influencerProfile !== null) {
        if (
          invoice.influencerProfile?.bankAccountHolderName === null ||
          invoice.influencerProfile?.bankAccountNumber === null ||
          invoice.influencerProfile?.bankIfscCode === null
        ) {
          throw new HttpException(400, 'Bank details not provided by vendor')
        }
      }

      if (invoice.agencyProfile !== null) {
        if (
          invoice.agencyProfile?.bankAccountHolderName === null ||
          invoice.agencyProfile?.bankAccountNumber === null ||
          invoice.agencyProfile?.bankIfscCode === null
        ) {
          throw new HttpException(400, 'Bank details not provided by vendor')
        }
      }

      let fund_account_id: string = ''

      if (invoice.influencerProfile !== null) {
        if (invoice.influencerProfile?.fundAccountId === null) {
          fund_account_id = await this.razorpayService.createFundAccount({
            type: 'vendor',
            name:
              invoice.influencerProfile.firstName +
              (invoice.influencerProfile.lastName === null
                ? ''
                : ' ' + invoice.influencerProfile.lastName),
            contact: invoice.influencerProfile.mobileNo,
            email: invoice.influencerProfile.user.email,
            account_type: 'bank_account',
            bank_account: {
              name: invoice.influencerProfile.bankAccountHolderName,
              ifsc: invoice.influencerProfile.bankIfscCode,
              account_number: invoice.influencerProfile.bankAccountNumber,
            },
          })
        }
      }

      if (invoice.agencyProfile !== null) {
        if (invoice.agencyProfile?.fundAccountId === null) {
          fund_account_id = await this.razorpayService.createFundAccount({
            type: 'vendor',
            name: invoice.agencyProfile.name,
            contact: invoice.agencyProfile.mobileNo,
            email: invoice.agencyProfile.user.email,
            account_type: 'bank_account',
            bank_account: {
              name: invoice.agencyProfile.bankAccountHolderName,
              ifsc: invoice.agencyProfile.bankIfscCode,
              account_number: invoice.agencyProfile.bankAccountNumber,
            },
          })
        }
      }

      await this.razorpayService.processPayout(
        {
          account_number: process.env.RAZORPAY_ACCOUNT_NUMBER ?? '',
          mode: 'NEFT',
          currency: 'INR',
          amount: invoice.finalAmount,
          fund_account_id: fund_account_id,
          purpose: 'payout',
          notes: {
            type: 'purchase_invoice',
            invoiceId: invoiceId,
          },
        },
        idempotencyKey
      )
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async handleWebhook(
    payload: PurchaseInvoiceWebhookPayload,
    event: Enum.WEBHOOK_EVENTS
  ): Promise<void> {
    try {
      if (event === Enum.WEBHOOK_EVENTS.PROCESSED) {
        await this.crudBase.update(
          {
            id: payload.invoiceId,
          },
          {
            paymentStatus: Enum.InvoiceStatus.ALL_RECEIVED,
          }
        )
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
