import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { IUser } from '../../user/interface'
import {
  IInfluencerProfile,
  IInstagramProfileStats,
  ILinkedInProfileStats,
  ITwitterProfileStats,
  IYoutubeProfileStats,
} from '../interface'
import { User } from '../../user/models'
import { Campaign, CampaignParticipants } from '../../campaign/models'
import { ICampaignParticipants } from '../../campaign/interface'
import { PurchaseInvoice } from '../../invoice/models'
import { IPurchaseInvoice } from '../../invoice/interface'

@Entity()
export class InfluencerProfile implements IInfluencerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'boolean', default: false })
  exclusive: boolean

  @Column({ type: 'varchar', default: null })
  hideFrom: string

  @Column({ type: 'int', default: null })
  pay: number

  @Column({ type: 'varchar', default: null })
  niche: string

  @Column({ type: 'varchar', default: null })
  profilePic: string

  @OneToOne(() => User, (user) => user.influencerProfile, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: IUser

  @Column({ type: 'varchar', nullable: true })
  twitterURL: string

  @Column({ type: 'varchar', nullable: true })
  youtubeURL: string

  @Column({ type: 'varchar', nullable: true })
  instagramURL: string

  @Column({ type: 'varchar', nullable: true })
  linkedInURL: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  mobileNo: string

  @OneToOne(
    () => InstagramProfileStats,
    (instagramStats) => instagramStats.influencerProfile,
    { nullable: true }
  )
  instagramStats: IInstagramProfileStats

  @OneToOne(
    () => YoutubeProfileStats,
    (youtubeStats) => youtubeStats.influencerProfile,
    { nullable: true }
  )
  youtubeStats: IYoutubeProfileStats

  @OneToOne(
    () => TwitterProfileStats,
    (twitterStats) => twitterStats.influencerProfile
  )
  twitterStats: ITwitterProfileStats

  @OneToOne(
    () => LinkedInProfileStats,
    (linkedInStats) => linkedInStats.influencerProfile
  )
  linkedInStats: ILinkedInProfileStats

  @OneToMany(
    () => CampaignParticipants,
    (campaignParticipant) => campaignParticipant.influencerProfile
  )
  campaignParticipant: ICampaignParticipants

  @OneToMany(() => PurchaseInvoice, (invoice) => invoice.influencerProfile, {
    cascade: true,
  })
  purchaseInvoices: IPurchaseInvoice[]

  @Column({ type: 'varchar', default: null })
  aadharNo: string

  @Column({ type: 'varchar', default: null })
  panNo: string

  @Column({ type: 'varchar', default: null })
  gstNo: string

  @Column({ type: 'varchar', default: null })
  msmeNo: string

  @Column({ type: 'varchar', default: null })
  bankName: string

  @Column({ type: 'varchar', default: null })
  bankAccountNumber: string

  @Column({ type: 'varchar', default: null })
  bankIfscCode: string

  @Column({ type: 'varchar', default: null })
  bankAccountHolderName: string

  @Column({ type: 'varchar', default: null })
  address: string

  @Column({ type: 'varchar', default: null })
  city: string

  @Column({ type: 'varchar', default: null })
  state: string

  @Column({ type: 'varchar', default: null })
  pincode: string

  @Column({ type: 'varchar', default: null, nullable: true })
  fundAccountId: string | null

  @Column({ type: 'varchar', default: null })
  location: string

  @Column({ type: 'int4', default: 0 })
  instagramCommercial: number

  @Column({ type: 'int4', default: 0 })
  twitterCommercial: number

  @Column({ type: 'int4', default: 0 })
  youtubeCommercial: number

  @Column({ type: 'int4', default: 0 })
  linkedInCommercial: number

  @Column({ type: 'int4', default: 0 })
  rating: number

  @Column({ type: 'varchar', default: null })
  agreement: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class YoutubeProfileStats implements IYoutubeProfileStats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'bigint', default: 0 })
  views: number

  @Column({ type: 'bigint', default: 0 })
  videos: number

  @Column({ type: 'bigint', default: 0 })
  subscribers: number

  @Column({ type: 'varchar', default: null })
  profilePic: string | null

  @Column({ type: 'varchar', default: null })
  handleName: string | null

  @Column({ type: 'varchar', default: null })
  description: string | null

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.youtubeStats
  )
  @JoinColumn({ name: 'profileId' })
  influencerProfile: InfluencerProfile

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class InstagramProfileStats implements IInstagramProfileStats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'bigint', default: 0 })
  likes: number

  @Column({ type: 'bigint', default: 0 })
  comments: number

  @Column({ type: 'bigint', default: 0 })
  followers: number

  @Column({ type: 'decimal', default: 0 })
  engagementRate: number

  @Column({ type: 'decimal', default: 0 })
  percentageFakeFollowers: number

  @Column({ type: 'bigint', default: 0 })
  views: number

  @Column({ type: 'varchar', default: null })
  profilePic: string | null

  @Column({ type: 'varchar', default: null })
  handleName: string | null

  @Column({ type: 'varchar', default: null })
  description: string | null

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.instagramStats
  )
  @JoinColumn({ name: 'profileId' })
  influencerProfile: InfluencerProfile

  @Column({ type: 'varchar', default: null })
  cities: string | null

  @Column({ type: 'varchar', default: null })
  countries: string | null

  @Column({ type: 'varchar', default: null })
  reach: string | null

  @Column({ type: 'varchar', default: null })
  ages: string | null

  @Column({ type: 'varchar', default: null })
  genders: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class TwitterProfileStats implements ITwitterProfileStats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'bigint', default: 0 })
  followers: number

  @Column({ type: 'bigint', default: 0 })
  tweets: number

  @Column({ type: 'bigint', default: 0 })
  views: number

  @Column({ type: 'bigint', default: 0 })
  replyCount: number

  @Column({ type: 'bigint', default: 0 })
  retweets: number

  @Column({ type: 'varchar', default: null })
  profilePic: string | null

  @Column({ type: 'varchar', default: null })
  handleName: string | null

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.twitterStats
  )
  @JoinColumn({ name: 'profileId' })
  influencerProfile: InfluencerProfile

  @Column({ type: 'varchar', default: null })
  description: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class LinkedInProfileStats implements ILinkedInProfileStats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'bigint', default: 0 })
  followers: number

  @Column({ type: 'bigint', default: 0 })
  likes: number

  @Column({ type: 'bigint', default: 0 })
  comments: number

  @Column({ type: 'bigint', default: 0 })
  shares: number

  @Column({ type: 'bigint', default: 0 })
  reactions: number

  @Column({ type: 'varchar', default: null })
  profilePic: string | null

  @Column({ type: 'varchar', default: null })
  handleName: string | null

  @Column({ type: 'varchar', default: null })
  about: string | null

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.linkedInStats
  )
  @JoinColumn({ name: 'profileId' })
  influencerProfile: InfluencerProfile

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
