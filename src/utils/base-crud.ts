import { AppDataSource } from '../config'
import { type PaginatedResponse } from './base-service'
import HttpException from './http-exception'
import {
  type DeepPartial,
  type EntityTarget,
  type ObjectLiteral,
  type Repository,
  type FindOptionsWhere,
  type FindOptionsOrder,
} from 'typeorm'

export interface ICRUDBase<T extends ObjectLiteral> {
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
  delete: (
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>
  ) => Promise<void>
}

export abstract class CRUDBase<T extends ObjectLiteral>
  implements ICRUDBase<T>
{
  protected readonly repository: Repository<T>

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity)
  }

  async add(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data)
      const resp = await this.repository.save(entity)
      return resp
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
      if (
        query === undefined ||
        query === null ||
        Object.keys(query).length === 0
      ) {
        const data = await this.repository.find({ relations, order })
        return data
      } else {
        const data = await this.repository.find({
          where: query,
          relations,
          order,
        })
        return data
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findOne(
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>,
    relations: string[] = []
  ): Promise<T | null> {
    try {
      if (query === undefined || query === null) {
        throw new HttpException(400, 'Missing parameter')
      }

      const data = await this.repository.findOne({
        where: query,
        relations,
      })

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
      if (
        query === undefined ||
        query === null ||
        Object.keys(query).length === 0
      ) {
        throw new HttpException(400, 'Missing parameter')
      }

      await this.repository.update(query, data)
      const result = await this.findOne(query, relations)

      if (result === null) throw new HttpException(404, 'Not Found')
      return result
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async delete(query: FindOptionsWhere<T>): Promise<void> {
    try {
      if (
        query === undefined ||
        query === null ||
        Object.keys(query).length === 0
      ) {
        throw new HttpException(400, 'Missing parameter')
      }

      await this.repository.delete(query)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>> | undefined,
    relations: string[],
    order?: FindOptionsOrder<T>
  ): Promise<PaginatedResponse<T>> {
    try {
      if (
        query === undefined ||
        query === null ||
        Object.keys(query).length === 0
      ) {
        const [results, total] = await this.repository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
          relations,
          order,
        })

        return {
          data: results,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          currentPage: page,
        }
      } else {
        const [results, total] = await this.repository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
          relations,
          where: query,
          order,
        })
        return {
          data: results,
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          currentPage: page,
        }
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
