import { Parser } from 'json2csv'

const generateCSV = (data: any, fields: string[]) => {
  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(data)
  return csv
}

export { generateCSV }
