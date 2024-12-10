import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IContactUsForm } from '../interface'
import { IContactUsFormCRUD } from '../interface'

export class ContactUsFormCRUD
  extends CRUDBase<IContactUsForm>
  implements IContactUsFormCRUD
{
  private static instance: IContactUsFormCRUD | null = null

  static getInstance(
    contactUsForm: EntityTarget<IContactUsForm>
  ): IContactUsFormCRUD {
    if (ContactUsFormCRUD.instance === null) {
      ContactUsFormCRUD.instance = new ContactUsFormCRUD(contactUsForm)
    }
    return ContactUsFormCRUD.instance
  }

  private constructor(contactUsForm: EntityTarget<IContactUsForm>) {
    super(contactUsForm)
  }
}
