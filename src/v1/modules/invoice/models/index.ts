import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IPurchaseInvoice, ISaleInvoice } from '../interface'
import { ICampaign } from '../../campaign/interface'
import { Campaign } from '../../campaign/models'
import { Enum } from '../../../../constants'
import { InfluencerProfile } from '../../influencer/models'
import { IInfluencerProfile } from '../../influencer/interface'
import { AgencyProfile } from '../../agency/models'
import { IAgencyProfile } from '../../agency/interface'
import { ICreditNote, IProformaInvoice } from '../interface/IModels'

@Entity()
export class SaleInvoice implements ISaleInvoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Campaign, (campaign) => campaign.saleInvoices, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  campaign!: ICampaign

  @Column({ nullable: false, type: 'varchar' })
  gstTin!: string

  @Column({ nullable: false, type: 'varchar' })
  invoiceNo!: string

  @Column({ nullable: false, type: 'date' })
  invoiceDate!: Date

  @Column({ nullable: false, type: 'decimal' })
  amount!: number

  @Column({ nullable: false, type: 'decimal' })
  sgst!: number

  @Column({ nullable: false, type: 'decimal' })
  cgst!: number

  @Column({ nullable: false, type: 'decimal' })
  igst!: number

  @Column({ nullable: false, type: 'decimal' })
  total!: number

  @Column({ nullable: false, type: 'decimal' })
  tds!: number

  @Column({ nullable: false, type: 'decimal' })
  received!: number

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balanceAmount!: number

  @Column({ nullable: false, type: 'varchar' })
  month!: string

  @Column('enum', { enum: Enum.InvoiceStatus })
  paymentStatus!: Enum.InvoiceStatus

  @OneToMany(() => CreditNote, (creditNote) => creditNote.invoice, {
    cascade: true,
  })
  creditNotes!: ICreditNote[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class PurchaseInvoice implements IPurchaseInvoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Campaign, (campaign) => campaign.purchaseInvoices, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  campaign!: ICampaign

  @Column({ nullable: false })
  invoiceNo: string

  @Column({ nullable: true })
  pan: string

  @Column({ nullable: false, type: 'decimal' })
  amount: number

  @Column({ nullable: false, type: 'decimal' })
  igst: number

  @Column({ nullable: false, type: 'decimal' })
  cgst: number

  @Column({ nullable: false, type: 'decimal' })
  sgst: number

  @Column({ nullable: false, type: 'decimal' })
  totalAmount: number

  @Column({ nullable: false, type: 'decimal' })
  tds: number

  @Column({ nullable: true, type: 'decimal', default: null })
  tdsPercentage: number

  @Column({ nullable: true, type: 'varchar', default: null })
  tdsSection: string

  @Column({ nullable: false, type: 'decimal' })
  finalAmount: number

  @Column({ nullable: false, type: 'decimal' })
  amountToBeReceived: number

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balanceAmount: number

  @Column({ type: 'enum', enum: Enum.PaymentTerms, nullable: false })
  paymentTerms: Enum.PaymentTerms

  @Column('enum', { enum: Enum.InvoiceStatus })
  paymentStatus!: Enum.InvoiceStatus

  @Column({ nullable: true, type: 'varchar', default: null })
  file!: string | null

  @ManyToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.purchaseInvoices,
    { nullable: true, eager: true, onDelete: 'CASCADE' }
  )
  influencerProfile?: IInfluencerProfile | null

  @ManyToOne(
    () => AgencyProfile,
    (agencyProfile) => agencyProfile.purchaseInvoices,
    { nullable: true, eager: true, onDelete: 'CASCADE' }
  )
  agencyProfile?: IAgencyProfile | null

  @Column({ nullable: false, type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  invoiceDate!: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class ProformaInvoice implements IProformaInvoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Campaign, (campaign) => campaign.proformaInvoices, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  campaign!: ICampaign

  @Column({ nullable: false, type: 'varchar' })
  gstTin!: string

  @Column({ nullable: false, type: 'varchar' })
  invoiceNo!: string

  @Column({ nullable: false, type: 'varchar' })
  billNo!: string

  @Column({ nullable: false, type: 'date' })
  billDate!: Date

  @Column({ nullable: false, type: 'decimal' })
  amount!: number

  @Column({ nullable: false, type: 'decimal' })
  sgst!: number

  @Column({ nullable: false, type: 'decimal' })
  cgst!: number

  @Column({ nullable: false, type: 'decimal' })
  igst!: number

  @Column({ nullable: false, type: 'decimal' })
  total!: number

  @Column({ nullable: false, type: 'decimal' })
  tds!: number

  @Column({ nullable: false, type: 'decimal' })
  received!: number

  @Column({ nullable: false, type: 'decimal' })
  balanceAmount!: number

  @Column({ nullable: false, type: 'varchar' })
  month!: string

  @Column({ nullable: false, type: 'date' })
  invoiceDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class CreditNote implements ICreditNote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => SaleInvoice, (invoice) => invoice.creditNotes, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  invoice: ISaleInvoice

  @Column({ nullable: false, type: 'varchar' })
  gstTin: string

  @Column({ nullable: false, type: 'varchar' })
  creditNoteNo: string

  @Column({ nullable: false, type: 'date' })
  creditNoteDate: Date

  @Column({ nullable: false, type: 'decimal' })
  amount: number

  @Column({ nullable: false, type: 'decimal' })
  sgst: number

  @Column({ nullable: false, type: 'decimal' })
  cgst: number

  @Column({ nullable: false, type: 'decimal' })
  igst: number

  @Column({ nullable: false, type: 'decimal' })
  total: number

  @Column({ nullable: false, type: 'decimal' })
  tds: number

  @Column({ nullable: false, type: 'decimal' })
  advance: number

  @Column({ nullable: true, type: 'varchar', default: null })
  remarks: string

  @Column({ nullable: false, type: 'varchar' })
  month: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
