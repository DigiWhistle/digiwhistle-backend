import { DeepPartial } from 'typeorm'
import { ICRUDBase } from '../../../../utils'
import { IAddInfluencer, InfluencerStats } from '../types'
import {
  IInfluencerProfile,
  IInstagramProfileStats,
  ILinkedInProfileStats,
  ITwitterProfileStats,
  IYoutubeProfileStats,
} from './IModels'

export interface IInfluencerProfileCRUD extends ICRUDBase<IInfluencerProfile> {
  getInfluencerStats(): Promise<InfluencerStats>
}

export interface IInstagramProfileStatsCRUD
  extends ICRUDBase<IInstagramProfileStats> {
  addOrUpdate(data: DeepPartial<IInstagramProfileStats>): Promise<void>
}

export interface IYoutubeProfileStatsCRUD
  extends ICRUDBase<IYoutubeProfileStats> {
  addOrUpdate(data: DeepPartial<IYoutubeProfileStats>): Promise<void>
}

export interface ITwitterProfileStatsCRUD
  extends ICRUDBase<ITwitterProfileStats> {
  addOrUpdate(data: DeepPartial<ITwitterProfileStats>): Promise<void>
}

export interface ILinkedInProfileStatsCRUD
  extends ICRUDBase<ILinkedInProfileStats> {
  addOrUpdate(data: DeepPartial<ILinkedInProfileStats>): Promise<void>
}

export interface IInfluencerCRUD {
  addInfluencer(data: IAddInfluencer): Promise<IInfluencerProfile>
}
