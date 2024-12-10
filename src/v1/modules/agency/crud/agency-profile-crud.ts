import { EntityTarget } from 'typeorm'
import { CRUDBase } from '../../../../utils'
import { IAgencyProfile, IAgencyProfileCRUD } from '../interface'

class AgencyProfileCRUD
  extends CRUDBase<IAgencyProfile>
  implements IAgencyProfileCRUD
{
  private static instance: IAgencyProfileCRUD | null = null

  static getInstance(agencyProfile: EntityTarget<IAgencyProfile>) {
    if (AgencyProfileCRUD.instance === null) {
      AgencyProfileCRUD.instance = new AgencyProfileCRUD(agencyProfile)
    }
    return AgencyProfileCRUD.instance
  }

  private constructor(agencyProfile: EntityTarget<IAgencyProfile>) {
    super(agencyProfile)
  }
}

export { AgencyProfileCRUD }
