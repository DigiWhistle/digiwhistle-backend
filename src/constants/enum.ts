export enum RESPONSE_STATES {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum RESPONSE_CODES {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum ROLES {
  INFLUENCER = 4,
  BRAND = 3,
  AGENCY = 5,
  ADMIN = 1,
  EMPLOYEE = 2,
  ACCOUNTS = 6,
}

export enum PersonType {
  INFLUENCER = 'Influencer',
  BRAND = 'Brand',
}

export enum HideFrom {
  BRAND = 'brand',
  AGENCY = 'agency',
}

export enum CampaignStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

export enum CampaignDeliverableStatus {
  LIVE = 'Live',
  NOT_LIVE = 'Not Live',
}

export enum CampaignPaymentStatus {
  DONE = 'Done',
  ALL_PAID = 'All Paid',
  PENDING = 'Pending',
}

export enum CampaignInvoiceStatus {
  GENERATED = 'Generated',
  NOT_GENERATED = 'Not Generated',
}

export enum Platform {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  X = 'x',
  LINKEDIN = 'linkedin',
}

export enum InvoiceStatus {
  ALL_RECEIVED = 'All Received',
  PENDING = 'Pending',
}

export enum EmploymentType {
  FULL_TIME = 'Full Time',
  INTERNSHIP = 'Internship',
  NONE = 'None',
}

export enum PaymentStatus {
  ALL_PAID = 'All Paid',
  PENDING = 'Pending',
}

export enum PaymentTerms {
  DAYS_0 = '0 Days',
  DAYS_30 = '30 Days',
  DAYS_60 = '60 Days',
}

export enum WEBHOOK_EVENTS {
  REJECTED = 'payout.rejected',
  PROCESSED = 'payout.processed',
  REVERSED = 'payout.reversed',
  FAILED = 'payout.failed',
}

export enum INFLUENCER_PAYMENT_TERMS {
  ADVANCE = 'Advance',
  DAYS_30 = '30 Days',
  DAYS_60 = '60 Days',
}
