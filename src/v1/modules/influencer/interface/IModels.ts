import { type ObjectLiteral } from 'typeorm'
import { IUser } from '../../user/interface'
import { IPurchaseInvoice } from '../../invoice/interface'

export interface IInfluencerProfile extends ObjectLiteral {
  id: string
  firstName: string
  lastName: string
  exclusive: boolean
  hideFrom: string
  pay: number
  user: IUser
  profilePic: string | null
  niche: string | null
  twitterURL?: string | null
  youtubeURL?: string | null
  instagramURL?: string | null
  linkedInURL?: string | null
  youtubeStats?: IYoutubeProfileStats | null
  instagramStats?: IInstagramProfileStats | null
  twitterStats?: ITwitterProfileStats | null
  linkedInStats?: ILinkedInProfileStats | null
  purchaseInvoices?: IPurchaseInvoice[] | null
  mobileNo: string
  aadharNo: string
  panNo: string
  gstNo: string
  msmeNo: string
  bankName: string
  bankAccountNumber: string
  bankIfscCode: string
  bankAccountHolderName: string
  address: string
  city: string
  state: string
  pincode: string
  fundAccountId: string | null
  location: string
  instagramCommercial: number
  twitterCommercial: number
  youtubeCommercial: number
  linkedInCommercial: number
  rating: number
  agreement: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface IInstagramProfileStats extends ObjectLiteral {
  id: string
  likes: number
  comments: number
  followers: number
  engagementRate: number
  percentageFakeFollowers: number
  views: number
  profilePic: string | null
  handleName: string | null
  description: string | null
  countries: string | null
  genders: string | null
  ages: string | null
  cities: string | null
  reach: string | null
  influencerProfile: IInfluencerProfile
  createdAt?: Date
  updatedAt?: Date
}

export interface IYoutubeProfileStats extends ObjectLiteral {
  id: string
  views: number
  videos: number
  subscribers: number
  profilePic: string | null
  handleName: string | null
  description: string | null
  influencerProfile: IInfluencerProfile
  createdAt?: Date
  updatedAt?: Date
}

export interface ITwitterProfileStats extends ObjectLiteral {
  id: string
  followers: number
  tweets: number
  views: number
  replyCount: number
  retweets: number
  profilePic: string | null
  handleName: string | null
  description: string | null
  influencerProfile: IInfluencerProfile
  createdAt?: Date
  updatedAt?: Date
}

export interface ILinkedInProfileStats extends ObjectLiteral {
  id: string
  handleName: string | null
  about: string | null
  followers: number
  profilePic: string | null
  influencerProfile: IInfluencerProfile
  likes: number
  comments: number
  shares: number
  reactions: number
  createdAt?: Date
  updatedAt?: Date
}
