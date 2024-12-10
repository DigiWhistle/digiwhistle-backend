import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { IVerification } from '../interface'
import 'reflect-metadata'

@Entity()
export class Verification extends BaseEntity implements IVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false, type: 'varchar' })
  mobileNo: string

  @Column({ nullable: false, type: 'varchar' })
  otp: string

  @Column({ nullable: false, type: 'varchar' })
  expireIn: number
}
