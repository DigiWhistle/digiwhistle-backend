import { type Response, type Request } from 'express'
import HttpException from './http-exception'
import { Enum } from '../constants'
import AppLogger from './app-logger'
import { IExtendedRequest } from '../v1/interface'

export const errorHandler = (
  e: any,
  res: Response,
  req: IExtendedRequest | Request
): Response => {
  const logger = AppLogger.getInstance()
  logger.error(
    `Error: ${e} in  url: ${req.originalUrl} method: ${req.method} body: ${req.body}\n`
  )

  if (e instanceof HttpException) {
    return res
      .status(e.errorCode as number)
      .json({ message: e.message, status: Enum.RESPONSE_STATES.ERROR })
  } else {
    return res.status(Enum.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      message: e?.message ?? 'Internal Server Error',
      status: Enum.RESPONSE_STATES.ERROR,
    })
  }
}
