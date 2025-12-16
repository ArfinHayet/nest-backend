import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { SubscribeChannelDto } from './dto/subscribe-channel.dto';
import { SendToDeviceDto } from './dto/send-to-device.dto';
import { SendToChannelDto } from './dto/send-to-channel.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /* --------------------------------
   REGISTER DEVICE (ANDROID / IOS)
  ----------------------------------*/
  @Post('register-device')
  @HttpCode(HttpStatus.CREATED)
  async registerDevice(@Body() dto: RegisterDeviceDto) {
    await this.notificationService.registerDevice(
      dto.deviceToken,
      dto.platform,
      dto.userId,
    );

    return {
      message: 'Device registered successfully',
    };
  }

  /* --------------------------------
   SUBSCRIBE DEVICE TO CHANNEL
  ----------------------------------*/
  @Post('subscribe-channel')
  async subscribeToChannel(@Body() dto: SubscribeChannelDto) {
    await this.notificationService.subscribeToChannel(
      dto.deviceTokens,
      dto.channel,
    );

    return {
      message: `Subscribed to channel: ${dto.channel}`,
    };
  }

  /* --------------------------------
   SEND NOTIFICATION TO DEVICE
  ----------------------------------*/
  @Post('send-to-device')
  async sendToDevice(@Body() dto: SendToDeviceDto) {
    const response = await this.notificationService.sendToDevice(
      dto.deviceToken,
      dto.title,
      dto.body,
      dto.data,
    );

    return {
      message: 'Notification sent to device',
      firebaseMessageId: response,
    };
  }

  /* --------------------------------
   SEND NOTIFICATION TO CHANNEL
  ----------------------------------*/
  @Post('send-to-channel')
  async sendToChannel(@Body() dto: SendToChannelDto) {
    const response = await this.notificationService.sendToChannel(
      dto.channel,
      dto.title,
      dto.body,
      dto.data,
    );

    return {
      message: `Notification sent to channel: ${dto.channel}`,
      firebaseMessageId: response,
    };
  }
}
