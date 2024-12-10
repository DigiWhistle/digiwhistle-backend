import { type Response, type Request } from 'express'
import { Enum } from '../constants'
import AppLogger from './app-logger'
import { IExtendedRequest } from '../v1/interface'

export const responseHandler = (
  statusCode: number,
  res: Response,
  message: string,
  data: any,
  req: IExtendedRequest | Request
): Response => {
  const logger = AppLogger.getInstance()

  logger.info(
    `Response to ${req.method}, ${req.originalUrl} is ${JSON.stringify({ data: data, message: message })}`
  )

  return res.status(statusCode).json({
    message,
    status: Enum.RESPONSE_STATES.SUCCESS,
    data,
  })
}
