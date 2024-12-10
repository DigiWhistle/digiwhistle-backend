import {
  AppLogger,
  BaseService,
  HttpException,
  uploadFileToFirebase,
} from '../../../../utils'
import {
  IPayroll,
  IPayrollCRUD,
  IPayrollHistory,
  IPayrollHistoryService,
  IPayrollService,
} from '../interface'
import {
  Between,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
} from 'typeorm'
import { Enum, monthIndexToName, monthsToDays } from '../../../../constants'
import { v4 as uuidv4 } from 'uuid'
import { IRazorpayService } from '../../../utils/razorpay-service'
import { PaginatedResponse } from '../../../../utils/base-service'
import { PayrollWebhookPayload, SharePaySlipRequest } from '../types'
import { generatePaySlipPdf } from '../../../pdf/payslip-pdf'
import fs from 'fs'
import { IMailerService } from '../../../utils'
import { AppDataSource } from '../../../../config'
import { Payroll, PayrollHistory } from '../models'

export class PayrollService
  extends BaseService<IPayroll, IPayrollCRUD>
  implements IPayrollService
{
  private static instance: IPayrollService | null = null
  private readonly razorpayService: IRazorpayService
  private readonly payrollHistoryService: IPayrollHistoryService
  private readonly mailerService: IMailerService

  static getInstance = (
    payrollCRUD: IPayrollCRUD,
    razorpayService: IRazorpayService,
    payrollHistoryService: IPayrollHistoryService,
    mailerService: IMailerService
  ) => {
    if (PayrollService.instance === null) {
      PayrollService.instance = new PayrollService(
        payrollCRUD,
        razorpayService,
        payrollHistoryService,
        mailerService
      )
    }
    return PayrollService.instance
  }

  private constructor(
    payrollCRUD: IPayrollCRUD,
    razorpayService: IRazorpayService,
    payrollHistoryService: IPayrollHistoryService,
    mailerService: IMailerService
  ) {
    super(payrollCRUD)
    this.razorpayService = razorpayService
    this.payrollHistoryService = payrollHistoryService
    this.mailerService = mailerService
  }

  async getAllPayrollHistory(
    page: number,
    limit: number,
    lowerBound: Date,
    upperBound: Date,
    searchQuery?: string,
    employeeId?: string
  ): Promise<PaginatedResponse<IPayrollHistory>> {
    try {
      let query: FindOptionsWhere<IPayrollHistory>[] = []
      let Query: FindOptionsWhere<IPayrollHistory> = {
        paymentDate: Between(lowerBound, upperBound),
      }

      if (typeof employeeId === 'string') {
        Query = {
          ...Query,
          employeeProfile: {
            id: employeeId,
          },
        }
      }

      if (typeof searchQuery === 'string') {
        query = [
          {
            ...Query,
            employeeProfile: {
              firstName: ILike(`%${searchQuery}%`),
            },
          },
          {
            ...Query,
            employeeProfile: {
              lastName: ILike(`%${searchQuery}%`),
            },
          },
          {
            ...Query,
            employeeProfile: {
              user: {
                email: ILike(`%${searchQuery}%`),
              },
            },
          },
        ]
      }

      if (query.length === 0) {
        query.push(Query)
      }

      const order: FindOptionsOrder<IPayrollHistory> = {
        createdAt: 'DESC',
      }

      const data = await this.payrollHistoryService.findAllPaginated(
        page,
        limit,
        query,
        ['employeeProfile'],
        order
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getAllPayroll(
    searchQuery: string,
    lowerBound: Date,
    upperBound: Date
  ): Promise<IPayroll[]> {
    try {
      let Query: FindOptionsWhere<IPayroll> = {
        payrollDate: Between(lowerBound, upperBound),
      }
      let query: FindOptionsWhere<IPayroll>[] = []

      if (typeof searchQuery === 'string') {
        query = [
          {
            ...Query,
            employeeProfile: {
              firstName: ILike(`%${searchQuery}%`),
            },
          },
          {
            ...Query,
            employeeProfile: {
              lastName: ILike(`%${searchQuery}%`),
            },
          },
          {
            ...Query,
            employeeProfile: {
              user: {
                email: ILike(`%${searchQuery}%`),
              },
            },
          },
        ]
      }

      const order: FindOptionsOrder<IPayroll> = {
        employeeProfile: {
          user: {
            email: 'ASC',
          },
        },
        payrollDate: 'ASC',
      }

      const data = await this.crudBase.findAll(
        query,
        ['employeeProfile'],
        order
      )

      return data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async releaseSalary(id: string, idempotencyKey: string): Promise<void> {
    try {
      const payroll = await this.crudBase.findOne({ id: id }, [
        'employeeProfile',
      ])

      if (payroll === null)
        throw new HttpException(400, 'Invalid Payroll Request')

      if (
        payroll.employeeProfile.bankAccountHolderName === null ||
        payroll.employeeProfile.bankAccountNumber === null ||
        payroll.employeeProfile.bankIfscCode === null
      )
        throw new HttpException(400, 'Bank Account details not found')

      let fund_account_id: string =
        payroll.fundAccountId === null ? '' : payroll.fundAccountId

      if (payroll.fundAccountId === null) {
        fund_account_id = await this.razorpayService.createFundAccount({
          account_type: 'bank_account',
          name:
            payroll.employeeProfile.firstName +
            ' ' +
            (payroll.employeeProfile.lastName === null
              ? ''
              : payroll.employeeProfile.lastName),
          type: 'employee',
          contact: payroll.employeeProfile.mobileNo,
          email: payroll.employeeProfile.user.email,
          bank_account: {
            account_number: payroll.employeeProfile.bankAccountNumber,
            ifsc: payroll.employeeProfile.bankIfscCode,
            name: payroll.employeeProfile.bankAccountHolderName,
          },
        })

        await this.crudBase.update(
          { id: id },
          { fundAccountId: fund_account_id }
        )
      }

      if (fund_account_id === '')
        throw new HttpException(500, 'Unable to process payout request')

      const payrollHistoryId = uuidv4()

      await this.razorpayService.processPayout(
        {
          account_number: process.env.RAZORPAY_ACCOUNT_NUMBER ?? '',
          fund_account_id: fund_account_id,
          amount:
            (payroll.ctc * (1 - payroll.tds / 100) + payroll.incentive) * 100,
          currency: 'INR',
          mode: 'NEFT',
          purpose: 'salary',
          notes: {
            type: 'payroll',
            payrollId: id,
            payrollHistoryId: payrollHistoryId,
            presentSalaryMonth: payroll.salaryMonth,
            payrollDate: payroll.payrollDate,
            incentive: payroll.incentive,
          },
        },
        idempotencyKey
      )

      const newSalaryMonth = (payroll.salaryMonth + 1) % 12
      const nextPayrollDate = new Date()
      nextPayrollDate.setDate(1)
      nextPayrollDate.setMonth(newSalaryMonth)
      nextPayrollDate.setHours(0, 0, 0, 0)
      if (newSalaryMonth === 0)
        nextPayrollDate.setFullYear(nextPayrollDate.getFullYear() + 1)

      await this.crudBase.update(
        { id: id },
        {
          salaryMonth: newSalaryMonth,
          workingDays: monthsToDays[newSalaryMonth],
          incentive: 0,
          payrollDate: nextPayrollDate,
        }
      )

      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      await this.payrollHistoryService.add({
        id: payrollHistoryId,
        employeeProfile: {
          id: payroll.employeeProfile.id,
        },
        ctc: payroll.ctc,
        basic: payroll.basic,
        hra: payroll.hra,
        others: payroll.others,
        salaryMonth:
          monthIndexToName[payroll.salaryMonth] +
          ' ' +
          today.getFullYear().toString().slice(-2) +
          `(${monthsToDays[payroll.salaryMonth]} days)`,
        workingDays: payroll.workingDays.toString(),
        incentive: payroll.incentive,
        grossPay: payroll.ctc,
        finalPay: payroll.ctc * (1 - payroll.tds / 100) + payroll.incentive,
        status: Enum.PaymentStatus.PENDING,
        employmentType: Enum.EmploymentType.FULL_TIME,
        paymentDate: today,
        tds: (payroll.tds / 100) * payroll.ctc,
      })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async handleWebhook(
    payload: PayrollWebhookPayload,
    event: Enum.WEBHOOK_EVENTS
  ): Promise<void> {
    try {
      if (event === Enum.WEBHOOK_EVENTS.PROCESSED) {
        await this.payrollHistoryService.update(
          {
            id: payload.payrollHistoryId,
          },
          {
            status: Enum.PaymentStatus.ALL_PAID,
          }
        )
      } else {
        const {
          payrollId,
          payrollHistoryId,
          presentSalaryMonth,
          payrollDate,
          incentive,
        } = payload

        AppDataSource.manager.transaction(async (manager) => {
          await manager.update(
            Payroll,
            { id: payrollId },
            {
              incentive: incentive,
              salaryMonth: presentSalaryMonth,
              workingDays: monthsToDays[presentSalaryMonth],
              payrollDate: payrollDate,
            }
          )

          await manager.delete(PayrollHistory, { id: payrollHistoryId })
        })
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async generatePaySlip(id: string): Promise<string> {
    try {
      const payroll = await this.payrollHistoryService.findOne({ id: id }, [
        'employeeProfile',
      ])

      if (payroll === null) throw new HttpException(404, 'Payroll Not Found')

      const filePath = `./reports/PaySlip_${new Date()}.pdf`

      await generatePaySlipPdf(payroll, filePath)

      const publicUrl = await uploadFileToFirebase(
        filePath,
        `reports/PaySlip_${new Date()}.pdf`
      )

      fs.unlinkSync(filePath)

      return publicUrl
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async sharePaySlip(data: SharePaySlipRequest): Promise<void> {
    try {
      const { invoiceId, emails, subject, message } = data

      const payroll = await this.payrollHistoryService.findOne(
        { id: invoiceId },
        ['employeeProfile']
      )

      if (payroll === null) throw new HttpException(404, 'Payroll Not Found')

      const filePath = `./reports/PaySlip_${new Date()}.pdf`

      await generatePaySlipPdf(payroll, filePath)

      this.mailerService
        .sendMail(emails, subject, message, [
          {
            filename: `PaySlip_${payroll.employeeProfile.firstName}.pdf`,
            path: filePath,
            contentType: 'application/pdf',
          },
        ])
        .then(() => {
          fs.unlinkSync(filePath)
          AppLogger.getInstance().info(
            `PaySlip ${invoiceId} shared successfully`
          )
        })
        .catch(() => {
          fs.unlinkSync(filePath)
          AppLogger.getInstance().error(`Error in sharing PaySlip ${invoiceId}`)
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
  async incrementIncentive(
    employeeId: string,
    incentive: number
  ): Promise<void> {
    try {
      await this.crudBase.incrementIncentive(employeeId, incentive)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
