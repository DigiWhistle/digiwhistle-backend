import { HttpException } from '../../../../utils'
import {
  IInfluencerStatsService,
  IInstagramProfileStatsService,
  IInstagramService,
  ILinkedInProfileStatsService,
  ILinkedInService,
  ITwitterProfileStatsService,
  ITwitterService,
  IYoutubeProfileStatsService,
  IYoutubeService,
} from '../interface'

class InfluencerStatsService implements IInfluencerStatsService {
  private static instance: IInfluencerStatsService | null = null
  private readonly instagramService: IInstagramService
  private readonly youtubeService: IYoutubeService
  private readonly twitterService: ITwitterService
  private readonly linkedInService: ILinkedInService
  private readonly instagramProfileStatsService: IInstagramProfileStatsService
  private readonly youtubeProfileStatsService: IYoutubeProfileStatsService
  private readonly twitterProfileStatsService: ITwitterProfileStatsService
  private readonly linkedInProfileStatsService: ILinkedInProfileStatsService

  static getInstance(
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService,
    linkedInService: ILinkedInService,
    instagramProfileStatsService: IInstagramProfileStatsService,
    youtubeProfileStatsService: IYoutubeProfileStatsService,
    twitterProfileStatsService: ITwitterProfileStatsService,
    linkedInProfileStatsService: ILinkedInProfileStatsService
  ) {
    if (InfluencerStatsService.instance === null) {
      InfluencerStatsService.instance = new InfluencerStatsService(
        instagramService,
        youtubeService,
        twitterService,
        linkedInService,
        instagramProfileStatsService,
        youtubeProfileStatsService,
        twitterProfileStatsService,
        linkedInProfileStatsService
      )
    }
    return InfluencerStatsService.instance
  }

  private constructor(
    instagramService: IInstagramService,
    youtubeService: IYoutubeService,
    twitterService: ITwitterService,
    linkedInService: ILinkedInService,
    instagramProfileStatsService: IInstagramProfileStatsService,
    youtubeProfileStatsService: IYoutubeProfileStatsService,
    twitterProfileStatsService: ITwitterProfileStatsService,
    linkedInProfileStatsService: ILinkedInProfileStatsService
  ) {
    this.instagramService = instagramService
    this.youtubeService = youtubeService
    this.twitterService = twitterService
    this.linkedInService = linkedInService
    this.youtubeProfileStatsService = youtubeProfileStatsService
    this.instagramProfileStatsService = instagramProfileStatsService
    this.twitterProfileStatsService = twitterProfileStatsService
    this.linkedInProfileStatsService = linkedInProfileStatsService
  }

  private async fetchInstagramStatsAndSave(
    profileId: string,
    instagramURL: string
  ): Promise<void> {
    try {
      const instagramProfileStats =
        await this.instagramService.getInstagramProfileStats(instagramURL)

      const {
        likes,
        comments,
        followers,
        engagementRate,
        percentageFakeFollowers,
        views,
        name,
        image,
        description,
        cities,
        countries,
        genders,
        ages,
        reach,
      } = instagramProfileStats

      await this.instagramProfileStatsService.addOrUpdate({
        likes: likes,
        comments: comments,
        followers: followers,
        engagementRate: engagementRate,
        percentageFakeFollowers: percentageFakeFollowers,
        views: views,
        handleName: name,
        profilePic: image,
        influencerProfile: {
          id: profileId,
        },
        description: description,
        cities: cities,
        countries: countries,
        genders: genders,
        ages: ages,
        reach: reach,
      })
    } catch (e) {
      await this.instagramProfileStatsService.addOrUpdate({
        influencerProfile: {
          id: profileId,
        },
      })
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async fetchYoutubeStatsAndSave(
    profileId: string,
    youtubeURL: string
  ): Promise<void> {
    try {
      const youtubeProfileStats =
        await this.youtubeService.getYoutubeProfileStats(youtubeURL)

      const { views, subscribers, videos, title, image, description } =
        youtubeProfileStats

      await this.youtubeProfileStatsService.addOrUpdate({
        videos: videos,
        views: views,
        subscribers: subscribers,
        handleName: title,
        profilePic: image,
        description: description,
        influencerProfile: {
          id: profileId,
        },
      })
    } catch (e) {
      await this.youtubeProfileStatsService.addOrUpdate({
        influencerProfile: {
          id: profileId,
        },
      })
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async fetchTwitterStatsAndSave(
    profileId: string,
    twitterURL: string
  ): Promise<void> {
    try {
      const twitterProfileStats =
        await this.twitterService.getTwitterProfileStats(twitterURL)

      const {
        followers,
        tweets,
        views,
        replyCount,
        retweets,
        name,
        image,
        description,
      } = twitterProfileStats

      await this.twitterProfileStatsService.addOrUpdate({
        followers: followers,
        tweets: tweets,
        views: views,
        replyCount: replyCount,
        retweets: retweets,
        handleName: name,
        profilePic: image,
        influencerProfile: {
          id: profileId,
        },
        description: description,
      })
    } catch (e) {
      await this.twitterProfileStatsService.addOrUpdate({
        influencerProfile: {
          id: profileId,
        },
      })
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async fetchLinkedInStatsAndSave(
    profileId: string,
    linkedInURL: string
  ): Promise<void> {
    try {
      const linkedInProfileStats =
        await this.linkedInService.getLinkedInProfileStats(linkedInURL)

      const {
        handleName,
        about,
        followers,
        likes,
        comments,
        shares,
        profilePic,
        reactions,
      } = linkedInProfileStats

      await this.linkedInProfileStatsService.addOrUpdate({
        handleName: handleName,
        about: about,
        followers: followers,
        likes: likes,
        comments: comments,
        shares: shares,
        profilePic: profilePic,
        reactions: reactions,
        influencerProfile: {
          id: profileId,
        },
      })
    } catch (e) {
      await this.linkedInProfileStatsService.addOrUpdate({
        influencerProfile: {
          id: profileId,
        },
      })
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async fetchAllStatsAndSave(
    profileId: string,
    instagramURL: string | null | undefined,
    youtubeURL: string | null | undefined,
    twitterURL: string | null | undefined,
    linkedInURL: string | null | undefined
  ): Promise<void> {
    try {
      const promises: Promise<void>[] = []

      if (instagramURL !== null && instagramURL !== undefined) {
        promises.push(this.fetchInstagramStatsAndSave(profileId, instagramURL))
      }

      if (youtubeURL !== null && youtubeURL !== undefined) {
        promises.push(this.fetchYoutubeStatsAndSave(profileId, youtubeURL))
      }

      if (twitterURL !== null && twitterURL !== undefined) {
        promises.push(this.fetchTwitterStatsAndSave(profileId, twitterURL))
      }

      if (linkedInURL !== null && linkedInURL !== undefined) {
        promises.push(this.fetchLinkedInStatsAndSave(profileId, linkedInURL))
      }

      await Promise.allSettled([...promises])
    } catch (e) {
      console.log(e)
    }
  }
}

export { InfluencerStatsService }
