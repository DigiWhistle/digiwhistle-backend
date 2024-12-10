import { ICRUDBase } from '../../../../utils'
import { IVerification } from './IModels'

export interface IVerificationCRUD extends ICRUDBase<IVerification> {
  createOrUpdate(data: Partial<IVerification>): Promise<void>
}
