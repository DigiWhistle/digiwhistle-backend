import { HttpException } from '../../../../utils'
import { IAxiosService } from '../../../utils'
import { ILinkedInService } from '../interface'
import { LinkedInProfileStats } from '../types'

class LinkedInService implements ILinkedInService {
  private static instance: ILinkedInService | null = null
  private readonly axiosService: IAxiosService

  static getInstance = (axiosService: IAxiosService) => {
    if (LinkedInService.instance === null) {
      LinkedInService.instance = new LinkedInService(axiosService)
    }
    return LinkedInService.instance
  }

  private constructor(axiosService: IAxiosService) {
    this.axiosService = axiosService
  }

  async getLinkedInProfileStats(
    profileURL: string
  ): Promise<LinkedInProfileStats> {
    try {
      const headers = {
        'x-rapidapi-host': 'linkedin-data-scraper.p.rapidapi.com',
        'x-rapidapi-key': process.env.LINKEDIN_API_KEY,
        'Content-Type': 'application/json',
      }

      const personData = await this.axiosService.post(
        `https://linkedin-data-scraper.p.rapidapi.com/person`,
        { link: profileURL },
        headers
      )

      const posts = await this.axiosService.post(
        `https://linkedin-data-scraper.p.rapidapi.com/profile_updates`,
        { profile_url: profileURL, posts: 30 },
        headers
      )

      const _posts = posts.response
      let likes = 0,
        comments = 0,
        shares = 0,
        reactions = 0

      _posts.forEach((item: any) => {
        likes += item?.socialCount?.numLikes
        comments += item?.socialCount?.numComments
        shares += item?.socialCount?.numShares
        item?.socialCount?.reactionTypeCounts?.forEach((reaction: any) => {
          reactions += reaction?.count
        })
      })

      const avgLikes = Math.floor(likes / _posts.length)
      const avgComments = Math.floor(comments / _posts.length)
      const avgShares = Math.floor(shares / _posts.length)
      const avgReactions = Math.floor(reactions / _posts.length)
      const followers = personData?.data?.followers
      const name = personData?.data?.fullName
      const about = personData?.data?.about
      const profilePic = personData?.data?.profilePic

      return {
        followers: followers,
        likes: avgLikes,
        comments: avgComments,
        shares: avgShares,
        reactions: avgReactions,
        handleName: name,
        about: about,
        profilePic: profilePic,
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.errorMessage)
    }
  }
}

export { LinkedInService }
