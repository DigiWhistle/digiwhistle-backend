import { DeepPartial } from 'typeorm'
import { IContactUsConfig } from '../modules/landing/interface'

export class ContactUsConfigDTO {
  static transformationForAllConfig(data: IContactUsConfig[]) {
    const mp = new Map<string, any>()

    data.forEach((element: IContactUsConfig) => {
      const value = mp.get(element.followersCount)

      if (value === undefined) {
        mp.set(element.followersCount, [
          {
            id: element.employee.id,
            email: element.employee.user.email,
          },
        ])
      } else {
        mp.set(element.followersCount, [
          ...value,
          {
            id: element.employee.id,
            email: element.employee.user.email,
          },
        ])
      }
    })

    const _data: any = []

    for (const [key, value] of mp) {
      _data.push({
        followersCount: key,
        employees: value,
      })
    }

    return _data
  }

  static transformationForAddConfig(
    data: Array<{
      followersCount: string
      employees: Array<{
        email: string
        id: string
      }>
    }>
  ): DeepPartial<IContactUsConfig[]> {
    const _data: DeepPartial<IContactUsConfig>[] = []

    data.forEach((element) => {
      element.employees.forEach((value) => {
        _data.push({
          followersCount: element.followersCount,
          employee: {
            id: value.id,
          },
        })
      })
    })

    return _data
  }
}
