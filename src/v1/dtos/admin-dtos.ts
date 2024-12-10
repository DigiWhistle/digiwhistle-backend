import { IAdminProfile, IEmployeeProfile } from '../modules/admin/interface'
import { IUser } from '../modules/user/interface'
import { userStats } from '../modules/user/types'

export class AdminDTO {
  static transformationForAdminAndEmployee(data: IUser) {
    const profile: IEmployeeProfile | IAdminProfile =
      data[`${data.role.name}Profile`]

    return {
      userId: data.id,
      email: data.email,
      mobileNo: profile.mobileNo,
      designation: data.role.name === 'admin' ? 'admin' : profile.designation,
      isPaused: data.isPaused,
      isApproved: data.isApproved,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePic: profile.profilePic,
      profileId: profile.id,
      role: data.role.name,
    }
  }

  static transformationForUserStats(data: userStats) {
    return [
      {
        label: 'Accepted Requests',
        value: typeof data.approved === 'string' ? parseInt(data.approved) : 0,
        subValue: '',
        iconName: 'FaceSmileIcon',
      },
      {
        label: 'Pending Requests',
        value: typeof data.pending === 'string' ? parseInt(data.pending) : 0,
        subValue: '',
        iconName: 'ExclamationCircleIcon',
      },
      {
        label: 'Declined Requests',
        value: typeof data.rejected === 'string' ? parseInt(data.rejected) : 0,
        subValue: '',
        iconName: 'FaceFrownIcon',
      },
    ]
  }
}
