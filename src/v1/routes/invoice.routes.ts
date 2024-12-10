import { Router } from 'express'
import {
  SaleInvoiceController,
  PurchaseInvoiceController,
  ProformaInvoiceController,
  CreditNoteController,
} from '../controller'
import {
  creditNoteService,
  proformaInvoiceService,
  purchaseInvoiceService,
  saleInvoiceService,
} from '../modules/invoice'
import {
  addCreditNoteSchema,
  addProformaInvoiceSchema,
  addPurchaseInvoiceSchema,
  addSaleInvoiceSchema,
  shareInvoiceSchema,
  updateCreditNoteSchema,
  updateProformaInvoiceSchema,
  updatePurchaseInvoiceSchema,
  updateSaleInvoiceSchema,
} from '../modules/invoice/validators'
import { BaseValidator } from '../../utils'
import { authorizeUser, verifyToken } from '../middleware'
import { Enum } from '../../constants'
import { userService } from '../modules/user'
import { authorizeAccounts } from '../middleware/authorizeAccounts'

const invoiceRouter = Router()

const purchaseInvoiceController = new PurchaseInvoiceController(
  purchaseInvoiceService,
  userService
)

const saleInvoiceController = new SaleInvoiceController(saleInvoiceService)

const proformaInvoiceController = new ProformaInvoiceController(
  proformaInvoiceService
)

const creditNoteController = new CreditNoteController(creditNoteService)

const addSaleInvoiceValidator = new BaseValidator(addSaleInvoiceSchema)

const updateSaleInvoiceValidator = new BaseValidator(updateSaleInvoiceSchema)

const addPurchaseInvoiceValidator = new BaseValidator(addPurchaseInvoiceSchema)

const updatePurchaseInvoiceValidator = new BaseValidator(
  updatePurchaseInvoiceSchema
)

const addProformaInvoiceValidator = new BaseValidator(addProformaInvoiceSchema)
const updateProformaInvoiceValidator = new BaseValidator(
  updateProformaInvoiceSchema
)

const addCreditNoteValidator = new BaseValidator(addCreditNoteSchema)
const updateCreditNoteValidator = new BaseValidator(updateCreditNoteSchema)

const shareInvoiceValidator = new BaseValidator(shareInvoiceSchema)

invoiceRouter.post(
  '/sale',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  addSaleInvoiceValidator.validateInput.bind(addSaleInvoiceValidator),
  saleInvoiceController.addController.bind(saleInvoiceController)
)

invoiceRouter.get(
  '/sale/download',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  saleInvoiceController.downloadSaleInvoiceController.bind(
    saleInvoiceController
  )
)

invoiceRouter.get(
  '/sale/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  saleInvoiceController.getByIdController.bind(saleInvoiceController)
)

invoiceRouter.delete(
  '/sale/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  saleInvoiceController.deleteController.bind(saleInvoiceController)
)

invoiceRouter.patch(
  '/sale/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  updateSaleInvoiceValidator.validateInput.bind(updateSaleInvoiceValidator),
  saleInvoiceController.updateController.bind(saleInvoiceController)
)

invoiceRouter.get(
  '/sale',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  saleInvoiceController.getAllController.bind(saleInvoiceController)
)

invoiceRouter.post(
  '/sale/share',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  shareInvoiceValidator.validateInput.bind(shareInvoiceValidator),
  saleInvoiceController.shareInvoiceController.bind(saleInvoiceController)
)

invoiceRouter.post(
  '/sale/download',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  saleInvoiceController.downloadSaleInvoiceReportController.bind(
    saleInvoiceController
  )
)

invoiceRouter.post(
  '/purchase',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  addPurchaseInvoiceValidator.validateInput.bind(addPurchaseInvoiceValidator),
  purchaseInvoiceController.addController.bind(purchaseInvoiceController)
)

invoiceRouter.get(
  '/purchase/:id',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  purchaseInvoiceController.getByIdController.bind(purchaseInvoiceController)
)

invoiceRouter.delete(
  '/purchase/:id',
  verifyToken,
  authorizeUser([
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.ADMIN,
  ]),
  purchaseInvoiceController.deleteController.bind(purchaseInvoiceController)
)

invoiceRouter.patch(
  '/purchase/:id',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  updatePurchaseInvoiceValidator.validateInput.bind(
    updatePurchaseInvoiceValidator
  ),
  purchaseInvoiceController.updateController.bind(purchaseInvoiceController)
)

invoiceRouter.get(
  '/purchase',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  purchaseInvoiceController.getAllController.bind(purchaseInvoiceController)
)

invoiceRouter.post(
  '/purchase/share',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  shareInvoiceValidator.validateInput.bind(shareInvoiceValidator),
  purchaseInvoiceController.shareInvoiceController.bind(
    purchaseInvoiceController
  )
)

invoiceRouter.post(
  '/purchase/download',
  verifyToken,
  authorizeUser([
    Enum.ROLES.ADMIN,
    Enum.ROLES.EMPLOYEE,
    Enum.ROLES.INFLUENCER,
    Enum.ROLES.AGENCY,
  ]),
  purchaseInvoiceController.downloadPurchaseInvoiceReportController.bind(
    purchaseInvoiceController
  )
)

invoiceRouter.post(
  '/purchase/release',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  purchaseInvoiceController.releaseSalaryController.bind(
    purchaseInvoiceController
  )
)

invoiceRouter.post(
  '/proforma',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  addProformaInvoiceValidator.validateInput.bind(addProformaInvoiceValidator),
  proformaInvoiceController.addController.bind(proformaInvoiceController)
)

invoiceRouter.get(
  '/proforma',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  proformaInvoiceController.getAllController.bind(proformaInvoiceController)
)

invoiceRouter.get(
  '/proforma/download',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  proformaInvoiceController.downloadProformaInvoiceController.bind(
    proformaInvoiceController
  )
)

invoiceRouter.get(
  '/proforma/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  proformaInvoiceController.getByIdController.bind(proformaInvoiceController)
)

invoiceRouter.patch(
  '/proforma/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  updateProformaInvoiceValidator.validateInput.bind(
    updateProformaInvoiceValidator
  ),
  proformaInvoiceController.updateController.bind(proformaInvoiceController)
)

invoiceRouter.delete(
  '/proforma/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  proformaInvoiceController.deleteController.bind(proformaInvoiceController)
)

invoiceRouter.post(
  '/proforma/share',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  shareInvoiceValidator.validateInput.bind(shareInvoiceValidator),
  proformaInvoiceController.shareInvoiceController.bind(
    proformaInvoiceController
  )
)

invoiceRouter.post(
  '/creditnote',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  addCreditNoteValidator.validateInput.bind(addCreditNoteValidator),
  creditNoteController.addController.bind(creditNoteController)
)

invoiceRouter.get(
  '/creditnote/download',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  creditNoteController.downloadCreditNoteController.bind(creditNoteController)
)

invoiceRouter.get(
  '/creditnote/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  creditNoteController.getByIdController.bind(creditNoteController)
)

invoiceRouter.patch(
  '/creditnote/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  updateCreditNoteValidator.validateInput.bind(updateCreditNoteValidator),
  creditNoteController.updateController.bind(creditNoteController)
)

invoiceRouter.delete(
  '/creditnote/:id',
  verifyToken,
  authorizeUser([Enum.ROLES.ADMIN, Enum.ROLES.EMPLOYEE]),
  authorizeAccounts,
  creditNoteController.deleteController.bind(creditNoteController)
)

export default invoiceRouter
