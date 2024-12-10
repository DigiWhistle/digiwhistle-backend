import { IRemarks } from '../modules/admin/interface'

export class RemarksDTO {
  static transformationForRemarksByUserId(data: IRemarks[]) {
    const _data = data.map((item) => {
      const profile =
        item.remarker.adminProfile === null
          ? item.remarker.employeeProfile
          : item.remarker.adminProfile
      if (profile === undefined || profile === null) return
      return {
        id: item.id,
        name: profile.firstName + ' ' + profile.lastName,
        profilePic: profile.profilePic,
        message: item.message,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
    })
    const filteredData = _data.filter((item) => item !== undefined)
    return filteredData
  }
}
