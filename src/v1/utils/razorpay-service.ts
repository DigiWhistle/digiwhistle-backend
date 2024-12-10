import { AppLogger, HttpException } from '../../utils'
import { IAxiosService } from './axios-service'
import crypto from 'crypto'

export interface IRazorpayService {
  processPayout(
    data: IRazorpayPayoutRequest,
    idempotencyKey: string
  ): Promise<void>
  verifyWebhook(webhook_body: any, webhook_signature: string): Promise<boolean>
  createFundAccount(data: IFundAccountRequest): Promise<string>
}

export interface IRazorpayPayoutRequest {
  account_number: string
  fund_account_id: string
  amount: number
  currency: string
  mode: string
  purpose: string
  notes: any
}

export interface IFundAccountRequest {
  type: string
  name: string
  email: string
  contact: string
  account_type: string
  bank_account: {
    name: string
    ifsc: string
    account_number: string
  }
}

export interface IContactRequest {
  name: string
  email: string
  contact: string
  type: string
}

export class RazorpayService implements IRazorpayService {
  private static instance: IRazorpayService | null = null
  private readonly axiosService: IAxiosService
  private readonly RAZORPAY_KEY_ID
  private readonly RAZORPAY_KEY_SECRET

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
    this.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
    this.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
  }

  static getInstance(axiosService: IAxiosService) {
    if (RazorpayService.instance === null) {
      RazorpayService.instance = new RazorpayService(axiosService)
    }
    return RazorpayService.instance
  }

  async processPayout(
    data: IRazorpayPayoutRequest,
    idempotencyKey: string
  ): Promise<void> {
    try {
      const auth = Buffer.from(
        `${this.RAZORPAY_KEY_ID}:${this.RAZORPAY_KEY_SECRET}`
      ).toString('base64')

      await this.axiosService.post(
        'https://api.razorpay.com/v1/payouts',
        data,
        {
          'Content-Type': 'application/json',
          'X-Payout-Idempotency': idempotencyKey,
          Authorization: `Basic ${auth}`,
        }
      )
    } catch (e) {
      console.log('error in payout', e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async verifyWebhook(
    webhook_body: any,
    webhook_signature: string
  ): Promise<boolean> {
    try {
      const key = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''
      const message = JSON.stringify(webhook_body)

      const expectedSignature = crypto
        .createHmac('sha256', key)
        .update(message)
        .digest('hex')

      if (webhook_signature !== expectedSignature) {
        throw new HttpException(400, 'Invalid signature')
      }

      return true
    } catch (e) {
      AppLogger.getInstance().error(e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async createContact(data: IContactRequest): Promise<string> {
    try {
      const auth = Buffer.from(
        `${this.RAZORPAY_KEY_ID}:${this.RAZORPAY_KEY_SECRET}`
      ).toString('base64')

      const response = await this.axiosService.post(
        'https://api.razorpay.com/v1/contacts',
        data,
        {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        }
      )

      return response.id
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async createFundAccount(data: IFundAccountRequest): Promise<string> {
    try {
      const auth = Buffer.from(
        `${this.RAZORPAY_KEY_ID}:${this.RAZORPAY_KEY_SECRET}`
      ).toString('base64')

      const contact_id = await this.createContact({
        name: data.name,
        email: data.email,
        contact: data.contact,
        type: data.type,
      })

      const response = await this.axiosService.post(
        'https://api.razorpay.com/v1/fund_accounts',
        {
          contact_id: contact_id,
          account_type: data.account_type,
          bank_account: data.bank_account,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        }
      )

      return response.id
    } catch (e) {
      console.log('error in fund account', e)
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
