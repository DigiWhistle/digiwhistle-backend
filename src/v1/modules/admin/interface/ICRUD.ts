import { ICRUDBase } from '../../../../utils'
import { AddAdmin, AddEmployee } from '../types'
import { IAdminProfile, IRemarks } from './IModels'
import { IEmployeeProfile } from './IModels'

export interface IAdminProfileCRUD extends ICRUDBase<IAdminProfile> {}

export interface IEmployeeProfileCRUD extends ICRUDBase<IEmployeeProfile> {}

export interface IEmployeeCRUD {
  addEmployee(data: AddEmployee): Promise<void>
}

export interface IAdminCRUD {
  addAdmin(data: AddAdmin): Promise<void>
}

export interface IRemarksCRUD extends ICRUDBase<IRemarks> {}
