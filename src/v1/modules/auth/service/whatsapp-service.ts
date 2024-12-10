import { AppLogger, HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import querystring from 'querystring'
import { IWhatsappService } from '../interface'

class WhatsappService implements IWhatsappService {
  private static instance: IWhatsappService | null = null
  private readonly axiosService: IAxiosService

  static getInstance(axiosService: IAxiosService) {
    if (WhatsappService.instance === null) {
      WhatsappService.instance = new WhatsappService(axiosService)
    }
    return WhatsappService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async sendMessage(
    destination: string | string[],
    code: string
  ): Promise<void> {
    try {
      const formData = querystring.stringify({
        channel: 'whatsapp',
        source: '918920753781',
        destination: `${destination}`,
        'src.name': 'DigiWhistle',
        template: `{"id":"aa89ed5c-abef-4090-b10d-dff3ac3529f4","params":[${code},${code}]}`,
      })

      const resp = await this.axiosService.post(
        `${process.env.GUPSHUP_API}`,
        formData,
        {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: `${process.env.GUPSHUP_API_KEY}`,
        }
      )
    } catch (e) {
      AppLogger.getInstance().error(`Error in whatsapp service: ${e}`)
    }
  }
}

export { WhatsappService }
