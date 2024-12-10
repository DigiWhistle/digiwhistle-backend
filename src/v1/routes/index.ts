import authRouter from './auth.routes'
import contactUsRouter from './contactUs.routes'
import { Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from '../../config/docs'
import roleRouter from './role.routes'
import brandRouter from './brand.routes'
import influencerRouter from './influencer.routes'
import adminRouter from './admin.routes'
import employeeRouter from './employee.routes'
import agencyRouter from './agency.routes'
import userRouter from './user.routes'
import remarksRouter from './remarks.routes'
import campaignRouter from './campaign.routes'
import campaignParticipantRouter from './campaign-participants.routes'
import campaignDeliverableRouter from './campaign-deliverables.routes'
import invoiceRouter from './invoice.routes'
import payrollRouter from './payroll.routes'
import razorpayRouter from './razorpay.routes'
import agreementRouter from './agreement.routes'

const apiRouter = Router()

apiRouter.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
apiRouter.use('/auth', authRouter)
apiRouter.use('/contactUs', contactUsRouter)
apiRouter.use('/role', roleRouter)
apiRouter.use('/brand', brandRouter)
apiRouter.use('/influencer', influencerRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/employee', employeeRouter)
apiRouter.use('/agency', agencyRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/remarks', remarksRouter)
apiRouter.use('/campaign/participants', campaignParticipantRouter)
apiRouter.use('/campaign/deliverables', campaignDeliverableRouter)
apiRouter.use('/campaign', campaignRouter)
apiRouter.use('/invoice', invoiceRouter)
apiRouter.use('/payroll', payrollRouter)
apiRouter.use('/razorpay', razorpayRouter)
apiRouter.use('/agreement', agreementRouter)

export default apiRouter
