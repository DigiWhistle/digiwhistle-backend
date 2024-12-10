import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IBrandProfile, IBrandProfileCRUD } from '../interface'

class BrandProfileCRUD
  extends CRUDBase<IBrandProfile>
  implements IBrandProfileCRUD
{
  private static instance: IBrandProfileCRUD | null = null

  static getInstance(brandProfile: EntityTarget<IBrandProfile>) {
    if (BrandProfileCRUD.instance === null) {
      BrandProfileCRUD.instance = new BrandProfileCRUD(brandProfile)
    }
    return BrandProfileCRUD.instance
  }

  private constructor(brandProfile: EntityTarget<IBrandProfile>) {
    super(brandProfile)
  }
}

export { BrandProfileCRUD }
