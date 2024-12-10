import millify from 'millify'
import { Enum } from '../../constants'
import { IInfluencerProfile } from '../modules/influencer/interface'
import {
  InfluencerStats,
  InstagramProfileStats,
  TwitterProfileStats,
  YoutubeProfileStats,
} from '../modules/influencer/types'

export class InfluencerDTO {
  static transformationForInfluencerList(data: IInfluencerProfile) {
    return {
      name:
        data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
      youtubeUrl: data.youtubeURL,
      instagramUrl: data.instagramURL,
      twitterUrl: data.twitterURL,
      profilePic: data.profilePic,
      linkedInUrl: data.linkedInURL,
      niche: data.niche,
    }
  }

  static transformationForInfluencerResponse(
    data: IInfluencerProfile,
    platform: Enum.Platform
  ) {
    if (platform === Enum.Platform.YOUTUBE) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isPaused: data.user.isPaused,
        isVerified: data.user.isVerified,
        mobileNo: data.mobileNo,
        exclusive: data.exclusive,
        pay: data.pay,
        hideFrom: data.hideFrom,
        userId: data.user.id,
        views: millify(data?.youtubeStats?.views as number),
        subscribers: millify(data?.youtubeStats?.subscribers as number),
        videos: millify(data?.youtubeStats?.videos as number),
        profileUrl: data.youtubeURL,
        requestDate: data.createdAt,
        isApproved: data.user.isApproved,
        commercial: data.youtubeCommercial,
        location: data.location,
        rating: data.rating,
        isAgreementSent: data.agreement === null ? false : true,
      }
    } else if (platform === Enum.Platform.INSTAGRAM) {
      const cities: Array<any> = []
      const ages: Array<any> = []
      const genders: Array<any> = []
      const reach: Array<any> = []
      const countries: Array<any> = []

      if (data?.instagramStats?.cities) {
        const obj = JSON.parse(data?.instagramStats?.cities)
        obj.forEach((element: any) => {
          cities.push({
            label: element.name,
            value: element.percent * 100,
          })
        })
      }

      if (data?.instagramStats?.ages) {
        const obj = JSON.parse(data?.instagramStats?.ages)
        obj.forEach((element: any) => {
          ages.push({
            label: element.name.replace('_', '-'),
            value: element.percent * 100,
          })
        })
      }

      if (data?.instagramStats?.genders) {
        const obj = JSON.parse(data?.instagramStats?.genders)
        obj.forEach((element: any) => {
          genders.push({
            label: element.name === 'm' ? 'Male' : 'Female',
            value: element.percent * 100,
          })
        })
      }

      if (data?.instagramStats?.reach) {
        const obj = JSON.parse(data?.instagramStats?.reach)
        obj.forEach((element: any) => {
          reach.push({
            label:
              element.name === 'r1500_plus'
                ? '1500+'
                : element.name.replace('_', '-').replace('r', ''),
            value: element.percent * 100,
          })
        })
      }

      if (data?.instagramStats?.countries) {
        const obj = JSON.parse(data?.instagramStats?.countries)
        obj.forEach((element: any) => {
          countries.push({
            label: element.name,
            value: element.percent * 100,
          })
        })
      }

      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isPaused: data.user.isPaused,
        isVerified: data.user.isVerified,
        mobileNo: data.mobileNo,
        exclusive: data.exclusive,
        pay: data.pay,
        hideFrom: data.hideFrom,
        userId: data.user.id,
        followers: millify(data?.instagramStats?.followers as number),
        likes: millify(data?.instagramStats?.likes as number),
        comments: millify(data?.instagramStats?.comments as number),
        views: millify(data?.instagramStats?.views as number),
        engagementRate: {
          value: (data?.instagramStats?.engagementRate as number) * 100,
          label:
            (data?.instagramStats?.engagementRate as number) * 100 >= 1
              ? 'High'
              : 'Moderate',
        },
        percentageFakeFollowers: data?.instagramStats
          ?.percentageFakeFollowers as number,
        profileUrl: data.instagramURL,
        requestDate: data.createdAt,
        isApproved: data.user.isApproved,
        location: data.location,
        commercial: data.instagramCommercial,
        rating: data.rating,
        cities: cities,
        countries: countries,
        genders: genders,
        ages: ages,
        reach: reach,
        isAgreementSent: data.agreement === null ? false : true,
      }
    } else if (platform === Enum.Platform.X) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isPaused: data.user.isPaused,
        isVerified: data.user.isVerified,
        mobileNo: data.mobileNo,
        exclusive: data.exclusive,
        pay: data.pay,
        hideFrom: data.hideFrom,
        userId: data.user.id,
        followers: millify(data?.twitterStats?.followers as number),
        views: millify(data?.twitterStats?.views as number),
        tweets: millify(data?.twitterStats?.tweets as number),
        replyCount: millify(data?.twitterStats?.replyCount as number),
        retweets: millify(data?.twitterStats?.retweets as number),
        profileUrl: data.twitterURL,
        requestDate: data.createdAt,
        isApproved: data.user.isApproved,
        commercial: data.twitterCommercial,
        location: data.location,
        rating: data.rating,
        isAgreementSent: data.agreement === null ? false : true,
      }
    } else if (platform === Enum.Platform.LINKEDIN) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isPaused: data.user.isPaused,
        isVerified: data.user.isVerified,
        mobileNo: data.mobileNo,
        exclusive: data.exclusive,
        pay: data.pay,
        hideFrom: data.hideFrom,
        profileUrl: data.linkedInURL,
        requestDate: data.createdAt,
        isApproved: data.user.isApproved,
        commercial: data.linkedInCommercial,
        location: data.location,
        followers: millify(data?.linkedInStats?.followers as number),
        likes: millify(data?.linkedInStats?.likes as number),
        comments: millify(data?.linkedInStats?.comments as number),
        reactions: millify(data?.linkedInStats?.reactions as number),
        shares: millify(data?.linkedInStats?.shares as number),
        rating: data.rating,
        isAgreementSent: data.agreement === null ? false : true,
      }
    }
  }

  static transformationForInfluencerRequests(
    data: IInfluencerProfile,
    platform: Enum.Platform
  ) {
    if (platform === Enum.Platform.YOUTUBE) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isApproved: data.user.isApproved,
        mobileNo: data.mobileNo,
        userId: data.user.id,
        views: millify(data?.youtubeStats?.views as number),
        subscribers: millify(data?.youtubeStats?.subscribers as number),
        videos: millify(data?.youtubeStats?.videos as number),
        profileUrl: data.youtubeURL,
        requestDate: data.createdAt,
        isAgreementSent: data.agreement === null ? false : true,
      }
    }

    if (platform === Enum.Platform.INSTAGRAM) {
      const cities: Array<any> = []
      const ages: Array<any> = []
      const genders: Array<any> = []
      const reach: Array<any> = []
      const countries: Array<any> = []

      if (data?.instagramStats?.cities) {
        const obj = JSON.parse(data?.instagramStats?.cities)
        obj.forEach((element: any) => {
          cities.push({
            label: element.name,
            value: element.percent,
          })
        })
      }

      if (data?.instagramStats?.ages) {
        const obj = JSON.parse(data?.instagramStats?.ages)
        obj.forEach((element: any) => {
          ages.push({
            label: element.name,
            value: element.percent,
          })
        })
      }

      if (data?.instagramStats?.genders) {
        const obj = JSON.parse(data?.instagramStats?.genders)
        obj.forEach((element: any) => {
          genders.push({
            label: element.name,
            value: element.percent,
          })
        })
      }

      if (data?.instagramStats?.reach) {
        const obj = JSON.parse(data?.instagramStats?.reach)
        obj.forEach((element: any) => {
          reach.push({
            label: element.name,
            value: element.percent,
          })
        })
      }

      if (data?.instagramStats?.countries) {
        const obj = JSON.parse(data?.instagramStats?.countries)
        obj.forEach((element: any) => {
          countries.push({
            label: element.name,
            value: element.percent,
          })
        })
      }

      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isApproved: data.user.isApproved,
        mobileNo: data.mobileNo,
        userId: data.user.id,
        followers: millify(data?.instagramStats?.followers as number),
        likes: millify(data?.instagramStats?.likes as number),
        comments: millify(data?.instagramStats?.comments as number),
        views: millify(data?.instagramStats?.views as number),
        engagementRate: {
          value: (data?.instagramStats?.engagementRate as number) * 100,
          label:
            (data?.instagramStats?.engagementRate as number) * 100 >= 1
              ? 'High'
              : 'Moderate',
        },
        percentageFakeFollowers: data?.instagramStats
          ?.percentageFakeFollowers as number,
        profileUrl: data.instagramURL,
        requestDate: data.createdAt,
        cities: cities,
        countries: countries,
        genders: genders,
        ages: ages,
        reach: reach,
        isAgreementSent: data.agreement === null ? false : true,
      }
    }

    if (platform === Enum.Platform.X) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        isApproved: data.user.isApproved,
        mobileNo: data.mobileNo,
        userId: data.user.id,
        followers: millify(data?.twitterStats?.followers as number),
        views: millify(data?.twitterStats?.views as number),
        tweets: millify(data?.twitterStats?.tweets as number),
        replyCount: millify(data?.twitterStats?.replyCount as number),
        retweets: millify(data?.twitterStats?.retweets as number),
        profileUrl: data.twitterURL,
        requestDate: data.createdAt,
        isAgreementSent: data.agreement === null ? false : true,
      }
    }

    if (platform === Enum.Platform.LINKEDIN) {
      return {
        profileId: data.id,
        name:
          data.firstName + ' ' + (data.lastName !== null ? data.lastName : ''),
        email: data.user.email,
        mobileNo: data.mobileNo,
        profileUrl: data.linkedInURL,
        requestDate: data.createdAt,
        isApproved: data.user.isApproved,
        followers: millify(data?.linkedInStats?.followers as number),
        likes: millify(data?.linkedInStats?.likes as number),
        comments: millify(data?.linkedInStats?.comments as number),
        reactions: millify(data?.linkedInStats?.reactions as number),
        shares: millify(data?.linkedInStats?.shares as number),
        isAgreementSent: data.agreement === null ? false : true,
      }
    }
  }

  static transformationForExploreInstagramProfile(
    data: InstagramProfileStats,
    url: string
  ) {
    return {
      cards: [
        {
          label: 'Followers Count',
          value: data.followers,
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Average ER',
          value: Math.round(data.engagementRate * 100),
          subValue: '',
          iconName: 'ChartPieIcon',
        },
        {
          label: 'Average Views',
          value: data.views,
          subValue: '',
          iconName: 'ChartBarIcon',
        },
        {
          label: 'Average Likes',
          value: data.likes,
          subValue: '',
          iconName: 'HandThumbUpIcon',
        },
      ],
      name: data.name,
      profilePic: data.image,
      desc: data.description,
      metric: {
        key: 'Fake Followers',
        value: Math.round(data.percentageFakeFollowers * 100),
      },
      profileUrl: url,
    }
  }

  static transformationForExploreTwitterProfile(
    data: TwitterProfileStats,
    url: string
  ) {
    return {
      cards: [
        {
          label: 'Followers Count',
          value: data.followers,
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Reply Count',
          value: data.replyCount,
          subValue: '',
          iconName: 'InboxArrowDownIcon',
        },
        {
          label: 'Tweets',
          value: data.tweets,
          subValue: '',
          iconName: 'ChatBubbleBottomCenterTextIcon',
        },
        {
          label: 'Average Views',
          value: data.views,
          subValue: '',
          iconName: 'EyeIcon',
        },
      ],
      name: data.name,
      profilePic: data.image,
      desc: data.description,
      metric: {
        key: 'Retweets',
        value: data.retweets,
      },
      profileUrl: url,
    }
  }

  static transformationForExploreYoutubeProfile(
    data: YoutubeProfileStats,
    url: string
  ) {
    return {
      cards: [
        {
          label: 'Subscribers',
          value: data.subscribers,
          subValue: '',
          iconName: 'UsersIcon',
        },
        {
          label: 'Average Views',
          value: data.views,
          subValue: '',
          iconName: 'EyeIcon',
        },
        {
          label: 'Videos',
          value: data.videos,
          subValue: '',
          iconName: 'VideoCameraIcon',
        },
      ],
      name: data.title,
      profilePic: data.image,
      desc: data.description,
      profileUrl: url,
    }
  }

  static transformationForInfluencerStats(data: InfluencerStats) {
    return [
      {
        label: 'Total Influencers',
        value: parseInt(data.exclusive) + parseInt(data.nonexclusive),
        subValue: '',
        iconName: 'UsersIcon',
      },
      {
        label: 'Exclusive Influencers',
        value: parseInt(data.exclusive),
        subValue: '',
        iconName: 'StarIcon',
      },
    ]
  }
}
