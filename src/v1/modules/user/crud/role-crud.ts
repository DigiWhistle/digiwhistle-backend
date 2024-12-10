import { CRUDBase } from '../../../../utils'
import { type IRole } from '../interface'
import { IRoleCRUD } from '../interface'
import { EntityTarget } from 'typeorm'

export class RoleCRUD extends CRUDBase<IRole> implements IRoleCRUD {
  private static instance: IRoleCRUD | null = null

  static getInstance(role: EntityTarget<IRole>): IRoleCRUD {
    if (RoleCRUD.instance === null) {
      RoleCRUD.instance = new RoleCRUD(role)
    }
    return RoleCRUD.instance
  }

  private constructor(role: EntityTarget<IRole>) {
    super(role)
  }
}
