import { userResponse } from '../modules/auth/types'
import { IUser } from '../modules/user/interface'
import { v4 as uuidv4 } from 'uuid'

export class UserDTO {
  static transformationForUserProfile(user: IUser) {
    const profile = user[`${user.role.name}Profile`]

    const _user: userResponse = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      isPaused: user.isPaused,
      profile: profile,
      isOnBoarded: true,
      role: user.role.name,
    }

    if (_user.role === 'brand' || _user.role === 'agency') {
      const _response = {
        ..._user,
        profile: {
          ...profile,
          firstName: _user.profile.pocFirstName,
          lastName: _user.profile.pocLastName,
        },
      }

      return _response
    }

    return _user
  }

  static transformationForInfluencerAndAgencyByEmailSearch(data: IUser[]) {
    const _data: any[] = []

    data.forEach((value) => {
      const profile =
        value.agencyProfile === null
          ? value.influencerProfile
          : value.agencyProfile

      const roleId = value.agencyProfile === null ? 4 : 5

      if (profile !== null && profile !== undefined) {
        _data.push({
          profileId: profile.id,
          email: value.email,
          profilePic: profile.profilePic,
          roleId: roleId,
          id: uuidv4(),
        })
      }
    })

    return _data
  }
}
