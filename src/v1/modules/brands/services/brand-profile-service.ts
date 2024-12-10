import { DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import { BaseService, HttpException } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IBrandProfile, IBrandProfileCRUD } from '../interface'
import { IBrandProfileService } from '../interface/IService'
import { IMailerService } from '../../../utils'

class BrandProfileService
  extends BaseService<IBrandProfile, IBrandProfileCRUD>
  implements IBrandProfileService
{
  private static instance: IBrandProfileService | null = null
  private mailerService: IMailerService

  static getInstance(
    brandProfileCRUD: IBrandProfileCRUD,
    mailerService: IMailerService
  ) {
    if (BrandProfileService.instance === null) {
      BrandProfileService.instance = new BrandProfileService(
        brandProfileCRUD,
        mailerService
      )
    }

    return BrandProfileService.instance
  }

  private constructor(
    brandProfileCRUD: IBrandProfileCRUD,
    mailerService: IMailerService
  ) {
    super(brandProfileCRUD)
    this.mailerService = mailerService
  }

  async add(data: DeepPartial<IBrandProfile>): Promise<IBrandProfile> {
    try {
      const results = await this.crudBase.add(data)

      const brandProfile = await this.crudBase.findOne({ id: results.id })

      if (!brandProfile) {
        throw new HttpException(500, 'Internal Server error')
      }

      this.mailerService
        .sendMail(
          brandProfile?.user.email as string,
          'You are invited to Join Digiwhistle',
          `<p>You are invited to Join your team, please login at the following link:</p><p>${process.env.FRONTEND_URL}/login</p><p> Your credentials are:</p><p>email: ${brandProfile?.user.email} <br>password: 'digiwhistle@123'</p><p>Please Click on the following link to complete your registration:</p><p>${process.env.FRONTEND_URL}/login</p>`
        )
        .then()
        .catch((e) => {
          console.log(e)
        })

      return results
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAllBrands(
    page: number,
    limit: number,
    approved?: string,
    rejected?: string,
    name?: string
  ): Promise<PaginatedResponse<IBrandProfile>> {
    try {
      let query: FindOptionsWhere<IBrandProfile>[] = []
      let nameQuery: FindOptionsWhere<IBrandProfile> = {}

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
      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findBrandsByName(name: string): Promise<IBrandProfile[]> {
    try {
      const data = await this.crudBase.findAll({
        name: ILike(`%${name}%`),
      })

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getBrandsList(): Promise<IBrandProfile[]> {
    try {
      const data = await this.crudBase.findAllPaginated(
        1,
        30,
        {
          user: {
            isApproved: true,
          },
        },
        [],
        { createdAt: 'DESC' }
      )

      return data.data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}

export { BrandProfileService }
