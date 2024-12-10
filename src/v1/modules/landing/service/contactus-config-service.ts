import { DeepPartial, FindOptionsWhere } from 'typeorm'
import { BaseService } from '../../../../utils'
import {
  IContactUsConfig,
  IContactUsConfigCRUD,
  IContactUsConfigService,
} from '../interface'
import { AppDataSource } from '../../../../config'
import { ContactUsConfig } from '../models'

export class ContactUsConfigService
  extends BaseService<IContactUsConfig, IContactUsConfigCRUD>
  implements IContactUsConfigService
{
  private static instance: IContactUsConfigService | null = null

  static getInstance = (contactUsConfigCRUD: IContactUsConfigCRUD) => {
    if (ContactUsConfigService.instance === null) {
      ContactUsConfigService.instance = new ContactUsConfigService(
        contactUsConfigCRUD
      )
    }
    return ContactUsConfigService.instance
  }

  private constructor(contactUsConfigCRUD: IContactUsConfigCRUD) {
    super(contactUsConfigCRUD)
  }

  async insertMany(data: DeepPartial<IContactUsConfig>[]): Promise<void> {
    try {
      await AppDataSource.manager.transaction(async (manager) => {
        manager.delete(ContactUsConfig, {})

        manager.save(ContactUsConfig, data)
      })
    } catch (e) {
      throw new Error(e)
    }
  }
}
