import { DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import { Enum } from '../../../../constants'
import { HttpException } from '../../../../utils'
import { BaseService, PaginatedResponse } from '../../../../utils/base-service'
import {
  IContactUsConfigService,
  IContactUsForm,
  IContactUsService,
} from '../interface'
import { IContactUsFormCRUD } from '../interface'
import { IMailerService } from '../../../utils'
import { IUser } from '../../user/interface'

export class ContactUsFormService
  extends BaseService<IContactUsForm, IContactUsFormCRUD>
  implements IContactUsService
{
  private static instance: IContactUsService | null = null
  private readonly contactUsConfigService: IContactUsConfigService
  private readonly mailerService: IMailerService

  static getInstance(
    contactUsFormCRUD: IContactUsFormCRUD,
    contactUsConfigService: IContactUsConfigService,
    mailerService: IMailerService
  ): IContactUsService {
    if (ContactUsFormService.instance === null) {
      ContactUsFormService.instance = new ContactUsFormService(
        contactUsFormCRUD,
        contactUsConfigService,
        mailerService
      )
    }
    return ContactUsFormService.instance
  }

  private constructor(
    contactUsFormCRUD: IContactUsFormCRUD,
    contactUsConfigService: IContactUsConfigService,
    mailerService: IMailerService
  ) {
    super(contactUsFormCRUD)
    this.contactUsConfigService = contactUsConfigService
    this.mailerService = mailerService
  }

  private sendNotificationMail(email: string, name: string, message: string) {
    this.mailerService.sendMail(
      email,
      'New Contact Us Query',
      `<p>Name: ${name}</p><p>Message: ${message}</p><p>To view more details, login to your dashboard.</p>`
    )
  }

  async add(data: DeepPartial<IContactUsForm>): Promise<IContactUsForm> {
    try {
      const results = await this.crudBase.add(data)

      if (
        results.followersCount === null ||
        results.followersCount === undefined
      )
        return results

      const contactUsConfig = await this.contactUsConfigService.findOne(
        {
          followersCount: results.followersCount,
        },
        ['employee']
      )

      if (contactUsConfig) {
        this.sendNotificationMail(
          contactUsConfig.employee.email,
          results.name,
          results.message as string
        )
      }

      return results
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findAllContactUs(
    page: number,
    limit: number,
    user: IUser,
    name?: string,
    brands?: string,
    influencer?: string
  ): Promise<PaginatedResponse<IContactUsForm>> {
    try {
      let query: FindOptionsWhere<IContactUsForm>[] = []

      if (brands === 'true') {
        query.push({
          personType: Enum.PersonType.BRAND,
        })
      }

      if (influencer === 'true') {
        query.push({
          personType: Enum.PersonType.INFLUENCER,
        })
      }

      if (typeof name === 'string') {
        query.push({
          name: ILike(`%${name}%`),
        })
      }

      if (user.role.id === Enum.ROLES.EMPLOYEE) {
        const contactUsConfig = await this.contactUsConfigService.findOne(
          {
            employee: {
              user: {
                id: user.id,
              },
            },
          },
          ['employee', 'employee.user']
        )

        if (contactUsConfig === null)
          return {
            data: [],
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
          }

        for (let i = 0; i < query.length; i++) {
          query[i] = {
            ...query[i],
            followersCount: contactUsConfig.followersCount,
          }
        }
      }

      const data = await this.findAllPaginated(page, limit, query, [], {
        id: 'DESC',
      })

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
