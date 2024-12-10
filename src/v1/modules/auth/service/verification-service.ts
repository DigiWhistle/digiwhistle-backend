import { BaseService, HttpException } from '../../../../utils'
import { IVerification, IVerificationService } from '../interface'
import { IVerificationCRUD } from '../interface'

class VerificationService
  extends BaseService<IVerification, IVerificationCRUD>
  implements IVerificationService
{
  private static instance: IVerificationService | null = null

  static getInstance(
    verificationCRUD: IVerificationCRUD
  ): IVerificationService {
    if (VerificationService.instance === null) {
      VerificationService.instance = new VerificationService(verificationCRUD)
    }
    return VerificationService.instance
  }

  private constructor(verificationCRUD: IVerificationCRUD) {
    super(verificationCRUD)
  }

  public async createOrUpdate(data: Partial<IVerification>): Promise<void> {
    try {
      await this.crudBase.createOrUpdate(data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
export { VerificationService }
