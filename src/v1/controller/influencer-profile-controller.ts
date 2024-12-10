import { BaseController, errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import { IExtendedRequest } from '../interface'
import { IUserService } from '../modules/user/interface'
import {
  IInfluencerProfile,
  IInfluencerProfileCRUD,
  IInfluencerProfileService,
  IInfluencerStatsService,
} from '../modules/influencer/interface'
import { Request, Response } from 'express'

export class InfluencerProfileController extends BaseController<
  IInfluencerProfile,
  IInfluencerProfileCRUD,
  IInfluencerProfileService
> {
  private readonly userService: IUserService
  private readonly influencerStatsService: IInfluencerStatsService
  constructor(
    influencerProfileService: IInfluencerProfileService,
    userService: IUserService,
    influencerStatsService: IInfluencerStatsService
  ) {
    super(influencerProfileService)
    this.userService = userService
    this.influencerStatsService = influencerStatsService
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.findUserProfileByMobileNoOrUserId(
        req.body.mobileNo,
        req.body.user
      )

      if (user !== null)
        throw new HttpException(
          400,
          'user with same details already exists, pls use different details'
        )

      const data = await this.service.add(req.body)

      const { instagramURL, youtubeURL, linkedInURL, twitterURL } = data

      this.influencerStatsService.fetchAllStatsAndSave(
        data.id,
        instagramURL,
        youtubeURL,
        twitterURL,
        linkedInURL
      )

      return responseHandler(
        201,
        res,
        'Request Submitted Successfully',
        data,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getByUserIdController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user.id
      const profile = await this.service.findOne({ userId: userId }, ['user'])
      return responseHandler(
        200,
        res,
        'Profile fetched Successfully!!',
        profile,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async updateController(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params?.id

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      let _instagramURL: string | null | undefined = undefined
      let _twitterURL: string | null | undefined = undefined
      let _linkedInURL: string | null | undefined = undefined
      let _youtubeURL: string | null | undefined = undefined

      const _data = await this.service.findOne({ id: id })

      if (_data === null) {
        throw new HttpException(404, 'Profile Not Found')
      }

      const data = await this.service.update({ id: id }, req.body)

      if (
        data.instagramURL !== null &&
        data.instagramURL !== undefined &&
        _data.instagramURL !== data.instagramURL
      ) {
        _instagramURL = data.instagramURL
      }

      if (
        data.youtubeURL !== null &&
        data.youtubeURL !== undefined &&
        _data.youtubeURL !== data.youtubeURL
      ) {
        _youtubeURL = data.youtubeURL
      }

      if (
        data.twitterURL !== null &&
        data.twitterURL !== undefined &&
        _data.twitterURL !== data.twitterURL
      ) {
        _twitterURL = data.twitterURL
      }

      if (
        data.linkedInURL !== null &&
        data.linkedInURL !== undefined &&
        _data.linkedInURL !== data.linkedInURL
      ) {
        _linkedInURL = data.linkedInURL
      }

      this.influencerStatsService.fetchAllStatsAndSave(
        data.id,
        _instagramURL,
        _youtubeURL,
        _twitterURL,
        _linkedInURL
      )

      return responseHandler(200, res, 'Updated Successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}
