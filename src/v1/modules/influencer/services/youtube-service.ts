import { channelId, videoId } from '@gonetone/get-youtube-id-by-url'
import { AppLogger, HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import { IYoutubeService } from '../interface'
import { YoutubePostStats, YoutubeProfileStats } from '../types'

class YoutubeService implements IYoutubeService {
  private static instance: IYoutubeService | null = null
  private readonly axiosService: IAxiosService

  static getInstance = (axiosService: IAxiosService) => {
    if (YoutubeService.instance === null) {
      YoutubeService.instance = new YoutubeService(axiosService)
    }
    return YoutubeService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async getYoutubeProfileStats(
    profileURL: string
  ): Promise<YoutubeProfileStats> {
    try {
      const ytChannelId = await channelId(profileURL)

      const data = await this.axiosService.get(
        `https://youtube-v31.p.rapidapi.com/channels`,
        { id: ytChannelId, part: 'snippet,statistics' },
        {
          'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
          'x-rapidapi-key': process.env.YOUTUBE_API_KEY,
        }
      )

      const _data = data.items

      if (_data.length > 0) {
        const { viewCount, subscriberCount, videoCount } = _data[0].statistics
        const { title, description } = _data[0].brandingSettings.channel
        const { bannerExternalUrl } = _data[0].brandingSettings.image
        return {
          views: viewCount,
          subscribers: subscriberCount,
          videos: videoCount,
          title: title,
          description: description,
          image: bannerExternalUrl,
        }
      }

      return {
        views: 0,
        subscribers: 0,
        videos: 0,
        title: '',
        description: '',
        image: '',
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error: ${e} in YoutubeService in Profile Section`
      )
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }

  async getYoutubePostStats(postURL: string): Promise<YoutubePostStats> {
    try {
      const ytVideoId = await videoId(postURL)

      const data = await this.axiosService.get(
        `https://youtube-v31.p.rapidapi.com/videos`,
        { part: 'statistics', id: ytVideoId },
        {
          'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
          'x-rapidapi-key': process.env.YOUTUBE_API_KEY,
        }
      )

      const _data = data.items

      if (_data.length > 0) {
        const { viewCount, likeCount, commentCount } = _data[0].statistics
        return {
          views: viewCount,
          likes: likeCount,
          comments: commentCount,
        }
      }
      return {
        views: 0,
        likes: 0,
        comments: 0,
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error: ${e} in YoutubeService in Post Section`
      )
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }
}

export { YoutubeService }
