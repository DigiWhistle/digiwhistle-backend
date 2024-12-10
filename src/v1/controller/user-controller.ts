import { errorHandler, HttpException } from '../../utils'
import { IExtendedRequest } from '../interface'
import { IUserService } from '../modules/user/interface'
import { Request, Response } from 'express'
import { responseHandler } from '../../utils/response-handler'
import { IGoogleAuthService } from '../modules/auth/interface'
import { UserDTO } from '../dtos'

class UserController {
  private readonly userService: IUserService
  private readonly googleAuthService: IGoogleAuthService

  constructor(
    userService: IUserService,
    googleAuthService: IGoogleAuthService
  ) {
    this.userService = userService
    this.googleAuthService = googleAuthService
  }

  async getUser(req: IExtendedRequest, res: Response): Promise<Response> {
    try {
      const user = await this.userService.findOne({ id: req.user.id }, [
        'adminProfile',
        'employeeProfile',
        'influencerProfile',
        'brandProfile',
        'agencyProfile',
        'role',
      ])

      if (user === null) throw new HttpException(404, 'user does not exist')

      const _user = UserDTO.transformationForUserProfile(user)
      return responseHandler(200, res, 'Fetched Successfully', _user, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async approveUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body
      if (typeof userId !== 'string') {
        throw new HttpException(400, 'Invalid UserId')
      }

      await this.userService.update(
        { id: userId },
        { isVerified: true, isPaused: false, isApproved: true }
      )

      return responseHandler(200, res, 'User approved', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async pauseUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body

      if (typeof userId !== 'string') {
        throw new HttpException(400, 'Invalid UserId')
      }

      await this.userService.update(
        { id: userId },
        { isPaused: true, isVerified: false }
      )

      return responseHandler(200, res, 'User paused', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async revertAction(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body

      if (typeof userId !== 'string') {
        throw new HttpException(400, 'Invalid UserId')
      }

      await this.userService.update(
        { id: userId },
        { isVerified: false, isPaused: false, isApproved: null }
      )

      return responseHandler(200, res, 'Reverted Action', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async rejectUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body

      if (typeof userId !== 'string') {
        throw new HttpException(400, 'Invalid UserId')
      }

      await this.userService.update(
        { id: userId },
        { isVerified: false, isPaused: false, isApproved: false }
      )

      return responseHandler(200, res, 'User rejected', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.query

      if (typeof userId !== 'string') {
        throw new HttpException(400, 'Invalid UserId')
      }

      const user = await this.userService.findOne({ id: userId })

      if (user === null) throw new HttpException(404, 'User does not exist')

      await this.userService.delete({
        id: userId,
      })

      await this.googleAuthService
        .deleteUser(userId)
        .then(() => {})
        .catch(async (e) => {
          await this.userService.add(user)
          throw new HttpException(e?.errorCode, e?.message)
        })

      return responseHandler(200, res, 'Deleted Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async findUsersController(req: Request, res: Response): Promise<Response> {
    try {
      const { queryType, email } = req.query

      if (typeof queryType !== 'string') {
        throw new HttpException(400, 'Invalid Query Type')
      }

      if (queryType === 'InfluencerAndAgencyByEmail') {
        if (typeof email !== 'string') {
          throw new HttpException(400, 'Invalid Email')
        }

        const data = await this.userService.findInfluencerAndAgencyByEmail(
          req.query.email as string
        )

        const _data =
          UserDTO.transformationForInfluencerAndAgencyByEmailSearch(data)

        return responseHandler(
          200,
          res,
          'data fetched successfully',
          _data,
          req
        )
      }

      return responseHandler(200, res, 'data fetched successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { UserController }
