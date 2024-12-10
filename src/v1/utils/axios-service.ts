import axios from 'axios'
import { AppLogger } from '../../utils'

interface IAxiosService {
  post(url: string, data: any, headers?: any): Promise<any>
  get(url: string, params?: any, headers?: any): Promise<any>
}

class AxiosService implements IAxiosService {
  private static instance: IAxiosService | null = null

  static getInstance() {
    if (AxiosService.instance === null) {
      AxiosService.instance = new AxiosService()
    }
    return AxiosService.instance
  }

  private constructor() {}

  public async post(url: string, data: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: headers === undefined ? {} : headers,
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((e) => {
          console.log(e)
          AppLogger.getInstance().error(`Error: ${e} in url: ${url}`)
          reject(e.response)
        })
    })
  }

  public async get(url: string, params?: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers === undefined ? {} : headers,
          params: params === undefined ? {} : params,
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((e) => {
          AppLogger.getInstance().error(`Error: ${e} in url: ${url}`)
          reject(e.response)
        })
    })
  }
}

export { AxiosService, IAxiosService }
