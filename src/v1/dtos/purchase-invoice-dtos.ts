import moment from 'moment'
import { Enum } from '../../constants'
import { IPurchaseInvoice } from '../modules/invoice/interface'

export class PurchaseInvoiceDTO {
  static generateInvoiceDueDate(
    paymentTerms: Enum.PaymentTerms,
    invoiceDate: Date
  ) {
    switch (paymentTerms) {
      case Enum.PaymentTerms.DAYS_0:
        return moment(invoiceDate).add(0, 'days')
      case Enum.PaymentTerms.DAYS_30:
        return moment(invoiceDate).add(30, 'days')
      case Enum.PaymentTerms.DAYS_60:
        return moment(invoiceDate).add(60, 'days')
    }
  }

  static transformationForInfluencerAndAgency(data: IPurchaseInvoice) {
    return {
      id: data.id,
      invoiceNo: data.invoiceNo,
      campaignCode: data.campaign.code,
      campaignDuration: data.campaign.startDate + ' - ' + data.campaign.endDate,
      campaignName: data.campaign.name,
      brand: data.campaign.brand?.name,
      invoiceDate: data.invoiceDate,
      finalAmount: data.amount,
      totalAmount: data.amount,
      igst: data.igst,
      cgst: data.cgst,
      sgst: data.sgst,
      totalInvoiceAmount: data.totalAmount,
      tds: data.tds,
      amount: data.finalAmount,
      amountToBeReceived: data.amountToBeReceived,
      balanceAmount: data.balanceAmount,
      PaymentStatus: data.paymentStatus,
      paymentTerms: data.paymentTerms,
      panNo:
        data.influencerProfile === null
          ? data.agencyProfile?.panNo
          : data.influencerProfile?.panNo,
      file: data.file,
      dueDate: this.generateInvoiceDueDate(
        data.paymentTerms,
        data.invoiceDate
      ).toDate(),
      isDueDateNear:
        moment().diff(
          this.generateInvoiceDueDate(data.paymentTerms, data.invoiceDate),
          'days'
        ) <= 7,
      isDueDateMissed: this.generateInvoiceDueDate(
        data.paymentTerms,
        data.invoiceDate
      ).isBefore(new Date()),
    }
  }

  static transformationForAdmin(data: IPurchaseInvoice) {
    return {
      id: data.id,
      invoiceNo: data.invoiceNo,
      campaignCode: data.campaign.code,
      campaignDuration: data.campaign.startDate + ' - ' + data.campaign.endDate,
      campaignName: data.campaign.name,
      brand: data.campaign.brand?.name,
      invoiceDate: new Date(data.invoiceDate).toDateString(),
      finalAmount: data.amount,
      totalAmount: data.amount,
      igst: data.igst,
      cgst: data.cgst,
      sgst: data.sgst,
      totalInvoiceAmount: data.totalAmount,
      tds: data.tds,
      tdsPercentage: data.tdsPercentage,
      tdsSection: data.tdsSection,
      amount: data.finalAmount,
      amountToBeReceived: data.amountToBeReceived,
      balanceAmount: data.balanceAmount,
      PaymentStatus: data.paymentStatus,
      paymentTerms: data.paymentTerms,
      category:
        data.influencerProfile === null ? 'Agency Fee' : 'Influencer Fee',
      participantName: data.influencerProfile
        ? data.influencerProfile.firstName +
          (data.influencerProfile.lastName === null
            ? ''
            : ' ' + data.influencerProfile.lastName)
        : data.agencyProfile?.name,
      panNo:
        data.influencerProfile === null
          ? data.agencyProfile?.panNo
          : data.influencerProfile?.panNo,
      file: data.file,
      dueDate: this.generateInvoiceDueDate(
        data.paymentTerms,
        data.invoiceDate
      ).toDate(),
      isDueDateNear:
        moment().diff(
          this.generateInvoiceDueDate(data.paymentTerms, data.invoiceDate),
          'days'
        ) <= 7,
      isDueDateMissed: this.generateInvoiceDueDate(
        data.paymentTerms,
        data.invoiceDate
      ).isBefore(new Date()),
    }
  }
}
