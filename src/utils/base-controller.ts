import { type Request, type Response } from 'express'
import { type IBaseService } from './base-service'
import {
  type DeepPartial,
  type FindOptionsWhere,
  type ObjectLiteral,
} from 'typeorm'
import { errorHandler } from './error-handler'
import { Enum } from '../constants'
import { responseHandler } from './response-handler'
import { type ICRUDBase } from './base-crud'

export interface IBaseController<
  T extends ObjectLiteral,
  C extends ICRUDBase<T>,
  S extends IBaseService<T, C>,
> {
  addController: (req: Request, res: Response) => Promise<Response>
  getAllController: (req: Request, res: Response) => Promise<Response>
  getByIdController: (req: Request, res: Response) => Promise<Response>
  updateController: (req: Request, res: Response) => Promise<Response>
  deleteController: (req: Request, res: Response) => Promise<Response>
}

export abstract class BaseController<
  T extends ObjectLiteral,
  C extends ICRUDBase<T>,
  S extends IBaseService<T, C>,
> implements IBaseController<T, C, S>
{
  protected readonly service: S

  constructor(service: S) {
    this.service = service
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const createdDoc = await this.service.add(req.body as DeepPartial<T>)
      return responseHandler(
        Enum.RESPONSE_CODES.CREATED,
        res,
        'Requested Submitted Successfully',
        createdDoc,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllController(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.service.findAll(req.query as FindOptionsWhere<T>)
      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Fetched Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getByIdController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params?.id
      if (typeof id !== 'string') {
        return res.status(400).json('Id not provided')
      }
      const query: FindOptionsWhere<T> = { id } as any
      const data = await this.service.findOne(query)
      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Fetched Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async updateController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params?.id
      let data: T

      if (typeof id === 'string') {
        const query: FindOptionsWhere<T> = { id } as any
        data = await this.service.update(query, req.body as Partial<T>)
      } else {
        data = await this.service.update(
          req.query as FindOptionsWhere<T>,
          req.body as Partial<T>
        )
      }

      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Updated Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async deleteController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params?.id

      if (typeof id === 'string') {
        const query: FindOptionsWhere<T> = { id } as any
        await this.service.delete(query)
      } else {
        await this.service.delete(req.query as FindOptionsWhere<T>)
      }

      return responseHandler(
        Enum.RESPONSE_CODES.OK,
        res,
        'Deleted Successfully',
        null,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
