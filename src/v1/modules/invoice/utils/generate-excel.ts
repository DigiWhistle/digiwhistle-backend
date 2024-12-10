import Exceljs from 'exceljs'

export const generateExcel = async (data: any, fileName: string) => {
  const workbook = new Exceljs.Workbook()

  for (const sheetInfo of data) {
    const sheet = workbook.addWorksheet(sheetInfo.name)
    sheetInfo.data.forEach((row: string[]) => sheet.addRow(row))
  }

  await workbook.xlsx.writeFile(fileName)
}
