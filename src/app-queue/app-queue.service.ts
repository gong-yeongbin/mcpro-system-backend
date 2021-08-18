import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { HttpService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { Advertising, Campaign, Media, PostBackEvent, PostBackInstallAdbrixremaster } from 'src/entities/Entity';

@Processor('POSTBACK')
export class AppQueueService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Campaign) private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackEvent) private readonly postBackEventRepository: Repository<PostBackEvent>,
  ) {}

  @Process('install')
  async installPostbackQueue(job: Job) {
    // const tracker: string = job.data.tracker;
    // const token: string = job.data.token;
    // const data: PostBackInstallAdbrixremaster = job.data.data;
    // const campaignEntity: Campaign = await this.campaignRepository.findOne({
    //   where: { cp_token: token },
    //   relations: ['media', 'advertising'],
    // });
    // if (!campaignEntity) throw new NotFoundException('not found campaign');
    // const advertisingEntity: Advertising = campaignEntity.advertising;
    // const mediaEntity: Media = campaignEntity.media;
    // const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
    //   where: { campaign: campaignEntity, trackerPostback: 'install' },
    // });
    // if (postBackEventEntity.sendPostback) {
    //   const convertedPostbackInstallUrlTemplate = mediaEntity.mediaPostbackInstallUrlTemplate
    //     .replace('{click_id}', data.cb_3)
    //     .replace('{device_id}', data.adid)
    //     .replace('{android_device_id}', advertisingEntity.platform.toLowerCase() == 'aos' ? data.adid : '')
    //     .replace('{ios_device_id}', advertisingEntity.platform.toLowerCase() == 'ios' ? data.adid : '')
    //     .replace('{install_timestamp}', data.event_datetime)
    //     .replace('{payout}', '');
    //   await this.httpService
    //     .get(convertedPostbackInstallUrlTemplate)
    //     .toPromise()
    //     .then(async () => {
    //       console.log(`[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`);
    //       data.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    //     })
    //     .catch();
    // }
    // await this.postBackInstallAdbrixremasterRepository.save(data);
  }

  @Process('event')
  eventPostbackQueue(job: Job) {
    console.log(job);
  }
}
