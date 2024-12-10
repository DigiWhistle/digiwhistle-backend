import { firebase } from '../config'
import AppLogger from './app-logger'
import HttpException from './http-exception'

export const uploadFileToFirebase = async (
  filePath: string,
  destination: string
): Promise<string> => {
  const logger = AppLogger.getInstance()
  try {
    await firebase.storage().bucket().upload(filePath, {
      destination,
    })

    // Make the file publicly accessible by setting its ACL to public-read
    const file = firebase.storage().bucket().file(destination)
    await file.makePublic()

    // Get the public URL of the uploaded file
    const publicUrl = file.publicUrl()
    logger.info(`File uploaded successfully: ${publicUrl}`)

    return publicUrl
  } catch (error) {
    logger.error(`error: ${error}`)
    throw new HttpException(500, 'Failed to generate file')
  }
}
