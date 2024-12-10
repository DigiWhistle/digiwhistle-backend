import { AppLogger, HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import { ITwitterService } from '../interface'
import { TwitterPostStats, TwitterProfileStats } from '../types'

class TwitterService implements ITwitterService {
  private static instance: ITwitterService | null = null
  private readonly axiosService: IAxiosService

  static getInstance = (axiosService: IAxiosService) => {
    if (TwitterService.instance === null) {
      TwitterService.instance = new TwitterService(axiosService)
    }
    return TwitterService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async getTwitterProfileStats(
    profileURL: string
  ): Promise<TwitterProfileStats> {
    try {
      const username = profileURL.split('/').pop()
      const header = {
        'x-rapidapi-host': 'twitter154.p.rapidapi.com',
        'x-rapidapi-key': process.env.TWITTER_API_KEY,
      }

      const data = await this.axiosService.get(
        `https://twitter154.p.rapidapi.com/user/details`,
        { username: username },
        header
      )

      const {
        follower_count,
        number_of_tweets,
        user_id,
        name,
        profile_pic_url,
        description,
      } = data

      const mediaData = await this.axiosService.get(
        'https://twitter154.p.rapidapi.com/user/medias',
        { user_id: user_id, limit: 50 },
        header
      )

      let views = 0,
        replyCount = 0,
        retweetCount = 0

      mediaData.results.forEach((item) => {
        views += item.views
        ;(replyCount += item.reply_count), (retweetCount += item.retweet_count)
      })

      return {
        followers: follower_count,
        tweets: number_of_tweets,
        views: Math.ceil(views / Math.max(1, mediaData.results.length)),
        replyCount: Math.ceil(
          replyCount / Math.max(1, mediaData.results.length)
        ),
        retweets: Math.ceil(
          retweetCount / Math.max(1, mediaData.results.length)
        ),
        name: name,
        image: profile_pic_url,
        description: description,
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error: ${e} in TwitterService in Profile Section`
      )
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async getTwitterPostStats(postURL: string): Promise<TwitterPostStats> {
    try {
      const tweetId = postURL.split('/').pop()
      const header = {
        'x-rapidapi-host': 'twitter154.p.rapidapi.com',
        'x-rapidapi-key': process.env.TWITTER_API_KEY,
      }

      const data = await this.axiosService.get(
        `https://twitter154.p.rapidapi.com/tweet/details`,
        { tweetId: tweetId },
        header
      )

      const { reply_count, retweet_count, views } = data

      return {
        replyCount: reply_count,
        retweets: retweet_count,
        views: views,
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error :${e} in TwitterService in Post Section`
      )
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }
}

export { TwitterService }
