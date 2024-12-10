import fs from 'fs'
import { uploadFileToFirebase } from './upload-file'
import { MailerService } from '../v1/utils'

export const logsScheduler = async () => {
  MailerService.getInstance()
    .sendMail(
      'adityag.ip.20@nitj.ac.in',
      'Digiwhistle Daily logs',
      'Digiwhistle Daily logs',
      [
        {
          filename: `logs/${new Date().toISOString()[0]}-error.log`,
          path: './logs/error.log',
          contentType: 'text/plain',
        },
        {
          filename: `logs/${new Date().toISOString()[0]}-combined.log`,
          path: './logs/combined.log',
          contentType: 'text/plain',
        },
      ]
    )
    .then(() => {
      fs.writeFileSync('./logs/error.log', '')
      fs.writeFileSync('./logs/combined.log', '')
    })
    .catch((e) => {
      console.log(e)
      fs.writeFileSync('./logs/error.log', '')
      fs.writeFileSync('./logs/combined.log', '')
    })

  // uploadFileToFirebase(
  //   './logs/error.log',
  //   `logs/${new Date().toISOString()[0]}-error.log`
  // )
  //   .then(() => {
  //     fs.writeFileSync('./logs/error.log', '')
  //   })
  //   .catch(() => {
  //     fs.writeFileSync('./logs/error.log', '')
  //   })

  // uploadFileToFirebase(
  //   './logs/combined.log',
  //   `logs/${new Date().toISOString()[0]}-combined.log`
  // )
  //   .then(() => {
  //     fs.writeFileSync('./logs/combined.log', '')
  //   })
  //   .catch(() => {
  //     fs.writeFileSync('./logs/combined.log', '')
  //   })
}
