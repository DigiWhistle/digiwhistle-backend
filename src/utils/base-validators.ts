import Ajv, { type Schema } from 'ajv'
import HttpException from './http-exception'
import { Enum } from '../constants'
import { type Request, type Response, type NextFunction } from 'express'
import addFormats from 'ajv-formats'
import AppLogger from './app-logger'

export class BaseValidator {
  private readonly schemaObj: Schema

  constructor(schemaObj: Schema) {
    this.schemaObj = schemaObj
  }

  public async validateInput(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ajv = new Ajv()
      addFormats(ajv, { mode: 'full' })
      const validate = ajv.compile(this.schemaObj)
      const valid = validate(req.body)

      if (valid) next()
      else {
        const validationError = validate.errors?.map((message) => {
          return message.message ?? ''
        })

        let validationResponse: string = 'Schema is invalid'

        if (validationError !== undefined) {
          validationResponse = validationError.join(',')
        }

        throw new HttpException(
          Enum.RESPONSE_CODES.BAD_REQUEST,
          validationResponse
        )
      }
    } catch (e: any) {
      if (typeof e?.errorCode !== 'number') {
        e.errorCode = 500
      }

      AppLogger.getInstance().error(`Error: ${e}, url: ${req.url}`)

      res
        .status(e.errorCode as number)
        .json(e?.message ?? 'Internal Server Error')
    }
  }
}
