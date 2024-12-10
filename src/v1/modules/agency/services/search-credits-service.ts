import { BaseService, HttpException } from '../../../../utils'
import { ISearchCredits, ISearchCreditsCRUD } from '../interface'
import { ISearchCreditsService } from '../interface/IService'

export class SearchCreditsService
  extends BaseService<ISearchCredits, ISearchCreditsCRUD>
  implements ISearchCreditsService
{
  private static instance: ISearchCreditsService | null = null

  static getInstance = (searchCreditsCRUD: ISearchCreditsCRUD) => {
    if (SearchCreditsService.instance === null) {
      SearchCreditsService.instance = new SearchCreditsService(
        searchCreditsCRUD
      )
    }
    return SearchCreditsService.instance
  }

  private constructor(searchCreditsCRUD: ISearchCreditsCRUD) {
    super(searchCreditsCRUD)
  }

  async resetCreditLimit(): Promise<void> {
    try {
      const data = await this.crudBase.findAll(undefined)

      const _data = data.map((value) => {
        return {
          ...value,
          id: value.id,
          creditLimit: 100,
          lastUpdatedAt: new Date(),
        }
      })

      await this.crudBase.insertMany(_data)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
