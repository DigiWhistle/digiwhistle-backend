import { Enum } from '../../constants'

export const checkSocialMediaLink = (link: string): string => {
  const instagramPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/|youtu\.be\/).+/i
  const twitterPattern = /^(https?:\/\/)?(www\.)?twitter\.com\/.+/i

  if (instagramPattern.test(link)) {
    return Enum.Platform.INSTAGRAM
  } else if (youtubePattern.test(link)) {
    return Enum.Platform.YOUTUBE
  } else if (twitterPattern.test(link)) {
    return Enum.Platform.X
  } else {
    return 'Invalid or unsupported link'
  }
}
