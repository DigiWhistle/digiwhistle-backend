import { AppLogger, HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import { IInstagramService } from '../interface'
import { InstagramPostStats, InstagramProfileStats } from '../types'

class InstagramService implements IInstagramService {
  private static instance: IInstagramService | null = null
  private readonly axiosService: IAxiosService

  static getInstance = (axiosService: IAxiosService) => {
    if (InstagramService.instance === null) {
      InstagramService.instance = new InstagramService(axiosService)
    }
    return InstagramService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async getInstagramProfileStats(
    profileURL: string
  ): Promise<InstagramProfileStats> {
    try {
      const data = await this.axiosService.get(
        `https://instagram-statistics-api.p.rapidapi.com/community`,
        { url: profileURL },
        {
          'x-rapidapi-host': 'instagram-statistics-api.p.rapidapi.com',
          'x-rapidapi-key': process.env.INSTAGRAM_API_KEY,
        }
      )

      const _data = data.data

      const {
        avgLikes,
        avgComments,
        avgER,
        pctFakeFollowers,
        usersCount,
        avgViews,
        name,
        description,
        image,
        countries,
        cities,
        ages,
        genders,
        membersReachability,
      } = _data

      return {
        likes: avgLikes,
        comments: avgComments,
        engagementRate: avgER,
        percentageFakeFollowers: pctFakeFollowers,
        followers: usersCount,
        views: avgViews,
        name: name,
        description: description,
        image: image,
        cities: typeof cities === 'object' ? JSON.stringify(cities) : null,
        countries:
          typeof countries === 'object' ? JSON.stringify(countries) : null,
        ages: typeof ages === 'object' ? JSON.stringify(ages) : null,
        genders: typeof genders === 'object' ? JSON.stringify(genders) : null,
        reach:
          typeof membersReachability === 'object'
            ? JSON.stringify(membersReachability)
            : null,
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error: ${e} in InstagramService in Profile Section`
      )
      throw new HttpException(e?.errorCode, e?.response?.statusText)
    }
  }

  async getInstagramPostStats(postURL: string): Promise<InstagramPostStats> {
    try {
      const data = await this.axiosService.get(
        `https://instagram-statistics-api.p.rapidapi.com/posts/one`,
        { postUrl: postURL },
        {
          'x-rapidapi-host': 'instagram-statistics-api.p.rapidapi.com',
          'x-rapidapi-key': process.env.INSTAGRAM_API_KEY,
        }
      )

      const _data = data.data
      const { likes, comments, views } = _data

      return {
        likes,
        comments,
        views,
      }
    } catch (e) {
      AppLogger.getInstance().error(
        `Error: ${e} in InstagramService in Post Section`
      )
      throw new HttpException(e?.errorCode, e?.response?.statusText)
    }
  }
}

export { InstagramService }
