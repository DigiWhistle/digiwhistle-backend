import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { IRole, IUser } from '../interface'
import { BrandProfile } from '../../brands/models'
import { IBrandProfile } from '../../brands/interface'
import { InfluencerProfile } from '../../influencer/models'
import { IInfluencerProfile } from '../../influencer/interface'
import { AdminProfile, EmployeeProfile, Remarks } from '../../admin/models'
import {
  IAdminProfile,
  IEmployeeProfile,
  IRemarks,
} from '../../admin/interface'
import { AgencyProfile } from '../../agency/models'
import { IAgencyProfile } from '../../agency/interface'

@Entity()
export class Role extends BaseEntity implements IRole {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', nullable: false })
  name: string

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ primary: true, type: 'varchar' })
  id: string

  @Column({ unique: true, type: 'varchar' })
  email: string

  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean

  @Column({ default: false, type: 'boolean' })
  isPaused: boolean

  @Column({ default: null, type: 'boolean' })
  isApproved: boolean

  @OneToOne(() => BrandProfile, (brandProfile) => brandProfile.user)
  brandProfile: IBrandProfile

  @OneToOne(() => AgencyProfile, (agencyProfile) => agencyProfile.user)
  agencyProfile: IAgencyProfile

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.user
  )
  influencerProfile: IInfluencerProfile

  @OneToOne(() => EmployeeProfile, (employeeProfile) => employeeProfile.user)
  employeeProfile: IEmployeeProfile

  @OneToOne(() => AdminProfile, (adminProfile) => adminProfile.user)
  adminProfile: IAdminProfile

  @OneToMany(() => Remarks, (remarks) => remarks.remarker)
  remarks: IRemarks[]
}
