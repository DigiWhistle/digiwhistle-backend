import { HttpException } from '../../../utils'
import { IAxiosService } from '../../utils/axios-service'
import fs from 'fs'
export interface IZohoSignService {
  sendTemplateForSigning(templateId: string, body: any): Promise<string>
  getDocumentPdf(documentId: string): Promise<string>
  getTemplates(templateId: string): Promise<any>
}

export class ZohoSignService implements IZohoSignService {
  private static instance: IZohoSignService | null = null
  private readonly axiosService: IAxiosService
  private readonly refreshToken = process.env.ZOHO_REFRESH_TOKEN
  private readonly clientSecret = process.env.ZOHO_CLIENT_SECRET
  private readonly clientId = process.env.ZOHO_CLIENT_ID

  static getInstance = (axiosService: IAxiosService) => {
    if (ZohoSignService.instance === null)
      ZohoSignService.instance = new ZohoSignService(axiosService)
    return ZohoSignService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  private async generateAccessToken(): Promise<string> {
    try {
      const response = await this.axiosService.post(
        `https://accounts.zoho.in/oauth/v2/token?refresh_token=${this.refreshToken}&client_id=${this.clientId}&client_secret=${this.clientSecret}&redirect_uri=https%3A%2F%2Fsign.zoho.com&grant_type=refresh_token`,
        {}
      )

      return response.access_token
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getTemplates(templateId: string): Promise<any> {
    try {
      const token = await this.generateAccessToken()

      const response = await this.axiosService.get(
        `https://sign.zoho.in/api/v1/templates/${templateId}`,
        {},
        {
          Authorization: `Zoho-oauthtoken ${token}`,
        }
      )

      return response
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async sendTemplateForSigning(templateId: string, body: any): Promise<string> {
    try {
      const token = await this.generateAccessToken()

      const response = await this.axiosService.post(
        `https://sign.zoho.in/api/v1/templates/${templateId}/createdocument`,
        body,
        {
          Authorization: `Zoho-oauthtoken ${token}`,
        }
      )

      const documentId = response.requests?.request_id

      return documentId
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getDocumentPdf(documentId: string): Promise<string> {
    try {
      const token = await this.generateAccessToken()

      const response = await this.axiosService.get(
        `https://sign.zoho.in/api/v1/requests/${documentId}/pdf`,
        {},
        {
          Authorization: `Zoho-oauthtoken ${token}`,
          Accept: 'application/pdf',
        }
      )

      // Save the PDF response to a file
      const pdfContent = Buffer.from(response, 'binary')
      const filePath = `./reports/${documentId}.pdf`

      fs.writeFileSync(filePath, pdfContent)

      return filePath
    } catch (e) {
      console.log(e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

// 77631000000039001  Agency Template

//   77631000000035315 Influencer Template
