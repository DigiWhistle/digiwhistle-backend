import { ContactUsFormCRUD, ContactUsConfigCRUD } from './crud'
import { ContactUsFormService, ContactUsConfigService } from './service'
import { ContactUsForm, ContactUsConfig } from './models'
import { MailerService } from '../../utils'

const contactUsFormCRUD = ContactUsFormCRUD.getInstance(ContactUsForm)

const contactUsConfigCRUD = ContactUsConfigCRUD.getInstance(ContactUsConfig)
const contactUsConfigService =
  ContactUsConfigService.getInstance(contactUsConfigCRUD)

const contactUsFormService = ContactUsFormService.getInstance(
  contactUsFormCRUD,
  contactUsConfigService,
  MailerService.getInstance()
)

export { contactUsFormService, contactUsConfigService }
