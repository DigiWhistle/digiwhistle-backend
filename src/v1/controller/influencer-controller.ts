import { errorHandler, HttpException } from '../../utils'
import { responseHandler } from '../../utils/response-handler'
import {
  IInfluencerService,
  IInfluencerStatsService,
} from '../modules/influencer/interface'
import { Request, Response } from 'express'
import { IUserService } from '../modules/user/interface'
import { InfluencerDTO } from '../dtos'
import { Enum } from '../../constants'
import { IExtendedRequest } from '../interface'
import {
  InstagramProfileStats,
  TwitterProfileStats,
  YoutubeProfileStats,
} from '../modules/influencer/types'

class InfluencerController {
  private readonly influencerService: IInfluencerService
  private readonly influencerStatsService: IInfluencerStatsService
  private readonly userService: IUserService
  constructor(
    influencerService: IInfluencerService,
    influencerStatsService: IInfluencerStatsService,
    userService: IUserService
  ) {
    this.influencerService = influencerService
    this.influencerStatsService = influencerStatsService
    this.userService = userService
  }

  async addInfluencerController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { email, mobileNo } = req.body

      const user = await this.userService.findUserByMobileNoAndEmail(
        mobileNo,
        email
      )

      if (user !== null)
        throw new HttpException(409, 'User already exists with same details')

      const data = await this.influencerService.addInfluencer(req.body)

      const { instagramURL, youtubeURL, linkedInURL, twitterURL } = data

      this.influencerStatsService.fetchAllStatsAndSave(
        data.id,
        instagramURL,
        youtubeURL,
        twitterURL,
        linkedInURL
      )

      return responseHandler(200, res, 'Added Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async inviteInfluencerController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      await this.influencerService.inviteInfluencer(req.body)
      return responseHandler(200, res, 'Invited Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllInfluencerController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const {
        platform,
        niche,
        type,
        followers,
        page,
        limit,
        name,
        sortEr,
        refresh,
        approved,
        rejected,
      } = req.query

      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      if (typeof platform !== 'string')
        throw new HttpException(400, 'Invalid Platform')

      if (refresh === 'true') {
        await this.influencerService.refreshAllInfluencer(
          parseInt(page),
          parseInt(limit),
          platform
        )
      }

      const data = await this.influencerService.getAllInfluencer(
        parseInt(page),
        parseInt(limit),
        platform,
        type as string,
        niche as string,
        followers as string,
        name as string,
        sortEr as string,
        approved as string,
        rejected as string
      )

      const _data = data.data.map((value) => {
        return InfluencerDTO.transformationForInfluencerResponse(
          value,
          platform as Enum.Platform
        )
      })

      return responseHandler(
        200,
        res,
        'Fetched Successfully',
        {
          data: _data,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
          currentPage: data.currentPage,
        },
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getInfluencerStatsController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const data = await this.influencerService.getInfluencerStats()

      const _data = InfluencerDTO.transformationForInfluencerStats(data)

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllInfluencerRequestsController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { platform, page, limit } = req.query

      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      if (typeof platform !== 'string')
        throw new HttpException(400, 'Invalid Platform')

      const data = await this.influencerService.getAllInfluencerRequests(
        parseInt(page),
        parseInt(limit),
        platform
      )

      const _data = data.data.map((value) => {
        return InfluencerDTO.transformationForInfluencerRequests(
          value,
          platform as Enum.Platform
        )
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

  async exploreInfluencerController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { url } = req.query

      if (typeof url !== 'string') throw new HttpException(400, 'Invalid URL')

      let agencyId: string | undefined = undefined

      if (req.user.role.id === Enum.ROLES.AGENCY) {
        const agencyProfile = await this.userService.findOne(
          {
            id: req.user.id,
          },
          ['agencyProfile']
        )

        if (agencyProfile === null || agencyProfile.agencyProfile === null)
          throw new HttpException(400, 'Agency Profile Not Found')

        agencyId = agencyProfile?.agencyProfile?.id
      }

      const data = await this.influencerService.exploreInfluencer(
        url,
        req.user.role.id,
        agencyId
      )

      if (url.includes('instagram')) {
        const _data = InfluencerDTO.transformationForExploreInstagramProfile(
          data.stats as InstagramProfileStats,
          url
        )

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          { ..._data, isDigiwhistle: data.isDigiwhistle },
          req
        )
      } else if (url.includes('x.com')) {
        const _data = InfluencerDTO.transformationForExploreTwitterProfile(
          data.stats as TwitterProfileStats,
          url
        )

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          { ..._data, isDigiwhistle: data.isDigiwhistle },
          req
        )
      } else if (url.includes('youtube')) {
        const _data = InfluencerDTO.transformationForExploreYoutubeProfile(
          data.stats as YoutubeProfileStats,
          url
        )

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          { ..._data, isDigiwhistle: data.isDigiwhistle },
          req
        )
      } else throw new HttpException(400, 'Invalid Url')
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getInfluencersListController(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const data = await this.influencerService.getInfluencersList()
      const _data = data.map((value) => {
        return InfluencerDTO.transformationForInfluencerList(value)
      })

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { InfluencerController }
