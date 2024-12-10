import {
  InfluencerProfile,
  InstagramProfileStats,
  LinkedInProfileStats,
  TwitterProfileStats,
  YoutubeProfileStats,
} from './models'
import {
  InfluencerProfileCRUD,
  InfluencerCRUD,
  InstagramProfileStatsCRUD,
  YoutubeProfileStatsCRUD,
  TwitterProfileStatsCRUD,
  LinkedInProfileStatsCRUD,
} from './crud'
import {
  InfluencerProfileService,
  InfluencerService,
  InfluencerStatsService,
  InstagramProfileStatsService,
  InstagramService,
  TwitterProfileStatsService,
  TwitterService,
  YoutubeProfileStatsService,
  YoutubeService,
} from './services'
import { AxiosService, MailerService } from '../../utils'
import { googleAuthService } from '../auth'
import { searchCreditsService } from '../agency'
import { LinkedInProfileStatsService } from './services/linkedIn-profile-service'
import { LinkedInService } from './services/linkedIn-service'
import { ZohoSignService } from '../utils/zoho-sign-service'

const influencerProfileService = InfluencerProfileService.getInstance(
  InfluencerProfileCRUD.getInstance(InfluencerProfile),
  ZohoSignService.getInstance(AxiosService.getInstance())
)

const influencerStatsService = InfluencerStatsService.getInstance(
  InstagramService.getInstance(AxiosService.getInstance()),
  YoutubeService.getInstance(AxiosService.getInstance()),
  TwitterService.getInstance(AxiosService.getInstance()),
  LinkedInService.getInstance(AxiosService.getInstance()),
  InstagramProfileStatsService.getInstance(
    InstagramProfileStatsCRUD.getInstance(InstagramProfileStats)
  ),
  YoutubeProfileStatsService.getInstance(
    YoutubeProfileStatsCRUD.getInstance(YoutubeProfileStats)
  ),
  TwitterProfileStatsService.getInstance(
    TwitterProfileStatsCRUD.getInstance(TwitterProfileStats)
  ),
  LinkedInProfileStatsService.getInstance(
    LinkedInProfileStatsCRUD.getInstance(LinkedInProfileStats)
  )
)

const instagramService = InstagramService.getInstance(
  AxiosService.getInstance()
)

const youtubeService = YoutubeService.getInstance(AxiosService.getInstance())

const twitterService = TwitterService.getInstance(AxiosService.getInstance())

const influencerService = InfluencerService.getInstance(
  MailerService.getInstance(),
  googleAuthService,
  InfluencerCRUD.getInstance(),
  InfluencerProfileService.getInstance(
    InfluencerProfileCRUD.getInstance(InfluencerProfile),
    ZohoSignService.getInstance(AxiosService.getInstance())
  ),
  influencerStatsService,
  instagramService,
  youtubeService,
  twitterService,
  searchCreditsService
)

export {
  influencerProfileService,
  influencerService,
  influencerStatsService,
  instagramService,
  youtubeService,
  twitterService,
}
