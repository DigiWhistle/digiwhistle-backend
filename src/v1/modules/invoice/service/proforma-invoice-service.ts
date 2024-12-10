import {
  AppLogger,
  BaseService,
  HttpException,
  uploadFileToFirebase,
  uploadPdfToFirebase,
} from '../../../../utils'
import {
  IProformaInvoice,
  IProformaInvoiceCRUD,
  IProformaInvoiceService,
} from '../interface'
import { ShareInvoiceRequest } from '../types'
import { IMailerService } from '../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { Between, DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import { generateProformaInvoicePdf } from '../../../pdf/proforma-invoice-pdf'
import numWords from 'num-words'
import fs from 'fs'

class ProformaInvoiceService
  extends BaseService<IProformaInvoice, IProformaInvoiceCRUD>
  implements IProformaInvoiceService
{
  private readonly mailerService: IMailerService
  private static instance: IProformaInvoiceService | null = null

  static getInstance = (
    proformaInvoiceCRUD: IProformaInvoiceCRUD,
    mailerService: IMailerService
  ) => {
    if (ProformaInvoiceService.instance === null) {
      ProformaInvoiceService.instance = new ProformaInvoiceService(
        proformaInvoiceCRUD,
        mailerService
      )
    }
    return ProformaInvoiceService.instance
  }

  private constructor(
    proformaInvoiceCRUD: IProformaInvoiceCRUD,
    mailerService: IMailerService
  ) {
    super(proformaInvoiceCRUD)
    this.mailerService = mailerService
  }

  async add(data: DeepPartial<IProformaInvoice>): Promise<IProformaInvoice> {
    try {
      const invoice = await this.findOne({ invoiceNo: data.invoiceNo })
      if (invoice) {
        throw new HttpException(
          400,
          'Invoice Already Exists with this invoiceNo'
        )
      }
      return await this.crudBase.add(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async generatePdf(invoiceId: string): Promise<{
    invoiceNo: string
    filePath: string
  }> {
    try {
      const invoice = await this.crudBase.findOne({ id: invoiceId }, [
        'campaign',
        'campaign.brand',
        'campaign.participants',
        'campaign.participants.deliverables',
      ])

      const details: string[][] = []

      if (invoice === null) throw new HttpException(404, 'Invoice Not Found')

      let counter = 0

      invoice.campaign.participants.forEach((participant) => {
        participant.deliverables.forEach((deliverable) => {
          if (counter === 0) {
            details.push([
              (counter + 1).toString(),
              deliverable.title === null ? 'IG Reel' : deliverable.title,
              '998361',
              invoice.amount.toString(),
            ])
          } else {
            details.push([
              (counter + 1).toString(),
              deliverable.title === null ? 'IG Reel' : deliverable.title,
              '',
              '',
            ])
          }
          counter++
        })
      })

      const filePath = `./reports/${invoiceId}.pdf`

      await generateProformaInvoicePdf(
        {
          clientDetails: {
            name: invoice.campaign.brand?.name as string,
            panNo: invoice.campaign.brand?.panNo as string,
            gstNo: invoice.campaign.brand?.gstNo as string,
            address: invoice.campaign.brand?.address as string,
          },
          invoiceDetails: {
            invoiceNo: invoice.invoiceNo,
            invoiceDate: new Date(invoice.invoiceDate).toDateString(),
            total: invoice.amount.toString(),
            sgst: invoice.sgst.toString(),
            cgst: invoice.cgst.toString(),
            igst: invoice.igst.toString(),
            amount: invoice.total.toString(),
            amountInWords: numWords(invoice.total),
            data: details,
          },
        },
        filePath
      )

      return {
        invoiceNo: invoice.invoiceNo,
        filePath,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async downloadProformaInvoice(id: string): Promise<string> {
    try {
      const { invoiceNo, filePath } = await this.generatePdf(id)

      const publicUrl = await uploadPdfToFirebase(
        filePath,
        `reports/${invoiceNo}_${new Date()}.pdf`
      )

      fs.unlinkSync(filePath)

      return publicUrl
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async shareProformaInvoice(data: ShareInvoiceRequest): Promise<void> {
    try {
      const { invoiceId, emails, subject, message } = data

      const { invoiceNo, filePath } = await this.generatePdf(invoiceId)

      this.mailerService
        .sendMail(emails, subject, message, [
          {
            filename: `${invoiceNo}.pdf`,
            path: filePath,
          },
        ])
        .then(() => {
          fs.unlinkSync(filePath)
          AppLogger.getInstance().info(
            `Invoice ${invoiceId} shared successfully`
          )
        })
        .catch((e) => {
          fs.unlinkSync(filePath)
          AppLogger.getInstance().error(
            `Error in sharing invoice ${invoiceId}: ${e}`
          )
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAllProformaInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    invoiceNo: string
  ): Promise<PaginatedResponse<IProformaInvoice>> {
    try {
      let query: FindOptionsWhere<IProformaInvoice> = {
        invoiceDate: Between(startDate, endDate),
      }

      if (typeof invoiceNo === 'string' && invoiceNo !== '') {
        query = { ...query, invoiceNo: ILike(`%${invoiceNo}%`) }
      }

      const data = await this.crudBase.findAllPaginated(
        page,
        limit,
        query,
        [
          'campaign',
          'campaign.participants',
          'campaign.participants.deliverables',
          'campaign.brand',
          'campaign.participants.influencerProfile',
          'campaign.participants.agencyProfile',
        ],
        {
          invoiceDate: 'DESC',
        }
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { ProformaInvoiceService }
