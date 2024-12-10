import { EntityTarget } from 'typeorm'
import { CRUDBase, HttpException } from '../../../../utils'
import { ISearchCredits, ISearchCreditsCRUD } from '../interface'

export class SearchCreditsCRUD
  extends CRUDBase<ISearchCredits>
  implements ISearchCreditsCRUD
{
  private static instance: ISearchCreditsCRUD | null = null
  static getInstance = (searchCredits: EntityTarget<ISearchCredits>) => {
    if (SearchCreditsCRUD.instance === null) {
      SearchCreditsCRUD.instance = new SearchCreditsCRUD(searchCredits)
    }
    return SearchCreditsCRUD.instance
  }

  private constructor(searchCredits: EntityTarget<ISearchCredits>) {
    super(searchCredits)
  }

  async insertMany(data: ISearchCredits[]): Promise<void> {
    try {
      await this.repository
        .createQueryBuilder()
        .insert()
        .into(this.repository.target)
        .values(data)
        .orUpdate(['credits', 'lastUpdatedAt'], ['id'])
        .execute()
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
