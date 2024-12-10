import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm'
import { HttpException } from '../../../../utils'
import { IMailerService } from '../../../utils'
import { IGoogleAuthService } from '../../auth/interface'
import {
  IInfluencerService,
  IInfluencerCRUD,
  IInfluencerProfile,
  IInfluencerProfileService,
  IInfluencerStatsService,
  IInstagramService,
  IYoutubeService,
  ITwitterService,
} from '../interface'
import {
  ExploreInfluencerResponse,
  IAddInfluencerInput,
  IInviteInfluencerInput,
  InfluencerStats,
  InstagramProfileStats,
  TwitterProfileStats,
  YoutubeProfileStats,
} from '../types'
import { PaginatedResponse } from '../../../../utils/base-service'
import { Enum } from '../../../../constants'
import { ISearchCreditsService } from '../../agency/interface'

class InfluencerService implements IInfluencerService {
  private readonly mailerService: IMailerService
  private readonly googleAuthService: IGoogleAuthService
  private readonly influencerCRUD: IInfluencerCRUD
  private readonly influencerProfileService: IInfluencerProfileService
  private readonly influencerStatsService: IInfluencerStatsService
  private readonly instagramService: IInstagramService
  private readonly youtubeService: IYoutubeService
  private readonly twitterService: ITwitterService
  private readonly searchCreditsService: ISearchCreditsService
  private static instance: IInfluencerService | null = null

  static getInstance = (
    mailerService: IMailerService,
    googleAuthService: IGoogleAuthService,
    influencerCRUD: IInfluencerCRUD,
    influencerProfileService: IInfluencerProfileService,
    influencerStatsService: IInfluencerStatsService,
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService,
    searchCreditsService: ISearchCreditsService
  ) => {
    if (InfluencerService.instance === null) {
      InfluencerService.instance = new InfluencerService(
        mailerService,
        googleAuthService,
        influencerCRUD,
        influencerProfileService,
        influencerStatsService,
        instagramService,
        youtubeService,
        twitterService,
        searchCreditsService
      )
    }
    return InfluencerService.instance
  }

  private constructor(
    mailerService: IMailerService,
    googleAuthService: IGoogleAuthService,
    influencerCRUD: IInfluencerCRUD,
    influencerProfileService: IInfluencerProfileService,
    influencerStatsService: IInfluencerStatsService,
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService,
    searchCreditsService: ISearchCreditsService
  ) {
    this.mailerService = mailerService
    this.googleAuthService = googleAuthService
    this.influencerCRUD = influencerCRUD
    this.influencerProfileService = influencerProfileService
    this.influencerStatsService = influencerStatsService
    this.instagramService = instagramService
    this.youtubeService = youtubeService
    this.twitterService = twitterService
    this.searchCreditsService = searchCreditsService
  }

  async addInfluencer(data: IAddInfluencerInput): Promise<IInfluencerProfile> {
    try {
      const { uid } = await this.googleAuthService.createUser(data.email)

      const _data = await this.influencerCRUD.addInfluencer({
        ...data,
        userId: uid,
      })

      this.mailerService
        .sendMail(
          data.email,
          'You are invited to Join Digiwhistle',
          `<p>You are invited to Join your team, please login at the following link:</p><p>${process.env.FRONTEND_URL}/login</p><p> Your credentials are:</p><p>email: ${data.email}<br>password: 'digiwhistle@123'</p><p>Please Click on the following link to complete your registration:</p><p>${process.env.FRONTEND_URL}/login</p>`
        )
        .then()
        .catch((e) => {
          console.log(e)
        })

      return _data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async inviteInfluencer(data: IInviteInfluencerInput): Promise<void> {
    try {
      this.mailerService
        .sendMail(data.emails, data.subject, data.message)
        .then()
        .catch((e) => {
          console.log(e)
        })
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async refreshAllInfluencer(
    page: number,
    limit: number,
    platform: string
  ): Promise<void> {
    try {
      const data = await this.influencerProfileService.findAllPaginated(
        page,
        limit,
        undefined,
        [],
        { createdAt: 'DESC' }
      )

      const promises: Promise<void>[] = []

      data.data.forEach((value) => {
        if (platform === 'instagram') {
          promises.push(
            this.influencerStatsService.fetchAllStatsAndSave(
              value.id,
              value.instagramURL,
              undefined,
              undefined,
              undefined
            )
          )
        }
        if (platform === 'youtube') {
          promises.push(
            this.influencerStatsService.fetchAllStatsAndSave(
              value.id,
              undefined,
              value.youtubeURL,
              undefined,
              undefined
            )
          )
        }
        if (platform === 'x') {
          promises.push(
            this.influencerStatsService.fetchAllStatsAndSave(
              value.id,
              undefined,
              undefined,
              value.twitterURL,
              undefined
            )
          )
        }
        if (platform === 'linkedin') {
          promises.push(
            this.influencerStatsService.fetchAllStatsAndSave(
              value.id,
              undefined,
              undefined,
              undefined,
              value.linkedInURL
            )
          )
        }
      })

      await Promise.allSettled(promises)
    } catch (e) {
      console.log(e)
    }
  }

  async getAllInfluencer(
    page: number,
    limit: number,
    platform: string,
    type: string | undefined,
    niche: string | undefined,
    followers: string | undefined,
    name: string | undefined,
    sortEr: string | undefined,
    approved: string | undefined,
    rejected: string | undefined
  ): Promise<PaginatedResponse<IInfluencerProfile>> {
    try {
      let orQuery: FindOptionsWhere<IInfluencerProfile>[] = []
      let query: FindOptionsWhere<IInfluencerProfile> = {}

      const relation: string[] = ['user']
      let order: FindOptionsOrder<IInfluencerProfile> = {
        createdAt: 'DESC',
      }

      if (platform === 'instagram' && sortEr === 'true') {
        order = {
          instagramStats: {
            engagementRate: 'DESC',
          },
        }
      }

      if (approved === 'true') {
        orQuery.push({
          user: {
            isApproved: true,
          },
        })
      }

      if (rejected === 'true') {
        orQuery.push({
          user: {
            isApproved: false,
          },
        })
      }

      if (type === 'exclusive') {
        query = { ...query, exclusive: true }
      }

      if (type === 'non-exclusive') {
        query = {
          ...query,
          exclusive: false,
        }
      }

      if (typeof name === 'string') {
        query = {
          ...query,
          firstName: ILike(`%${name}%`),
        }
      }

      if (niche === 'finance') {
        query = {
          ...query,
          niche: niche,
        }
      }

      if (niche === 'non-finance') {
        query = {
          ...query,
          niche: Not('finance'),
        }
      }

      if (platform === 'instagram') {
        if (followers === 'lessThan250K') {
          query = {
            ...query,
            instagramStats: {
              id: Not(IsNull()),
              followers: LessThanOrEqual(250000),
            },
          }
        } else if (followers === '250Kto500K') {
          query = {
            ...query,
            instagramStats: {
              id: Not(IsNull()),
              followers: Between(250000, 500000),
            },
          }
        } else if (followers === '500Kto750K') {
          query = {
            ...query,
            instagramStats: {
              id: Not(IsNull()),
              followers: Between(500000, 750000),
            },
          }
        } else if (followers === 'moreThan750K') {
          query = {
            ...query,
            instagramStats: {
              id: Not(IsNull()),
              followers: MoreThanOrEqual(750000),
            },
          }
        } else {
          query = {
            ...query,
            instagramStats: {
              id: Not(IsNull()),
            },
          }
        }

        relation.push('instagramStats')
      }

      if (platform === 'youtube') {
        if (followers === 'lessThan250K') {
          query = {
            ...query,
            youtubeStats: {
              id: Not(IsNull()),
              subscribers: LessThanOrEqual(250000),
            },
          }
        } else if (followers === '250Kto500K') {
          query = {
            ...query,
            youtubeStats: {
              id: Not(IsNull()),
              subscribers: Between(250000, 500000),
            },
          }
        } else if (followers === '500Kto750K') {
          query = {
            ...query,
            youtubeStats: {
              id: Not(IsNull()),
              subscribers: Between(500000, 750000),
            },
          }
        } else if (followers === 'moreThan750K') {
          query = {
            ...query,
            youtubeStats: {
              id: Not(IsNull()),
              subscribers: MoreThanOrEqual(750000),
            },
          }
        } else {
          query = {
            ...query,
            youtubeStats: {
              id: Not(IsNull()),
            },
          }
        }

        relation.push('youtubeStats')
      }

      if (platform === 'x') {
        if (followers === 'lessThan250K') {
          query = {
            ...query,
            twitterStats: {
              id: Not(IsNull()),
              followers: LessThanOrEqual(250000),
            },
          }
        } else if (followers === '250Kto500K') {
          query = {
            ...query,
            twitterStats: {
              id: Not(IsNull()),
              followers: Between(250000, 500000),
            },
          }
        } else if (followers === '500Kto750K') {
          query = {
            ...query,
            twitterStats: {
              id: Not(IsNull()),
              followers: Between(500000, 750000),
            },
          }
        } else if (followers === 'moreThan750K') {
          query = {
            ...query,
            twitterStats: {
              id: Not(IsNull()),
              followers: MoreThanOrEqual(750000),
            },
          }
        } else {
          query = {
            ...query,
            twitterStats: {
              id: Not(IsNull()),
            },
          }
        }
        relation.push('twitterStats')
      }

      if (platform === 'linkedin') {
        if (followers === 'lessThan250K') {
          query = {
            ...query,
            linkedInStats: {
              id: Not(IsNull()),
              followers: LessThanOrEqual(250000),
            },
          }
        } else if (followers === '250Kto500K') {
          query = {
            ...query,
            linkedInStats: {
              id: Not(IsNull()),
              followers: Between(250000, 500000),
            },
          }
        } else if (followers === '500Kto750K') {
          query = {
            ...query,
            linkedInStats: {
              id: Not(IsNull()),
              followers: Between(500000, 750000),
            },
          }
        } else if (followers === 'moreThan750K') {
          query = {
            ...query,
            linkedInStats: {
              id: Not(IsNull()),
              followers: MoreThanOrEqual(750000),
            },
          }
        } else {
          query = {
            ...query,
            linkedInStats: {
              id: Not(IsNull()),
            },
          }
        }
        relation.push('linkedInStats')
      }

      let combinedQuery:
        | FindOptionsWhere<IInfluencerProfile>[]
        | FindOptionsWhere<IInfluencerProfile> = query

      if (orQuery.length > 0) {
        combinedQuery = orQuery.map((item) => {
          return { ...item, ...query }
        })
      }

      const data = await this.influencerProfileService.findAllPaginated(
        page,
        limit,
        combinedQuery,
        relation,
        order
      )

      return data
    } catch (e) {
      console.log(e)
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async getAllInfluencerRequests(
    page: number,
    limit: number,
    platform: string
  ): Promise<PaginatedResponse<IInfluencerProfile>> {
    try {
      let query: FindOptionsWhere<IInfluencerProfile> = {}
      const relation: string[] = ['user']
      const order: FindOptionsOrder<IInfluencerProfile> = {
        createdAt: 'DESC',
      }

      if (platform === 'instagram') {
        query = {
          ...query,
          instagramStats: {
            id: Not(IsNull()),
          },
        }

        relation.push('instagramStats')
      }

      if (platform === 'youtube') {
        query = {
          ...query,
          youtubeStats: {
            id: Not(IsNull()),
          },
        }

        relation.push('youtubeStats')
      }

      if (platform === 'x') {
        query = {
          ...query,
          twitterStats: {
            id: Not(IsNull()),
          },
        }

        relation.push('twitterStats')
      }

      if (platform === 'linkedin') {
        query = {
          ...query,
          linkedInStats: {
            id: Not(IsNull()),
          },
        }

        relation.push('linkedInStats')
      }

      const data = await this.influencerProfileService.findAllPaginated(
        page,
        limit,
        query,
        relation,
        order
      )

      return data
    } catch (e) {
      console.log(e)
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async getInfluencerStats(): Promise<InfluencerStats> {
    try {
      return await this.influencerProfileService.getInfluencerStats()
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async getInfluencersList(): Promise<IInfluencerProfile[]> {
    try {
      const data = await this.influencerProfileService.findAllPaginated(
        1,
        30,
        {
          user: {
            isApproved: true,
          },
        },
        undefined,
        { createdAt: 'DESC' }
      )

      return data.data
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async exploreInfluencer(
    url: string,
    role: Enum.ROLES,
    agencyId?: string
  ): Promise<ExploreInfluencerResponse> {
    try {
      if (role === Enum.ROLES.AGENCY && agencyId !== undefined) {
        const credits = await this.searchCreditsService.findOne({
          agency: {
            id: agencyId,
          },
        })

        if (!credits) {
          throw new HttpException(400, 'Insufficient credits')
        }

        if (credits.credits < 1) {
          throw new HttpException(400, 'Insufficient credits')
        }

        await this.searchCreditsService.update(
          {
            agency: {
              id: agencyId,
            },
          },
          {
            credits: credits.credits - 1,
            lastUpdatedAt: new Date(),
          }
        )
      }

      if (url.includes('instagram')) {
        const lastSlashIndex = url.lastIndexOf('/')

        if (lastSlashIndex !== -1) {
          url = url.substring(0, lastSlashIndex)
        }

        const influencer = await this.influencerProfileService.findOne(
          [{ instagramURL: url }, { instagramURL: url + '/' }],
          ['instagramStats']
        )

        if (influencer !== null && influencer.instagramStats !== null) {
          return {
            stats: {
              likes: influencer.instagramStats?.likes ?? 0,
              comments: influencer.instagramStats?.comments ?? 0,
              followers: influencer.instagramStats?.followers ?? 0,
              engagementRate: influencer.instagramStats?.engagementRate ?? 0,
              percentageFakeFollowers:
                influencer.instagramStats?.percentageFakeFollowers ?? 0,
              views: influencer.instagramStats?.views ?? 0,
              name: influencer.instagramStats?.handleName ?? '',
              image: influencer.instagramStats?.profilePic ?? '',
              description: influencer.instagramStats?.description ?? '',
              cities: influencer.instagramStats?.cities ?? null,
              countries: influencer.instagramStats?.countries ?? null,
              genders: influencer.instagramStats?.genders ?? null,
              ages: influencer.instagramStats?.ages ?? null,
              reach: influencer.instagramStats?.reach ?? null,
            },
            isDigiwhistle: true,
          }
        }

        const data = await this.instagramService.getInstagramProfileStats(url)

        return { stats: data, isDigiwhistle: false }
      } else if (url.includes('x.com')) {
        const lastSlashIndex = url.lastIndexOf('/')

        if (lastSlashIndex !== -1) {
          url = url.substring(0, lastSlashIndex)
        }

        const influencer = await this.influencerProfileService.findOne(
          [{ twitterURL: url }, { twitterURL: url + '/' }],
          ['twitterStats']
        )

        if (influencer !== null && influencer.twitterStats !== null) {
          return {
            stats: {
              followers: influencer.twitterStats?.followers ?? 0,
              tweets: influencer.twitterStats?.tweets ?? 0,
              views: influencer.twitterStats?.views ?? 0,
              replyCount: influencer.twitterStats?.replyCount ?? 0,
              retweets: influencer.twitterStats?.retweets ?? 0,
              name: influencer.twitterStats?.handleName ?? '',
              image: influencer.twitterStats?.profilePic ?? '',
              description: influencer.twitterStats?.description ?? '',
            },
            isDigiwhistle: true,
          }
        }

        const data = await this.twitterService.getTwitterProfileStats(url)

        return { stats: data, isDigiwhistle: false }
      } else if (url.includes('youtube')) {
        const lastSlashIndex = url.lastIndexOf('/')

        if (lastSlashIndex !== -1) {
          url = url.substring(0, lastSlashIndex)
        }

        const influencer = await this.influencerProfileService.findOne(
          [{ youtubeURL: url }, { youtubeURL: url + '/' }],
          ['youtubeStats']
        )

        if (influencer !== null && influencer.youtubeStats !== null) {
          return {
            stats: {
              views: influencer.youtubeStats?.views ?? 0,
              subscribers: influencer.youtubeStats?.subscribers ?? 0,
              videos: influencer.youtubeStats?.videos ?? 0,
              title: influencer.youtubeStats?.handleName ?? '',
              image: influencer.youtubeStats?.profilePic ?? '',
              description: influencer.youtubeStats?.description ?? '',
            },
            isDigiwhistle: true,
          }
        }

        const data = await this.youtubeService.getYoutubeProfileStats(url)

        return {
          stats: data,
          isDigiwhistle: false,
        }
      } else {
        throw new HttpException(400, 'Invalid URL')
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
export { InfluencerService }
