import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Enum } from '../../../../constants'
import { IContactUsForm, IContactUsConfig } from '../interface'
import { IEmployeeProfile } from '../../admin/interface'
import { EmployeeProfile } from '../../admin/models'

@Entity()
export class ContactUsForm implements IContactUsForm {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, type: 'varchar' })
  name: string

  @Column({ nullable: false, type: 'varchar' })
  email: string

  @Column({ nullable: true, type: 'varchar' })
  followersCount: string

  @Column({ nullable: true, type: 'varchar' })
  profileLink: string

  @Column({ nullable: true, type: 'varchar' })
  mobileNo: string

  @Column({ nullable: true, type: 'text' })
  message: string

  @Column({
    type: 'enum',
    enum: Enum.PersonType,
    nullable: false,
  })
  personType: Enum.PersonType

  @Column({ type: 'boolean', default: false })
  viewed: boolean
}

@Entity()
export class ContactUsConfig implements IContactUsConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar' })
  followersCount: string

  @ManyToOne(() => EmployeeProfile, (employee) => employee.id)
  employee: IEmployeeProfile

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
