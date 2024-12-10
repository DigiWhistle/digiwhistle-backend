import { NextFunction, Response } from 'express'
import { IExtendedRequest } from '../interface'
import { Enum } from '../../constants'
import { employeeProfileService, employeeService } from '../modules/admin'
import { AppLogger } from '../../utils'

export const authorizeAccounts = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.user?.role?.id

    if (roleId === Enum.ROLES.EMPLOYEE) {
      const employeeDetails = await employeeProfileService.findOne({
        user: {
          id: req.user.id,
        },
      })

      if (
        employeeDetails === null ||
        employeeDetails.designation !== 'Account Manager'
      ) {
        return res.status(403).json({
          message: 'Access Denied!!',
          status: 'Unauthorized',
        })
      }
    }

    next()
  } catch (e) {
    AppLogger.getInstance().error(`Error: ${e}`)
    return res.status(401).json({
      message: 'You are not authorized!!',
      status: 'Authentication Failed!!',
    })
  }
}
