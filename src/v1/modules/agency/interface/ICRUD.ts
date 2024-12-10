import { ICRUDBase } from '../../../../utils'
import { IAgencyProfile, ISearchCredits } from './IModels'

export interface IAgencyProfileCRUD extends ICRUDBase<IAgencyProfile> {}

export interface ISearchCreditsCRUD extends ICRUDBase<ISearchCredits> {
  insertMany(data: ISearchCredits[]): Promise<void>
}
