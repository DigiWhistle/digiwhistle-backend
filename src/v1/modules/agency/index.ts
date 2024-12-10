import { AgencyProfile, SearchCredits } from './models'
import { AgencyProfileService, SearchCreditsService } from './services'
import { AgencyProfileCRUD, SearchCreditsCRUD } from './crud'
import { ZohoSignService } from '../utils/zoho-sign-service'
import { AxiosService } from '../../utils'

const agencyProfileCRUD = AgencyProfileCRUD.getInstance(AgencyProfile)
const agencyProfileService = AgencyProfileService.getInstance(
  agencyProfileCRUD,
  ZohoSignService.getInstance(AxiosService.getInstance())
)

const searchCreditsCRUD = SearchCreditsCRUD.getInstance(SearchCredits)
const searchCreditsService = SearchCreditsService.getInstance(searchCreditsCRUD)

export { agencyProfileService, searchCreditsService }
