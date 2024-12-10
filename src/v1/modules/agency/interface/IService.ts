import { IBaseService } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IAgencyProfileCRUD, ISearchCreditsCRUD } from './ICRUD'
import { IAgencyProfile, ISearchCredits } from './IModels'

export interface IAgencyProfileService
  extends IBaseService<IAgencyProfile, IAgencyProfileCRUD> {
  getAllAgencies(
    page: number,
    limit: number,
    approved?: string,
    rejected?: string,
    name?: string
  ): Promise<PaginatedResponse<IAgencyProfile>>
}

export interface ISearchCreditsService
  extends IBaseService<ISearchCredits, ISearchCreditsCRUD> {}
