import { firebase } from '../config'
import AppLogger from './app-logger'
import HttpException from './http-exception'
import fs from 'fs'

export const uploadPdfToFirebase = async (
  filePath: string,
  destination: string
): Promise<string> => {
  const logger = AppLogger.getInstance()
  try {
    const fileBuffer = fs.readFileSync(filePath)

    await firebase.storage().bucket().file(destination).save(fileBuffer, {
      public: true,
      contentType: 'application/pdf',
    })

    const file = firebase.storage().bucket().file(destination)
    await file.makePublic()
    const publicUrl = file.publicUrl()

    return publicUrl
  } catch (error) {
    logger.error(`error: ${error}`)
    throw new HttpException(500, 'Failed to generate file')
  }
}
