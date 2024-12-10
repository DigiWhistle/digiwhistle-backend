import { DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import {
  BaseService,
  HttpException,
  uploadPdfToFirebase,
} from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import {
  IAgencyProfile,
  IAgencyProfileCRUD,
  IAgencyProfileService,
} from '../interface'
import { AppDataSource } from '../../../../config'
import { AgencyProfile, SearchCredits } from '../models'
import { IZohoSignService } from '../../utils/zoho-sign-service'

class AgencyProfileService
  extends BaseService<IAgencyProfile, IAgencyProfileCRUD>
  implements IAgencyProfileService
{
  private static instance: IAgencyProfileService | null = null
  private readonly zohoSignService: IZohoSignService

  static getInstance(
    agencyProfileCRUD: IAgencyProfileCRUD,
    zohoSignService: IZohoSignService
  ) {
    if (AgencyProfileService.instance === null) {
      AgencyProfileService.instance = new AgencyProfileService(
        agencyProfileCRUD,
        zohoSignService
      )
    }

    return AgencyProfileService.instance
  }

  private constructor(
    agencyProfileCRUD: IAgencyProfileCRUD,
    zohoSignService: IZohoSignService
  ) {
    super(agencyProfileCRUD)
    this.zohoSignService = zohoSignService
  }

  async add(data: DeepPartial<IAgencyProfile>): Promise<IAgencyProfile> {
    try {
      let resp: IAgencyProfile | null = null

      AppDataSource.manager.transaction(async (manager) => {
        resp = await manager.save(AgencyProfile, data)

        await manager.save(SearchCredits, {
          agency: {
            id: resp.id,
          },
        })
      })

      if (resp === null)
        throw new HttpException(500, 'Unable to process request')

      return resp
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAllAgencies(
    page: number,
    limit: number,
    approved?: string,
    rejected?: string,
    name?: string
  ): Promise<PaginatedResponse<IAgencyProfile>> {
    try {
      let query: FindOptionsWhere<IAgencyProfile>[] = []
      let nameQuery: FindOptionsWhere<IAgencyProfile> = {}

      if (typeof name === 'string') {
        nameQuery = {
          name: ILike(`%${name}%`),
        }
      }

      if (typeof approved === 'string') {
        if (approved === 'true') {
          query.push({
            ...nameQuery,
            user: {
              isApproved: true,
            },
          })
        }
      }

      if (typeof rejected === 'string') {
        if (rejected === 'true') {
          query.push({
            ...nameQuery,
            user: {
              isApproved: false,
            },
          })
        }
      }

      if (query.length === 0 && Object.keys(nameQuery).length !== 0) {
        query.push(nameQuery)
      }

      const data = await this.findAllPaginated(page, limit, query, ['user'], {
        createdAt: 'DESC',
      })

      data.data = data.data.map((value) => {
        return {
          ...value,
          isAgreementSent: value.agreement === null ? false : true,
        }
      })

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAgreement(id: string): Promise<string> {
    try {
      const agency = await this.crudBase.findOne({ id: id })

      if (agency === null) {
        throw new HttpException(404, 'No Agency Found')
      }

      if (agency.agreement === null) {
        throw new HttpException(404, 'No Agreement Found')
      }

      const path = await this.zohoSignService.getDocumentPdf(agency.agreement)

      const url = uploadPdfToFirebase(path, `agreements/${id}.pdf`)
      return url
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { AgencyProfileService }
