import PDFDocument from 'pdfkit-table'
import fs from 'fs'

export const generateProformaInvoicePdf = (
  data: {
    clientDetails: {
      name: string
      address: string
      panNo: string
      gstNo: string
    }
    invoiceDetails: {
      invoiceNo: string
      invoiceDate: string
      total: string
      cgst: string
      sgst: string
      igst: string
      amountInWords: string
      amount: string
      data: string[][]
    }
  },
  filePath: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Create a document
    const doc = new PDFDocument()
    const stream = fs.createWriteStream(filePath)

    // Pipe its output somewhere, like to a file
    doc.pipe(stream)

    // Add some borders
    doc
      .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
      .lineWidth(2)
      .stroke()

    // Add logo
    doc.image('static/assests/logo.png', doc.page.width / 2 - 100, 55, {
      width: 200,
      height: 30,
      align: 'center',
    })

    doc.moveDown()

    // Add agency details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Digital Marketing Agency', { align: 'center' })

    doc.font('Helvetica').fontSize(10)
    doc.text('Off - 408, Paramount Golfforeste, Zeta I, Gr.Noida, UP.', {
      align: 'center',
    })

    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()

    doc.moveDown()

    // Add heading
    doc.fontSize(10).text('Proforma Invoice', {
      align: 'center',
    })

    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()

    doc.moveDown()

    const width = doc.page.width
    const xLeft = 50
    const xRight = width - 150
    const y = 150
    const columnWidth = (width - 100) / 2
    const columnMargin = 3

    // Add recipient details
    doc.fontSize(10).text('To:', xLeft + columnMargin, y, {
      width: columnWidth,
      align: 'left',
    })
    doc.text(`${data.clientDetails.name}`, xLeft + columnMargin, y + 15, {
      width: columnWidth,
      align: 'left',
    })
    doc.text(`${data.clientDetails.address}`, xLeft + columnMargin, y + 30, {
      width: columnWidth,
      align: 'left',
    })
    doc.text(
      `PAN Number : ${data.clientDetails.panNo}`,
      xLeft + columnMargin,
      y + 60,
      {
        width: columnWidth,
        align: 'left',
      }
    )
    doc.text(
      `GSTIN : ${data.clientDetails.gstNo}`,
      xLeft + columnMargin,
      y + 75,
      {
        width: columnWidth,
        align: 'left',
      }
    )

    // Add credit note number and date
    doc.text(`Invoice No: ${data.invoiceDetails.invoiceNo}`, xRight - 1, y)
    doc.text(
      `Invoice Date: ${data.invoiceDetails.invoiceDate}`,
      xRight - 1,
      y + 30
    )

    doc
      .moveTo(50, doc.y + 35)
      .lineTo(doc.page.width - 50, doc.y + 35)
      .stroke()

    doc.moveDown()

    doc.table(
      {
        headers: ['S.No.', 'Particulars', 'SAC Code', 'Amount (Rs.)'],
        rows: data.invoiceDetails.data,
      },
      {
        padding: [0, 10, 10, 10],
        x: 50,
        y: doc.y + 32,
        width: doc.page.width - 100,
      }
    )

    doc
      .moveTo(50, doc.y + 180)
      .lineTo(doc.page.width - 50, doc.y + 180)
      .stroke()

    doc.table(
      {
        headers: ['S.No.', 'Particulars', 'SAC Code', 'Amount (Rs.)'],
        rows: [
          [' ', ' ', 'Total', `${data.invoiceDetails.total}`],
          [' ', ' ', 'IGST-18%', `${data.invoiceDetails.igst}`],
          [' ', ' ', 'CGST-9%', `${data.invoiceDetails.cgst}`],
          [' ', ' ', 'SGST-9%', `${data.invoiceDetails.sgst}`],
          [
            ' ',
            `${data.invoiceDetails.amountInWords}`,
            `${data.invoiceDetails.amount}`,
          ],
        ],
      },
      {
        padding: [0, 10, 10, 10],
        x: 50,
        y: doc.y + 180,
        width: doc.page.width - 100,
        hideHeader: true,
      }
    )

    let y2 = doc.y

    // Add bank details
    doc.text('Bank Details:', xLeft + columnMargin, y2, {
      align: 'left',
      width: (doc.page.width - 100) / 2,
    })
    doc.text('ICICI Bank Ltd', xLeft + columnMargin, y2 + 10, {
      align: 'left',
      width: (doc.page.width - 100) / 2,
    })
    doc.text('Name : DIGIWHISTLE', xLeft + columnMargin, y2 + 20, {
      align: 'left',
      width: (doc.page.width - 100) / 2,
    })
    doc.text('Current A/C : 348805003163', xLeft + columnMargin, y2 + 30, {
      align: 'left',
      width: (doc.page.width - 100) / 2,
    })
    doc.text('IFSC : ICIC0003488', xLeft + columnMargin, y2 + 40, {
      align: 'left',
      width: (doc.page.width - 100) / 2,
    })

    // Add company details
    doc.text('DIGIWHISTLE', xRight - 1, y2)
    doc.text('Pan No: AAUFD0323P', xRight - 1, y2 + 10)
    doc.text('GSTIN : 09AAUFD0323P1ZY', xRight - 1, y2 + 30)
    doc.moveDown()

    doc
      .moveTo(50, y2 + 50)
      .lineTo(doc.page.width - 50, y2 + 50)
      .stroke()

    // Add footer
    doc.text('For Digiwhistle', { align: 'right' })
    doc.moveDown(6)
    doc.text('Authorised Signatory', { align: 'right' })

    // Finalize PDF file
    doc.end()

    stream.on('finish', () => {
      resolve(true)
    })

    stream.on('error', (err) => {
      reject(err)
    })
  })
}
