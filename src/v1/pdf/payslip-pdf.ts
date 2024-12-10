import PDFDocument from 'pdfkit-table'
import fs from 'fs'
import { IPayrollHistory } from '../modules/payroll/interface'

export const generatePaySlipPdf = (
  payroll: IPayrollHistory,
  filePath: string
): Promise<boolean> => {
  // Function to generate horizontal lines
  function generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke()
  }

  return new Promise((resolve, reject) => {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 })
    const stream = fs.createWriteStream(filePath)

    // Save the PDF file
    doc.pipe(stream)

    // Add header
    doc.fontSize(20).text('Pay Slip', { align: 'center' })
    doc.moveDown()

    // Add employee information (in table format)
    doc.fontSize(12)
    generateHr(doc, 100)
    doc.text(
      `Employee ID: ${payroll.employeeProfile.id.substring(0, 13)}`,
      50,
      110
    )
    doc.text(`Name: ${payroll.employeeProfile.firstName}`, 300, 110)
    doc.text(`Designation: ${payroll.employeeProfile.designation}`, 50, 130)
    doc.text(`Employment Type: ${payroll.employmentType}`, 300, 130)
    doc.text(`Salary Month: ${payroll.salaryMonth}`, 50, 150)
    doc.moveDown()
    generateHr(doc, 160)

    // Add salary details table header
    doc.fontSize(14).text('Salary Details')
    doc.moveDown(2)

    // Table structure for salary components
    generateHr(doc, 200)
    doc.fontSize(12).font('Helvetica-Bold')
    doc.text('Component', 50, 210)
    doc.text('Amount (Rs)', 400, 210)
    generateHr(doc, 230)

    doc.font('Helvetica')
    doc.text('Basic Salary', 50, 240)
    doc.text(`Rs. ${payroll.basic}`, 400, 240)
    doc.text('House Rent Allowance (HRA)', 50, 260)
    doc.text(`Rs. ${payroll.hra}`, 400, 260)
    doc.text('Other Allowances', 50, 280)
    doc.text(`Rs. ${payroll.others}`, 400, 280)
    doc.text('Incentives', 50, 300)
    doc.text(`Rs. ${payroll.incentive}`, 400, 300)
    doc.text('Gross Salary (CTC)', 50, 320)
    doc.text(`Rs. ${payroll.ctc}`, 400, 320)
    doc.text('TDS Deduction', 50, 340)
    doc.text(`Rs. ${payroll.tds}`, 400, 340)
    generateHr(doc, 360)

    // Display total earnings and net salary
    doc.font('Helvetica-Bold')
    doc.text('Total Earnings', 50, 380)
    doc.text(`Rs. ${payroll.grossPay}`, 400, 380)
    doc.text('Net Salary', 50, 400)
    doc.text(`Rs. ${payroll.finalPay}`, 400, 400)
    generateHr(doc, 420)

    doc.moveDown(2)

    // Add other payroll information
    doc.fontSize(14).text('Other Information', { underline: true })
    doc.fontSize(12).font('Helvetica')
    doc.text(`Working Days: ${payroll.workingDays}`, 50, 450)
    generateHr(doc, 490)

    // Footer note
    doc.moveDown(2)
    doc
      .fontSize(10)
      .text(
        'This is a computer-generated payslip and does not require a signature.',
        {
          align: 'center',
        }
      )

    // Finalize the PDF and end the stream
    doc.end()

    stream.on('finish', () => {
      resolve(true)
    })

    stream.on('error', (error) => {
      reject(error)
    })
  })
}
