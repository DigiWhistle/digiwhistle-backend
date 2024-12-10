import { Between, DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import {
  AppLogger,
  BaseService,
  HttpException,
  uploadFileToFirebase,
  uploadPdfToFirebase,
} from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import {
  ICreditNote,
  ISaleInvoice,
  ISaleInvoiceCRUD,
  ISaleInvoiceService,
} from '../interface'
import { ShareInvoiceRequest } from '../types'
import { IMailerService } from '../../../utils'
import { generateCSV, generateExcel } from '../utils'
import fs from 'fs'
import { generateSaleInvoicePdf } from '../../../pdf/sale-invoice-pdf'
import numWords from 'num-words'
export class SaleInvoiceService
  extends BaseService<ISaleInvoice, ISaleInvoiceCRUD>
  implements ISaleInvoiceService
{
  private static instance: ISaleInvoiceService | null = null
  private readonly mailerService: IMailerService

  static getInstance = (
    saleInvoiceCRUD: ISaleInvoiceCRUD,
    mailerService: IMailerService
  ) => {
    if (SaleInvoiceService.instance === null) {
      SaleInvoiceService.instance = new SaleInvoiceService(
        saleInvoiceCRUD,
        mailerService
      )
    }
    return SaleInvoiceService.instance
  }

  private constructor(
    saleInvoiceCRUD: ISaleInvoiceCRUD,
    mailerService: IMailerService
  ) {
    super(saleInvoiceCRUD)
    this.mailerService = mailerService
  }

  async add(data: DeepPartial<ISaleInvoice>): Promise<ISaleInvoice> {
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

  private async generateInvoicePdf(invoiceId: string): Promise<{
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

      await generateSaleInvoicePdf(
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

  async getAllSaleInvoices(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    invoiceNo: string
  ): Promise<PaginatedResponse<ISaleInvoice>> {
    try {
      let query: FindOptionsWhere<ISaleInvoice> = {
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
          'creditNotes',
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

  async shareSaleInvoice(data: ShareInvoiceRequest): Promise<void> {
    try {
      const { invoiceId, emails, subject, message } = data

      const { invoiceNo, filePath } = await this.generateInvoicePdf(invoiceId)

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

  async downloadSaleInvoice(id: string): Promise<string> {
    try {
      const { invoiceNo, filePath } = await this.generateInvoicePdf(id)

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

  private processInvoiceData(data: ISaleInvoice[]) {
    const fields = [
      'SNo',
      'Campaign',
      'Client',
      'GSTIN',
      'BillNo',
      'InvoiceDate',
      'TaxableAmt',
      'IGST @ 18%',
      'CGST @ 9%',
      'SGST @ 9%',
      'Total',
      'TDS',
      'Received',
      'Balance',
      'Month',
    ]

    const _data = data.map((value, index) => {
      return [
        index + 1,
        value.campaign.name,
        value.campaign.brand?.name,
        value.gstTin,
        value.invoiceNo,
        value.invoiceDate,
        value.amount,
        value.igst,
        value.cgst,
        value.sgst,
        value.total,
        value.tds,
        value.received,
        value.balanceAmount,
        value.month,
      ]
    })

    return {
      name: 'Sale Invoice',
      data: [fields, ..._data],
    }
  }

  private processCreditNotesData(data: ICreditNote[]) {
    const fields = [
      'S.No.',
      'Campaign',
      'Client',
      'GSTIN',
      'Credit Note No.',
      'TAX Invoice NO.',
      'Credit Note Date',
      'Taxable Amt',
      'IGST @ 18%',
      'CGST @ 9%',
      'SGST @ 9%',
      'TOTAL',
      'TDS',
      'Advance',
      'MONTH',
      'Remarks',
    ]

    const _data = data.map((value, index) => {
      return [
        index + 1,
        value.invoice.campaign.name,
        value.invoice.campaign.brand?.name,
        value.gstTin,
        value.creditNoteNo,
        value.invoice.invoiceNo,
        value.creditNoteDate,
        value.amount,
        value.igst,
        value.cgst,
        value.sgst,
        value.total,
        value.tds,
        value.advance,
        value.month,
        value.remarks,
      ]
    })

    return {
      name: 'Credit Note',
      data: [fields, ..._data],
    }
  }

  async downloadSaleInvoiceReport(
    startDate: Date,
    endDate: Date
  ): Promise<string> {
    try {
      let query: FindOptionsWhere<ISaleInvoice> = {
        invoiceDate: Between(startDate, endDate),
      }

      const data = await this.findAll(
        query,
        ['campaign', 'campaign.brand', 'creditNotes'],
        {
          invoiceDate: 'DESC',
        }
      )

      const filePath = `./reports/sale_invoice_${new Date()}.xlsx`

      const sheetData: any = []

      const creditNotes: ICreditNote[] = []

      data.forEach((value) => {
        if (value.creditNotes.length > 0) {
          value.creditNotes.forEach((creditNote) => {
            creditNote['invoice'] = value
            creditNotes.push(creditNote)
          })
        }
      })

      sheetData.push(this.processInvoiceData(data))
      sheetData.push(this.processCreditNotesData(creditNotes))

      await generateExcel(sheetData, filePath)

      const url = await uploadFileToFirebase(
        filePath,
        `reports/sale_invoice_${new Date()}.xlsx`
      )

      fs.unlinkSync(filePath)

      return url
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
