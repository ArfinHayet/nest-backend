import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notifications.controller';
import { FirebaseProvider } from '../firebase/firebase.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [NotificationController],
  providers: [FirebaseProvider, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
