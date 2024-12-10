import winston, { Logger, transports, format } from 'winston'

interface IAppLogger {
  log: (level: string, message: string) => void
  info: (message: string) => void
  error: (message: string) => void
  warn: (message: string) => void
  debug: (message: string) => void
}

class AppLogger implements IAppLogger {
  private logger: Logger
  private static instance: IAppLogger | null = null

  static getInstance = () => {
    if (AppLogger.instance === null) {
      AppLogger.instance = new AppLogger()
    }
    return AppLogger.instance
  }

  private constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    })

    // If we're in development mode, log to the console with colors
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      )
    }
  }

  log(level: string, message: string): void {
    this.logger.log(level, message)
  }

  info(message: string): void {
    this.logger.info(message)
  }

  error(message: string): void {
    this.logger.error(message)
  }

  warn(message: string): void {
    this.logger.warn(message)
  }

  debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(message)
    }
  }
}

export default AppLogger
