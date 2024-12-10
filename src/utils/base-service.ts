import {
  type ObjectLiteral,
  type DeepPartial,
  type FindOptionsWhere,
  type FindOptionsOrder,
} from 'typeorm'
import { type ICRUDBase } from './base-crud'
import HttpException from './http-exception'

export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalCount?: number
}

export interface IBaseService<T extends ObjectLiteral, C extends ICRUDBase<T>> {
  add: (data: DeepPartial<T>) => Promise<T>
  findAll: (
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>> | undefined,
    relations?: string[],
    order?: FindOptionsOrder<T>
  ) => Promise<T[]>
  findAllPaginated: (
    page: number,
    limit: number,
    query?: FindOptionsWhere<T> | Array<FindOptionsWhere<T>> | undefined,
    relations?: string[],
    order?: FindOptionsOrder<T>
  ) => Promise<PaginatedResponse<T>>
  findOne: (
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
    relations?: string[]
  ) => Promise<T | null>
  update: (
    query: FindOptionsWhere<T>,
    data: Partial<T>,
    relations?: string[]
  ) => Promise<T>
  delete: (query: FindOptionsWhere<T>) => Promise<void>
}

export abstract class BaseService<
  T extends ObjectLiteral,
  C extends ICRUDBase<T>,
> implements IBaseService<T, C>
{
  protected readonly crudBase: C

  constructor(crudBase: C) {
    this.crudBase = crudBase
  }

  async add(data: DeepPartial<T>): Promise<T> {
    try {
      const results = await this.crudBase.add(data)
      return results
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findAll(
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>> | undefined,
    relations: string[] = [],
    order?: FindOptionsOrder<T>
  ): Promise<T[]> {
    try {
      return await this.crudBase.findAll(query, relations, order)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findOne(
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
    relations: string[] = []
  ): Promise<T | null> {
    try {
      const data = await this.crudBase.findOne(query, relations)

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async update(
    query: FindOptionsWhere<T>,
    data: Partial<T>,
    relations?: string[]
  ): Promise<T> {
    try {
      const results = await this.crudBase.update(query, data, relations)
      return results
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async delete(query: FindOptionsWhere<T>): Promise<void> {
    try {
      await this.crudBase.delete(query)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findAllPaginated(
    page: number,
    limit: number,
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>> | undefined,
    relations: string[],
    order?: FindOptionsOrder<T>
  ): Promise<PaginatedResponse<T>> {
    try {
      return await this.crudBase.findAllPaginated(
        page,
        limit,
        query,
        relations,
        order
      )
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
