export interface IAddInfluencerInput {
  firstName: string
  lastName: string
  mobileNo: string
  email: string
  twitterURL?: string
  youtubeURL?: string
  instagramURL?: string
  linkedInURL?: string
  location: string
  instagramCommercial: number
  twitterCommercial: number
  youtubeCommercial: number
  linkedInCommercial: number
  rating: number
}

export interface IAddInfluencer extends IAddInfluencerInput {
  userId: string
}

export interface IInviteInfluencerInput {
  emails: string[]
  message: string
  subject: string
}

export type InstagramProfileStats = {
  likes: number
  comments: number
  followers: number
  engagementRate: number
  percentageFakeFollowers: number
  views: number
  name: string
  description: string
  image: string
  cities: string | null
  countries: string | null
  genders: string | null
  ages: string | null
  reach: string | null
}

export type InstagramPostStats = {
  likes: number
  comments: number
  views: number
}

export type YoutubePostStats = {
  likes: number
  comments: number
  views: number
}

export type YoutubeProfileStats = {
  views: number
  subscribers: number
  videos: number
  title: string
  description: string
  image: string
}

export type TwitterProfileStats = {
  followers: number
  tweets: number
  views: number
  replyCount: number
  retweets: number
  name: string
  image: string
  description: string
}

export type TwitterPostStats = {
  views: number
  replyCount: number
  retweets: number
}

export type InfluencerByEmailResponse = {
  email: string
  profile: string
}

export type InfluencerStats = {
  nonexclusive: string
  exclusive: string
}

export type ExploreInfluencerResponse = {
  stats: InstagramProfileStats | TwitterProfileStats | YoutubeProfileStats
  isDigiwhistle: boolean
}

export type LinkedInProfileStats = {
  handleName: string | null
  about: string | null
  followers: number
  profilePic: string | null
  likes: number
  comments: number
  shares: number
  reactions: number
}
