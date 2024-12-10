import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../../user/models'
import { IUser } from '../../user/interface'
import { CampaignParticipants } from '../../campaign/models'
import { ICampaignParticipants } from '../../campaign/interface'
import { PurchaseInvoice } from '../../invoice/models'
import { IAgencyProfile, ISearchCredits } from '../interface'

@Entity()
export class AgencyProfile implements IAgencyProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  pocFirstName: string

  @Column({ type: 'varchar', nullable: true })
  pocLastName: string

  @OneToOne(() => User, (user) => user.agencyProfile, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: IUser

  @Column({ type: 'varchar', nullable: false })
  websiteURL: string

  @Column({ type: 'varchar', nullable: true, default: null })
  profilePic: string | null

  @Column({ type: 'varchar', nullable: false, unique: true })
  mobileNo: string

  @OneToMany(
    () => CampaignParticipants,
    (campaignParticipant) => campaignParticipant.influencerProfile
  )
  campaignParticipant: ICampaignParticipants

  @OneToMany(
    () => PurchaseInvoice,
    (purchaseInvoice) => purchaseInvoice.agencyProfile,
    { cascade: true }
  )
  purchaseInvoices: PurchaseInvoice[]

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
  fundAccountId: string | null

  @Column({ type: 'varchar', default: null })
  address: string

  @Column({ type: 'varchar', default: null })
  city: string

  @Column({ type: 'varchar', default: null })
  state: string

  @Column({ type: 'varchar', default: null })
  pincode: string

  @OneToOne(() => SearchCredits, (searchCredits) => searchCredits.agency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'searchCreditsId' })
  searchCredits: ISearchCredits

  @Column({ type: 'varchar', default: null })
  agreement: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class SearchCredits implements ISearchCredits {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(
    () => AgencyProfile,
    (agencyProfile) => agencyProfile.searchCredits,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'agencyId' })
  agency: IAgencyProfile

  @Column({ type: 'bigint', default: 100 })
  credits: number

  @Column({ type: 'date', default: new Date() })
  lastUpdatedAt: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
