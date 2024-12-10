import { ILike } from 'typeorm'
import {
  BaseService,
  HttpException,
  uploadPdfToFirebase,
} from '../../../../utils'
import { IInfluencerProfile, IInfluencerProfileCRUD } from '../interface'
import { IInfluencerProfileService } from '../interface/IService'
import { InfluencerByEmailResponse, InfluencerStats } from '../types'
import { IZohoSignService } from '../../utils/zoho-sign-service'

class InfluencerProfileService
  extends BaseService<IInfluencerProfile, IInfluencerProfileCRUD>
  implements IInfluencerProfileService
{
  private static instance: IInfluencerProfileService | null = null
  private readonly zohoSignService: IZohoSignService

  static getInstance(
    InfluencerProfileCRUD: IInfluencerProfileCRUD,
    zohoSignService: IZohoSignService
  ) {
    if (InfluencerProfileService.instance === null) {
      InfluencerProfileService.instance = new InfluencerProfileService(
        InfluencerProfileCRUD,
        zohoSignService
      )
    }

    return InfluencerProfileService.instance
  }

  private constructor(
    influencerProfileCRUD: IInfluencerProfileCRUD,
    zohoSignService: IZohoSignService
  ) {
    super(influencerProfileCRUD)
    this.zohoSignService = zohoSignService
  }

  async findInfluencerByEmail(
    email: string
  ): Promise<InfluencerByEmailResponse[]> {
    try {
      const influencer = await this.findAll(
        {
          user: {
            email: ILike(`%${email}%`),
          },
        },
        ['user']
      )

      const data = influencer.map((item) => {
        return {
          email: item.user.email,
          profile: item.id,
        }
      })

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getInfluencerStats(): Promise<InfluencerStats> {
    try {
      return await this.crudBase.getInfluencerStats()
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAgreement(id: string): Promise<string> {
    try {
      const influencer = await this.crudBase.findOne({ id: id })

      if (influencer === null) {
        throw new HttpException(404, 'No Influencer Found')
      }

      if (influencer.agreement === null) {
        throw new HttpException(404, 'No Agreement Found')
      }

      const path = await this.zohoSignService.getDocumentPdf(
        influencer.agreement
      )

      const url = uploadPdfToFirebase(path, `agreements/${id}.pdf`)
      return url
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { InfluencerProfileService }
