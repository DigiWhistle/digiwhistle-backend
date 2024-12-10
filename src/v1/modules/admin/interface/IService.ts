import { IBaseService } from '../../../../utils'
import { AddAdmin, AddAdminOrEmployeeInput, remarksResponse } from '../types'
import { IAdminProfileCRUD, IEmployeeProfileCRUD, IRemarksCRUD } from './ICRUD'
import { IAdminProfile, IEmployeeProfile, IRemarks } from './IModels'

export interface IAdminProfileService
  extends IBaseService<IAdminProfile, IAdminProfileCRUD> {}

export interface IEmployeeProfileService
  extends IBaseService<IEmployeeProfile, IEmployeeProfileCRUD> {
  findEmployeesByName(name: string): Promise<IEmployeeProfile[]>
  findEmployeesByEmail(email: string): Promise<IEmployeeProfile[]>
}

export interface IAdminService {
  addAdmin(data: AddAdminOrEmployeeInput): Promise<void>
}

export interface IEmployeeService {
  addEmployee(data: AddAdminOrEmployeeInput): Promise<void>
}

export interface IRemarksService extends IBaseService<IRemarks, IRemarksCRUD> {
  clearAllRemarksByUserId(userId: string): Promise<void>
}
