import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { IUser } from '../../user/interface'
import { IAdminProfile, IRemarks } from '../interface'
import { User } from '../../user/models'
import { IEmployeeProfile } from '../../admin/interface'
import { Campaign } from '../../campaign/models'
import { ICampaign } from '../../campaign/interface'
import { Payroll, PayrollHistory } from '../../payroll/models'
import { IPayroll, IPayrollHistory } from '../../payroll/interface'
import { ContactUsConfig } from '../../landing/models'
import { IContactUsConfig } from '../../landing/interface'

@Entity()
export class AdminProfile implements IAdminProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  mobileNo: string

  @Column({ type: 'varchar', default: null, nullable: true })
  profilePic: string

  @OneToOne(() => User, (user) => user.adminProfile, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: IUser

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class EmployeeProfile implements IEmployeeProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  mobileNo: string

  @Column({ type: 'varchar', default: null, nullable: true })
  profilePic: string

  @Column({ type: 'varchar', nullable: false })
  designation: string

  @OneToOne(() => User, (user) => user.employeeProfile, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: IUser

  @Column({ type: 'varchar', default: null, nullable: true })
  aadharNo: string

  @Column({ type: 'varchar', default: null, nullable: true })
  panNo: string

  @Column({ type: 'varchar', default: null, nullable: true })
  bankName: string

  @Column({ type: 'varchar', default: null, nullable: true })
  bankAccountNumber: string

  @Column({ type: 'varchar', default: null, nullable: true })
  bankIfscCode: string

  @Column({ type: 'varchar', default: null, nullable: true })
  bankAccountHolderName: string

  @OneToMany(() => Campaign, (campaign) => campaign.manager)
  campaignManager: ICampaign[]

  @OneToMany(() => Campaign, (campaign) => campaign.incentiveWinner)
  campaignIncentives: ICampaign[]

  @OneToOne(() => Payroll, (payroll) => payroll.employeeProfile, {
    cascade: true,
  })
  payroll: IPayroll

  @OneToMany(
    () => PayrollHistory,
    (payrollHistory) => payrollHistory.employeeProfile,
    { cascade: true }
  )
  payrollHistory: IPayrollHistory[]

  @OneToMany(
    () => ContactUsConfig,
    (contactUsConfig) => contactUsConfig.employee
  )
  contactUsConfig: IContactUsConfig[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}

@Entity()
export class Remarks implements IRemarks {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', nullable: false })
  message: string

  @Column({ type: 'varchar', nullable: false })
  userId: string

  @ManyToOne(() => User, (user) => user.remarks, {
    eager: true,
    onDelete: 'CASCADE',
  })
  remarker: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
