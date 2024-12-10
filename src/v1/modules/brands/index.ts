import { BrandProfile } from './models'
import { BrandProfileService } from './services'
import { BrandProfileCRUD } from './crud'
import { MailerService } from '../../utils'

const brandProfileCRUD = BrandProfileCRUD.getInstance(BrandProfile)
const brandProfileService = BrandProfileService.getInstance(
  brandProfileCRUD,
  MailerService.getInstance()
)

export { brandProfileService }
