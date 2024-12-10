import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Enum } from '../../../../constants'
import { EmployeeProfile } from '../../admin/models'
import { InfluencerProfile } from '../../influencer/models'
import { BrandProfile } from '../../brands/models'
import {
  ICampaign,
  ICampaignDeliverables,
  ICampaignParticipants,
} from '../interface'
import { IBrandProfile } from '../../brands/interface'
import {
  ProformaInvoice,
  PurchaseInvoice,
  SaleInvoice,
} from '../../invoice/models'
import {
  IProformaInvoice,
  IPurchaseInvoice,
  ISaleInvoice,
} from '../../invoice/interface'
import { AgencyProfile } from '../../agency/models'
import { IAgencyProfile } from '../../agency/interface'

@Entity()
export class Campaign implements ICampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  code: string

  @ManyToOne(() => BrandProfile, (brandProfile) => brandProfile.campaign, {
    nullable: true,
  })
  brand: IBrandProfile | null

  @Column({ type: 'varchar', nullable: false })
  brandName: string

  @Column({ type: 'date', nullable: false })
  startDate: Date

  @Column({ type: 'date', nullable: false })
  endDate: Date

  @Column({ type: 'float', nullable: false })
  commercial: number

  @Column({ type: 'text', nullable: true })
  details: string | null

  @Column({ type: 'varchar', nullable: true })
  invoiceNo: string | null

  @Column({
    type: 'enum',
    enum: Enum.CampaignPaymentStatus,
    default: Enum.CampaignPaymentStatus.PENDING,
  })
  paymentStatus: Enum.CampaignPaymentStatus

  @Column({
    type: 'enum',
    enum: Enum.CampaignStatus,
    default: Enum.CampaignStatus.PENDING,
  })
  status: Enum.CampaignStatus

  @ManyToOne(
    () => EmployeeProfile,
    (employeeProfile) => employeeProfile.campaignManager,
    { nullable: false }
  )
  manager: EmployeeProfile

  @ManyToOne(
    () => EmployeeProfile,
    (employeeProfile) => employeeProfile.campaignIncentives,
    { nullable: true }
  )
  incentiveWinner: EmployeeProfile | null

  @OneToMany(
    () => CampaignParticipants,
    (participant) => participant.campaign,
    { cascade: true }
  )
  participants: ICampaignParticipants[]

  @OneToMany(() => SaleInvoice, (saleInvoice) => saleInvoice.campaign, {
    cascade: true,
  })
  saleInvoices: ISaleInvoice[]

  @OneToMany(
    () => PurchaseInvoice,
    (purchaseInvoice) => purchaseInvoice.campaign,
    { cascade: true }
  )
  purchaseInvoices: IPurchaseInvoice[]

  @OneToMany(
    () => ProformaInvoice,
    (purchaseInvoice) => purchaseInvoice.campaign,
    { cascade: true }
  )
  proformaInvoices: IProformaInvoice[]

  @Column({ type: 'float', nullable: true })
  cpv: number | null

  @Column({ type: 'boolean', default: false })
  incentiveReleased: boolean

  @Column({ type: 'enum', enum: Enum.PaymentTerms, default: null })
  paymentTerms: Enum.PaymentTerms

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class CampaignParticipants implements ICampaignParticipants {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  email: string

  @Column({ type: 'float', nullable: false, default: 0 })
  commercialBrand: number

  @Column({ type: 'float', nullable: true, default: null })
  commercialCreator: number | null

  @Column({ type: 'varchar', nullable: true, default: null })
  invoice: string | null

  @ManyToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.campaignParticipant,
    { nullable: true }
  )
  influencerProfile: InfluencerProfile | null

  @ManyToOne(
    () => AgencyProfile,
    (agencyProfile) => agencyProfile.campaignParticipant,
    { nullable: true }
  )
  agencyProfile: IAgencyProfile | null

  @ManyToOne(() => Campaign, (campaign) => campaign.participants, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: false,
  })
  campaign: ICampaign

  @Column({ type: 'float', nullable: true })
  toBePaid: number

  @Column({ type: 'float', nullable: true })
  margin: number | null

  @Column({
    type: 'enum',
    enum: Enum.CampaignInvoiceStatus,
    default: Enum.CampaignInvoiceStatus.NOT_GENERATED,
  })
  invoiceStatus: Enum.CampaignInvoiceStatus

  @Column({
    type: 'enum',
    enum: Enum.CampaignPaymentStatus,
    default: Enum.CampaignPaymentStatus.PENDING,
  })
  paymentStatus: Enum.CampaignPaymentStatus

  @OneToMany(
    () => CampaignDeliverables,
    (deliverable) => deliverable.campaignParticipant,
    { cascade: true }
  )
  deliverables: ICampaignDeliverables[]

  @Column({ type: 'boolean', default: false })
  confirmationSent: boolean

  @Column({
    type: 'enum',
    nullable: false,
    default: Enum.INFLUENCER_PAYMENT_TERMS.DAYS_30,
    enum: Enum.INFLUENCER_PAYMENT_TERMS,
  })
  paymentTerms: Enum.INFLUENCER_PAYMENT_TERMS

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class CampaignDeliverables implements ICampaignDeliverables {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'text', nullable: true })
  desc: string | null

  @Column({ type: 'enum', enum: Enum.Platform })
  platform: Enum.Platform

  @Column({
    type: 'enum',
    enum: Enum.CampaignDeliverableStatus,
    default: Enum.CampaignDeliverableStatus.NOT_LIVE,
  })
  status: Enum.CampaignDeliverableStatus

  @Column({ type: 'text', nullable: true })
  link: string | null

  @Column({ type: 'float', nullable: true })
  engagementRate: number | null

  @Column({ type: 'float', nullable: true })
  cpv: number | null

  @Column({ type: 'date', default: new Date() })
  statsUpdatedAt: Date

  @ManyToOne(
    () => CampaignParticipants,
    (participant) => participant.deliverables,
    { nullable: false, onDelete: 'CASCADE', eager: true }
  )
  campaignParticipant: ICampaignParticipants

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
