import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DevicePlatform } from './entities/device.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('FIREBASE_ADMIN') private firebase: typeof admin,
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
  ) {}

  /* -------------------------------
   SAVE DEVICE TOKEN
  --------------------------------*/
  async registerDevice(
    deviceToken: string,
    platform: DevicePlatform,
    userId?: number,
  ) {
    return this.deviceRepo.save({
      deviceToken,
      platform,
      userId,
    });
  }

  /* -------------------------------
   SUBSCRIBE TO CHANNEL (TOPIC)
  --------------------------------*/
  async subscribeToChannel(deviceTokens: string[], channel: string) {
    return this.firebase.messaging().subscribeToTopic(deviceTokens, channel);
  }

  async unsubscribeFromChannel(deviceTokens: string[], channel: string) {
    return this.firebase.messaging().unsubscribeFromTopic(deviceTokens, channel);
  }

  /* -------------------------------
   SEND TO SINGLE DEVICE
  --------------------------------*/
  async sendToDevice(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: admin.messaging.Message = {
      token: deviceToken,
      notification: { title, body },
      data,
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            alert: { title, body },
            sound: 'default',
          },
        },
      },
    };

    return this.firebase.messaging().send(message);
  }

  /* -------------------------------
   SEND TO MULTIPLE DEVICES
  --------------------------------*/
  async sendToDevices(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const response = await this.firebase.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: {
        payload: {
          aps: {
            alert: { title, body },
            sound: 'default',
          },
        },
      },
    });

    // cleanup invalid tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((res, idx) => {
      if (!res.success) {
        invalidTokens.push(deviceTokens[idx]);
      }
    });

    if (invalidTokens.length) {
      await this.deviceRepo.delete({ deviceToken: invalidTokens as any });
      this.logger.warn(`Removed ${invalidTokens.length} invalid tokens`);
    }

    return response;
  }

  /* -------------------------------
   SEND TO CHANNEL (TOPIC)
  --------------------------------*/
  async sendToChannel(
    channel: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    return this.firebase.messaging().send({
      topic: channel,
      notification: { title, body },
      data,
    });
  }

  /* -------------------------------
   SILENT PUSH (BACKGROUND)
  --------------------------------*/
  async sendSilentNotification(
    deviceToken: string,
    data: Record<string, string>,
  ) {
    return this.firebase.messaging().send({
      token: deviceToken,
      data,
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            'content-available': 1,
          },
        },
      },
    });
  }
}
