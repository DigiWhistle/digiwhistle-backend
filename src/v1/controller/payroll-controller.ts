import { Request, Response } from 'express'
import { BaseController, errorHandler, HttpException } from '../../utils'
import {
  IPayroll,
  IPayrollCRUD,
  IPayrollHistoryService,
  IPayrollService,
} from '../modules/payroll/interface'
import { responseHandler } from '../../utils/response-handler'
import { monthsToDays } from '../../constants'
import { PayrollDTO } from '../dtos/payroll-dtos'
import moment from 'moment-timezone'
import { IEmployeeProfileService } from '../modules/admin/interface'
import { IExtendedRequest } from '../interface'

export class PayrollController extends BaseController<
  IPayroll,
  IPayrollCRUD,
  IPayrollService
> {
  private readonly payrollService: IPayrollService
  private readonly employeeProfileService: IEmployeeProfileService

  constructor(
    payrollService: IPayrollService,
    employeeProfileService: IEmployeeProfileService
  ) {
    super(payrollService)
    this.employeeProfileService = employeeProfileService
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body

      const salaryMonth = new Date(
        5.5 * 60 * 60 * 1000 + new Date().getTime()
      ).getMonth()
      const workingDays = monthsToDays[salaryMonth]

      const existingPayroll = await this.service.findOne({
        employeeProfile: {
          id: data.employeeProfile,
        },
      })

      if (existingPayroll !== null)
        throw new HttpException(400, 'Payroll for this employee already exists')

      const _data = await this.service.add({
        ...data,
        workingDays,
        salaryMonth,
      })

      return responseHandler(201, res, 'Added Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllController(req: Request, res: Response): Promise<Response> {
    try {
      const { searchQuery, type } = req.query

      const { startDate, endDate } = req.query

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      let upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      upperBound = moment(upperBound).add(1, 'days').toDate()

      if (type === 'Pending') {
        const data = await this.service.getAllPayroll(
          searchQuery as string,
          lowerBound,
          upperBound
        )

        const _data = data.map((value) => {
          return PayrollDTO.transformationForPendingPayrollData(value)
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
          },
          req
        )
      }

      if (type === 'All Paid') {
        const { page, limit } = req.query

        if (typeof page !== 'string' || typeof limit !== 'string')
          throw new HttpException(400, 'Invalid Page Details')

        const data = await this.service.getAllPayrollHistory(
          parseInt(page),
          parseInt(limit),
          lowerBound,
          upperBound,
          searchQuery as string
        )

        const _data = data.data.map((value) => {
          return PayrollDTO.transformationForPaidPayrollData(value)
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          },
          req
        )
      }

      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllPayrollByEmployee(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { startDate, endDate } = req.query

      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new HttpException(400, 'Invalid Date')
      }

      const lowerBound = new Date(startDate)
      let upperBound = new Date(endDate)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startDate
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endDate)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      upperBound = moment(upperBound).add(1, 'days').toDate()

      const { page, limit } = req.query

      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      const employee = await this.employeeProfileService.findOne({
        user: {
          id: req.user.id,
        },
      })

      if (employee === null) {
        throw new HttpException(404, 'Employee Not Found')
      }

      const data = await this.service.getAllPayrollHistory(
        parseInt(page),
        parseInt(limit),
        lowerBound,
        upperBound,
        undefined,
        employee.id
      )

      const _data = data.data.map((value) => {
        return PayrollDTO.transformationForEmployeePayroll(value)
      })

      return responseHandler(
        200,
        res,
        'Fetched Successfully',
        {
          data: _data,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async releaseSalaryController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.query

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const idempotencyKey = req.headers['x-idempotency-key'] as string

      if (!idempotencyKey) {
        throw new HttpException(400, 'Invalid Idempotency Key')
      }

      await this.service.releaseSalary(id, idempotencyKey)

      return responseHandler(200, res, 'Payment Done Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async generatePaySlipController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.query
      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')
      const data = await this.service.generatePaySlip(id)
      return responseHandler(
        200,
        res,
        'Generated Successfully',
        { url: data },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async sharePaySlipController(req: Request, res: Response): Promise<Response> {
    try {
      await this.service.sharePaySlip(req.body)
      return responseHandler(200, res, 'Shared Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
