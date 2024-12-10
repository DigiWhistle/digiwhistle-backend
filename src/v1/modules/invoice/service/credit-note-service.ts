import numWords from 'num-words'
import {
  BaseService,
  HttpException,
  uploadFileToFirebase,
  uploadPdfToFirebase,
} from '../../../../utils'
import { generateCreditNotePdf } from '../../../pdf/credit-note-pdf'
import { ICreditNote, ICreditNoteCRUD, ICreditNoteService } from '../interface'
import fs from 'fs'
import { firebase } from '../../../../config'
import { DeepPartial } from 'typeorm'

class CreditNoteService extends BaseService<ICreditNote, ICreditNoteCRUD> {
  private static instance: ICreditNoteService | null = null

  static getInstance = (creditNoteCRUD: ICreditNoteCRUD) => {
    if (CreditNoteService.instance === null)
      CreditNoteService.instance = new CreditNoteService(creditNoteCRUD)

    return CreditNoteService.instance
  }

  private constructor(creditNoteCRUD: ICreditNoteCRUD) {
    super(creditNoteCRUD)
  }

  async add(data: DeepPartial<ICreditNote>): Promise<ICreditNote> {
    try {
      const creditNote = await this.findOne({
        invoice: {
          id: data.invoice as string,
        },
      })

      if (creditNote) {
        throw new HttpException(
          400,
          'Credit Note Already Exists with this invoiceNo'
        )
      }

      return await this.crudBase.add(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async generatePdf(invoiceId: string): Promise<{
    creditNoteNo: string
    filePath: string
  }> {
    try {
      const creditNote = await this.crudBase.findOne(
        {
          invoice: {
            id: invoiceId,
          },
        },
        [
          'invoice',
          'invoice.campaign',
          'invoice.campaign.brand',
          'invoice.campaign.participants',
          'invoice.campaign.participants.deliverables',
        ]
      )

      const details: string[][] = []

      if (creditNote === null)
        throw new HttpException(404, 'Credit Note Not Found')

      let counter = 0

      creditNote.invoice.campaign.participants.forEach((participant) => {
        participant.deliverables.forEach((deliverable) => {
          if (counter === 0) {
            details.push([
              (counter + 1).toString(),
              deliverable.title === null ? 'IG Reel' : deliverable.title,
              '998361',
              creditNote.amount.toString(),
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

      await generateCreditNotePdf(
        {
          clientDetails: {
            name: creditNote.invoice.campaign.brand?.name as string,
            panNo: creditNote.invoice.campaign.brand?.panNo as string,
            address: creditNote.invoice.campaign.brand?.address as string,
          },
          creditNoteDetails: {
            creditNoteNo: creditNote.creditNoteNo,
            creditNoteDate: new Date(creditNote.creditNoteDate).toDateString(),
          },
          invoiceDetails: {
            total: creditNote.amount.toString(),
            sgst: creditNote.sgst.toString(),
            cgst: creditNote.cgst.toString(),
            igst: creditNote.igst.toString(),
            amount: creditNote.total.toString(),
            amountInWords: numWords(creditNote.total),
            data: details,
          },
        },
        filePath
      )

      return {
        creditNoteNo: creditNote.creditNoteNo,
        filePath,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async downloadCreditNote(invoiceId: string): Promise<string> {
    try {
      const { creditNoteNo, filePath } = await this.generatePdf(invoiceId)

      const publicUrl = await uploadPdfToFirebase(
        filePath,
        `reports/${creditNoteNo}_${new Date()}.pdf`
      )

      fs.unlinkSync(filePath)
      return publicUrl
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { CreditNoteService }
