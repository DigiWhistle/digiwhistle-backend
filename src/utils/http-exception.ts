class HttpException extends Error {
  errorCode: number | any

  constructor (
    errorCode: number | any,
    public readonly message: string | any
  ) {
    if (typeof errorCode !== 'number') {
      errorCode = 500
    }

    if (message === undefined || message === null) {
      message = 'Internal Server Error'
    }

    super(message as string)
    this.errorCode = errorCode as number
  }
}

export default HttpException
