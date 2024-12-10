import { IBaseService } from '../../../../utils'
import { PaginatedResponse } from '../../../../utils/base-service'
import { IBrandProfileCRUD } from './ICRUD'
import { IBrandProfile } from './IModels'

export interface IBrandProfileService
  extends IBaseService<IBrandProfile, IBrandProfileCRUD> {
  getAllBrands(
    page: number,
    limit: number,
    approved?: string,
    rejected?: string,
    name?: string
  ): Promise<PaginatedResponse<IBrandProfile>>
  findBrandsByName(name: string): Promise<IBrandProfile[]>
  getBrandsList(): Promise<IBrandProfile[]>
}
