import { Request, Response } from 'express'
import { BaseController, errorHandler, HttpException } from '../../utils'
import {
  ICampaign,
  ICampaignCRUD,
  ICampaignDeliverablesService,
  ICampaignParticipants,
  ICampaignParticipantsService,
  ICampaignService,
} from '../modules/campaign/interface'
import { responseHandler } from '../../utils/response-handler'
import { IUserService } from '../modules/user/interface'
import { DeepPartial } from 'typeorm'
import { IExtendedRequest } from '../interface'
import { Enum } from '../../constants'
import { ICampaignCardsRequest } from '../modules/campaign/types'
import { CampaignDTO } from '../dtos'

class CampaignController extends BaseController<
  ICampaign,
  ICampaignCRUD,
  ICampaignService
> {
  private readonly campaignParticipantsService: ICampaignParticipantsService
  private readonly campaignDeliverableService: ICampaignDeliverablesService
  private readonly userService: IUserService

  constructor(
    campaignService: ICampaignService,
    campaignParticipantsService: ICampaignParticipantsService,
    campaignDeliverableService: ICampaignDeliverablesService,
    userService: IUserService
  ) {
    super(campaignService)
    this.campaignParticipantsService = campaignParticipantsService
    this.campaignDeliverableService = campaignDeliverableService
    this.userService = userService
  }

  async addController(req: Request, res: Response): Promise<Response> {
    try {
      const { participants, ...data } = req.body

      const campaign = await this.service.add(data)

      const campaignParticipants: DeepPartial<ICampaignParticipants>[] = []

      participants.forEach(
        (participant: {
          profileId: string
          email: string
          roleId: number
          id: string
        }) => {
          if (participant.roleId === 4) {
            campaignParticipants.push({
              id: participant.id,
              email: participant.email,
              influencerProfile: {
                id: participant.profileId,
              },
              commercialBrand: campaign.commercial,
              campaign: {
                id: campaign.id,
              },
            })
          } else if (participant.roleId === 5) {
            campaignParticipants.push({
              id: participant.id,
              email: participant.email,
              agencyProfile: {
                id: participant.profileId,
              },
              commercialBrand: campaign.commercial,
              campaign: {
                id: campaign.id,
              },
            })
          }
        }
      )

      await this.campaignParticipantsService
        .insertMany(campaignParticipants)
        .catch(async (err) => {
          await this.service.delete({ id: campaign.id })
          throw new HttpException(500, err.message)
        })

      return responseHandler(
        201,
        res,
        'Campaign created successfully',
        campaign,
        req
      )
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async updateController(req: Request, res: Response): Promise<Response> {
    try {
      const { participants, ...data } = req.body
      const campaignId = req.params?.id

      if (typeof campaignId !== 'string') {
        throw new HttpException(400, 'Invalid campaign id')
      }

      const campaign = await this.service.update({ id: campaignId }, data)

      const campaignParticipants: DeepPartial<ICampaignParticipants>[] = []

      participants.forEach(
        (participant: {
          profileId: string
          email: string
          roleId: number
          id: string
        }) => {
          if (participant.roleId === 4) {
            campaignParticipants.push({
              id: participant.id,
              email: participant.email,
              influencerProfile: {
                id: participant.profileId,
              },
              commercialBrand: campaign.commercial,
              campaign: {
                id: campaignId,
              },
            })
          } else if (participant.roleId === 5) {
            campaignParticipants.push({
              id: participant.id,
              email: participant.email,
              agencyProfile: {
                id: participant.profileId,
              },
              commercialBrand: campaign.commercial,
              campaign: {
                id: campaignId,
              },
            })
          }
        }
      )

      await this.campaignParticipantsService.insertMany(campaignParticipants)

      return responseHandler(200, res, 'Updated Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { page, limit } = req.query

      if (typeof page !== 'string' || typeof limit !== 'string')
        throw new HttpException(400, 'Invalid Page Details')

      const roleId = req.user.role.id

      const { startTime, endTime } = req.query

      if (typeof startTime !== 'string' || typeof endTime !== 'string') {
        throw new HttpException(400, 'Invalid Date format')
      }

      const lowerBound = new Date(startTime)
      const upperBound = new Date(endTime)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startTime
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endTime)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      const { name } = req.query

      if (roleId === Enum.ROLES.ADMIN || roleId === Enum.ROLES.EMPLOYEE) {
        const { payment, type } = req.query

        const data = await this.service.getAllCampaigns(
          parseInt(page),
          parseInt(limit),
          roleId,
          lowerBound,
          upperBound,
          name as string,
          undefined,
          {
            influencerType: type as string,
            paymentStatus: payment as Enum.CampaignPaymentStatus,
          }
        )

        const _data = data.data.map((value) => {
          return CampaignDTO.transformationForAdminAndEmployee(value)
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          },
          req
        )
      } else if (roleId === Enum.ROLES.AGENCY) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'agencyProfile',
        ])
        const agencyProfileId = user?.agencyProfile?.id
        if (agencyProfileId === undefined)
          throw new HttpException(404, 'Agency Not Found')

        const { name, payment, platform, campaignStatus } = req.query

        const data = await this.service.getAllCampaigns(
          parseInt(page),
          parseInt(limit),
          roleId,
          lowerBound,
          upperBound,
          name as string,
          {
            id: agencyProfileId,
            paymentStatus: payment as Enum.CampaignPaymentStatus,
            platform: platform as Enum.Platform,
            campaignStatus: campaignStatus as Enum.CampaignDeliverableStatus,
          }
        )

        const _data = data.data.map((value) => {
          return CampaignDTO.transformationForAgency(value, agencyProfileId)
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          },
          req
        )
      } else if (roleId === Enum.ROLES.BRAND) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'brandProfile',
        ])
        const brandProfileId = user?.brandProfile?.id

        if (brandProfileId === undefined)
          throw new HttpException(404, 'Brand Not Found')

        const { name, payment, platform, campaignStatus } = req.query

        const data = await this.service.getAllCampaigns(
          parseInt(page),
          parseInt(limit),
          roleId,
          lowerBound,
          upperBound,
          name as string,
          undefined,
          undefined,
          {
            paymentStatus: payment as Enum.CampaignPaymentStatus,
            campaignStatus: campaignStatus as Enum.CampaignDeliverableStatus,
            platform: platform as Enum.Platform,
            brand: brandProfileId,
          }
        )

        const _data = data.data.map((value) => {
          return CampaignDTO.transformationForBrands(value)
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          },
          req
        )
      } else if (roleId === Enum.ROLES.INFLUENCER) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'influencerProfile',
        ])
        const influencerProfileId = user?.influencerProfile?.id

        if (influencerProfileId === undefined)
          throw new HttpException(404, 'Influencer Not Found')

        const { payment, platform } = req.query

        const data = await this.service.getAllCampaigns(
          parseInt(page),
          parseInt(limit),
          roleId,
          lowerBound,
          upperBound,
          name as string,
          undefined,
          undefined,
          undefined,
          {
            id: influencerProfileId,
            paymentStatus: payment as Enum.CampaignPaymentStatus,
            platform: platform as Enum.Platform,
          }
        )

        const _data = data.data.map((value) => {
          return CampaignDTO.transformationForInfluencer(
            value,
            influencerProfileId
          )
        })

        return responseHandler(
          200,
          res,
          'Fetched Successfully',
          {
            data: _data,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
          },
          req
        )
      }

      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getAllStatsController(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const roleId = req.user.role.id
      const { startTime, endTime } = req.query

      if (typeof startTime !== 'string' || typeof endTime !== 'string') {
        throw new HttpException(400, 'Invalid Date format')
      }

      const lowerBound = new Date(startTime)
      const upperBound = new Date(endTime)

      if (
        !(
          lowerBound instanceof Date && lowerBound.toISOString() === startTime
        ) ||
        !(upperBound instanceof Date && upperBound.toISOString() === endTime)
      ) {
        throw new HttpException(400, 'Invalid Date')
      }

      if (roleId === Enum.ROLES.ADMIN || roleId === Enum.ROLES.EMPLOYEE) {
        const data = await this.service.getTotalCampaignsAndRevenue(
          lowerBound,
          upperBound
        )
        const _data = CampaignDTO.transformationForCampaignStats(data, roleId)

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      } else if (roleId === Enum.ROLES.BRAND) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'brandProfile',
        ])
        const brandProfileId = user?.brandProfile?.id

        const data = await this.service.getTotalCampaignsAndRevenue(
          lowerBound,
          upperBound,
          brandProfileId
        )
        const _data = CampaignDTO.transformationForCampaignStats(data, roleId)

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      } else if (roleId === Enum.ROLES.AGENCY) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'agencyProfile',
        ])
        const agencyProfileId = user?.agencyProfile?.id

        const data = await this.service.getTotalCampaignsAndRevenue(
          lowerBound,
          upperBound,
          undefined,
          agencyProfileId
        )

        const _data = CampaignDTO.transformationForCampaignStats(data, roleId)

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      } else if (roleId === Enum.ROLES.INFLUENCER) {
        const user = await this.userService.findOne({ id: req.user.id }, [
          'influencerProfile',
        ])
        const influencerProfileId = user?.influencerProfile?.id

        if (influencerProfileId === undefined)
          throw new HttpException(404, 'Influencer Not Found')

        const data = await this.service.getTotalCampaignsAndRevenue(
          lowerBound,
          upperBound,
          undefined,
          undefined,
          influencerProfileId
        )

        const _data = CampaignDTO.transformationForCampaignStats(data, roleId)

        return responseHandler(200, res, 'Fetched Successfully', _data, req)
      }
      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      throw new HttpException(e?.errorCode, e?.message)
    }
  }

  async updateCardsController(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as ICampaignCardsRequest
      const { participants, deliverables } =
        CampaignDTO.transformationForParticipantsAndDeliverablesFromCampaigns(
          data
        )

      await Promise.all([
        this.campaignParticipantsService.updateMany(participants),
        this.campaignDeliverableService.insertMany(deliverables),
      ])

      return responseHandler(200, res, 'Updated Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async getByIdController(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const data = await this.service.findOne({ id: id }, [
        'participants',
        'participants.influencerProfile',
        'participants.agencyProfile',
        'manager',
        'incentiveWinner',
        'brand',
      ])

      if (data === null) throw new HttpException(404, 'Campaign Not Found')

      const _data = CampaignDTO.transformationForCampaignData(data)

      return responseHandler(200, res, 'Fetched Successfully', _data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async searchCampaign(
    req: IExtendedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { code, type } = req.query

      if (
        typeof code === 'string' &&
        typeof type === 'string' &&
        type === 'invoice'
      ) {
        const campaign = await this.service.findOne({ code: code }, [
          'brand',
          'participants',
          'participants.influencerProfile',
          'participants.agencyProfile',
        ])

        if (campaign === null)
          throw new HttpException(404, 'Campaign Not Found')

        const data =
          CampaignDTO.transformationForCampaignSearchByCodeForInvoice(
            campaign,
            req.user.id
          )

        return responseHandler(200, res, 'Fetched Successfully', data, req)
      } else if (typeof code === 'string') {
        const campaign = await this.service.findOne({ code: code }, ['brand'])

        if (campaign === null)
          throw new HttpException(404, 'Campaign Not Found')

        const data = CampaignDTO.transformationForCampaignSearchByCode(campaign)

        return responseHandler(200, res, 'Fetched Successfully', data, req)
      }

      return responseHandler(200, res, 'Fetched Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async releaseIncentive(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.query

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      const data = await this.service.releaseIncentive(id)
      return responseHandler(200, res, 'Released Successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async generateBrandReport(req: Request, res: Response): Promise<Response> {
    try {
      const { id, campaignId } = req.query

      const data = await this.service.generateBrandReport(
        id as string,
        campaignId as string
      )
      return responseHandler(200, res, 'Generated Successfully', data, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }

  async sendConfirmationEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.body

      if (typeof id !== 'string') throw new HttpException(400, 'Invalid Id')

      await this.service.sendConfirmationMail(id)

      return responseHandler(200, res, 'Sent Successfully', {}, req)
    } catch (e) {
      return errorHandler(e, res, req)
    }
  }
}

export { CampaignController }
