import { DeepPartial, EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { IContactUsConfig, IContactUsConfigCRUD } from '../interface'

export class ContactUsConfigCRUD
  extends CRUDBase<IContactUsConfig>
  implements IContactUsConfigCRUD
{
  private static instance: IContactUsConfigCRUD | null = null

  static getInstance = (contactUsConfig: EntityTarget<IContactUsConfig>) => {
    if (ContactUsConfigCRUD.instance === null) {
      ContactUsConfigCRUD.instance = new ContactUsConfigCRUD(contactUsConfig)
    }
    return ContactUsConfigCRUD.instance
  }

  constructor(contactUsConfig: EntityTarget<IContactUsConfig>) {
    super(contactUsConfig)
  }

  async insertMany(data: DeepPartial<IContactUsConfig[]>): Promise<void> {
    try {
      await this.repository.save(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
