import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Enum } from '../../../../constants'
import { IEmployeeProfile } from '../../admin/interface'
import { EmployeeProfile } from '../../admin/models'
import { IPayroll, IPayrollHistory } from '../interface'

@Entity()
export class Payroll implements IPayroll {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => EmployeeProfile, (employee) => employee.payroll, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employeeProfile: IEmployeeProfile

  @Column({ nullable: false, default: 0 })
  basic: number

  @Column({ nullable: false, default: 0 })
  hra: number

  @Column({ nullable: false, default: 0 })
  others: number

  @Column({ nullable: false, default: 0 })
  ctc: number

  @Column({ nullable: true, type: 'varchar', default: null })
  fundAccountId: string | null

  @Column({
    type: 'enum',
    enum: Enum.EmploymentType,
    nullable: false,
    default: Enum.EmploymentType.NONE,
  })
  employmentType: Enum.EmploymentType

  @Column({ nullable: false, default: 2 })
  tds: number

  @Column({ nullable: false, default: 0 })
  incentive: number

  @Column({ nullable: false, default: 0 })
  salaryMonth: number

  @Column({ nullable: false, default: 0 })
  workingDays: number

  @Column({ nullable: false, default: new Date(), type: 'date' })
  payrollDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class PayrollHistory implements IPayrollHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => EmployeeProfile, (employee) => employee.payrollHistory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employeeProfile: IEmployeeProfile

  @Column({ nullable: false, default: 0 })
  ctc: number

  @Column({ nullable: false, default: 0 })
  basic: number

  @Column({ nullable: false, default: 0 })
  hra: number

  @Column({ nullable: false, default: 0 })
  others: number

  @Column({ nullable: false })
  workingDays: string

  @Column({ nullable: false })
  salaryMonth: string

  @Column({ nullable: false, default: 0 })
  incentive: number

  @Column({ nullable: false, default: 0 })
  grossPay: number

  @Column({ nullable: false, default: 0 })
  finalPay: number

  @Column({ nullable: false, default: 0 })
  tds: number

  @Column({
    type: 'enum',
    enum: Enum.PaymentStatus,
    nullable: false,
    default: Enum.PaymentStatus.PENDING,
  })
  status: Enum.PaymentStatus

  @Column({ nullable: false })
  paymentDate: Date

  @Column({ nullable: false, type: 'enum', enum: Enum.EmploymentType })
  employmentType: Enum.EmploymentType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
