import { Enum } from '../../../constants'
import { HttpException } from '../../../utils'
import { IAgencyProfileService } from '../agency/interface'
import { IInfluencerProfileService } from '../influencer/interface'
import { IUser, IUserService } from '../user/interface'
import { IZohoSignService } from './zoho-sign-service'

export interface IAgreementService {
  sendAgreement(userId: string): Promise<void>
}

export class AgreementService implements IAgreementService {
  private readonly zohoSignService: IZohoSignService
  private readonly userService: IUserService
  private readonly influencerProfileService: IInfluencerProfileService
  private readonly agencyProfileService: IAgencyProfileService
  public static instance: IAgreementService

  static getInstance(
    userService: IUserService,
    influencerProfileService: IInfluencerProfileService,
    agencyProfileService: IAgencyProfileService,
    zohoSignService: IZohoSignService
  ) {
    if (AgreementService.instance === null)
      AgreementService.instance = new AgreementService(
        zohoSignService,
        userService,
        influencerProfileService,
        agencyProfileService
      )
    return AgreementService.instance
  }

  private constructor(
    zohoSignService: IZohoSignService,
    userService: IUserService,
    influencerProfileService: IInfluencerProfileService,
    agencyProfileService: IAgencyProfileService
  ) {
    this.zohoSignService = zohoSignService
    this.userService = userService
    this.influencerProfileService = influencerProfileService
    this.agencyProfileService = agencyProfileService
  }

  async sendAgreement(userId: string): Promise<void> {
    try {
      const user = await this.userService.findOne({ id: userId }, [
        'influencerProfile',
        'agencyProfile',
        'role',
      ])

      if (user === null) throw new HttpException(404, 'user not found')

      if (user.role.id === Enum.ROLES.AGENCY) {
        await this.shareAgencyAgreement(user)
      } else if (user.role.id === Enum.ROLES.INFLUENCER) {
        await this.shareInfluencerAgreement(user)
      }
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async shareAgencyAgreement(user: IUser): Promise<string> {
    try {
      if (user.agencyProfile === null || user?.agencyProfile === undefined)
        throw new HttpException(400, 'Agency Profile not found')

      const recipient_email = user.agencyProfile.email

      const templateId = '77631000000039001'

      const body = {
        templates: {
          field_data: {
            field_text_data: {},
            field_boolean_data: {},
            field_date_data: {},
          },
          actions: [
            {
              action_id: '77631000000039024',
              action_type: 'SIGN',
              recipient_name: 'Agency',
              role: 'Agency',
              recipient_email: recipient_email,
              recipient_phonenumber: '',
              recipient_countrycode: '',
              private_notes: '',
              verify_recipient: true,
              verification_type: 'EMAIL',
            },
            {
              action_id: '77631000000039022',
              action_type: 'SIGN',
              recipient_name: 'Admin',
              role: 'Admin',
              recipient_email: 'digiwhistledev@gmail.com',
              recipient_phonenumber: '',
              recipient_countrycode: '',
              private_notes: '',
              verify_recipient: true,
              verification_type: 'EMAIL',
            },
          ],
          notes: '',
        },
      }

      const payload = new FormData()
      payload.append('data', JSON.stringify(body))
      payload.append('is_quicksend', 'true')

      const documentId = await this.zohoSignService.sendTemplateForSigning(
        templateId,
        payload
      )

      await this.agencyProfileService.update(
        { id: user.agencyProfile.id },
        { agreement: documentId }
      )

      return documentId
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  private async shareInfluencerAgreement(user: IUser): Promise<string> {
    try {
      if (
        user.influencerProfile === null ||
        user?.influencerProfile === undefined
      )
        throw new HttpException(400, 'Influencer Profile not found')

      const recipient_email = user.influencerProfile.email

      const templateId = '77631000000035315'

      const body = {
        templates: {
          field_data: {
            field_text_data: {},
            field_boolean_data: {},
            field_date_data: {},
          },
          actions: [
            {
              action_id: '77631000000035336',
              action_type: 'SIGN',
              recipient_name: 'Influencer',
              role: 'Influencer',
              recipient_email: recipient_email,
              recipient_phonenumber: '',
              recipient_countrycode: '',
              private_notes: '',
              verify_recipient: true,
              verification_type: 'EMAIL',
            },
            {
              action_id: '77631000000035338',
              action_type: 'SIGN',
              recipient_name: 'Admin',
              role: 'Admin',
              recipient_email: 'digiwhistledev@gmail.com',
              recipient_phonenumber: '',
              recipient_countrycode: '',
              private_notes: '',
              verify_recipient: true,
              verification_type: 'EMAIL',
            },
          ],
          notes: '',
        },
      }

      const payload = new FormData()
      payload.append('data', JSON.stringify(body))
      payload.append('is_quicksend', 'true')

      const documentId = await this.zohoSignService.sendTemplateForSigning(
        templateId,
        payload
      )

      await this.influencerProfileService.update(
        {
          id: user.influencerProfile.id,
        },
        {
          agreement: documentId,
        }
      )

      return documentId
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }
}
