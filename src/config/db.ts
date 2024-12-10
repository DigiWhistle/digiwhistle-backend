import { DataSource } from 'typeorm'
import { Verification } from '../v1/modules/auth/models'
import { ContactUsForm, ContactUsConfig } from '../v1/modules/landing/models'
import { BrandProfile } from '../v1/modules/brands/models'
import {
  AdminProfile,
  EmployeeProfile,
  Remarks,
} from '../v1/modules/admin/models'
import {
  InfluencerProfile,
  YoutubeProfileStats,
  TwitterProfileStats,
  InstagramProfileStats,
  LinkedInProfileStats,
} from '../v1/modules/influencer/models'
import { User, Role } from '../v1/modules/user/models'
import {
  CampaignDeliverables,
  Campaign,
  CampaignParticipants,
} from '../v1/modules/campaign/models'
import { Payroll, PayrollHistory } from '../v1/modules/payroll/models'
import {
  SaleInvoice,
  PurchaseInvoice,
  CreditNote,
  ProformaInvoice,
} from '../v1/modules/invoice/models'
import { AgencyProfile, SearchCredits } from '../v1/modules/agency/models'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [
    User,
    ContactUsForm,
    Role,
    BrandProfile,
    EmployeeProfile,
    AdminProfile,
    AgencyProfile,
    InfluencerProfile,
    Verification,
    Remarks,
    YoutubeProfileStats,
    InstagramProfileStats,
    TwitterProfileStats,
    Campaign,
    CampaignParticipants,
    CampaignDeliverables,
    Payroll,
    PayrollHistory,
    SaleInvoice,
    PurchaseInvoice,
    ProformaInvoice,
    CreditNote,
    SearchCredits,
    ContactUsConfig,
    LinkedInProfileStats,
  ],
  ssl: { rejectUnauthorized: false },
})
