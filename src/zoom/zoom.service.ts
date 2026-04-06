// src/zoom/zoom.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { OnEvent } from '@nestjs/event-emitter';
import { Appointments } from 'src/appointments/entity/appointments.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';


@Injectable()
export class ZoomService {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  private readonly logger = new Logger(ZoomService.name);
  private clientId = process.env.ZOOM_CLIENT_ID!;
  private clientSecret = process.env.ZOOM_CLIENT_SECRET!;
  private accountId = process.env.ZOOM_ACCOUNT_ID!;
  private sdkKey = process.env.ZOOM_SDK_KEY!;
  private sdkSecret = process.env.ZOOM_SDK_SECRET!;

  private async getAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`;
    const res = await axios.post(url, null, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data.access_token;
  }

  async createMeeting(
    userId: string,
    topic: string,
    start: string,
    duration = 30,
    displayName = 'User',
  ) {
    const token = await this.getAccessToken();
    const res = await axios.post(
      `https://api.zoom.us/v2/users/${userId}/meetings`,
      {
        topic,
        type: 2,
        start_time: start,
        duration,
        timezone: 'UTC', //winter e gmt, summer e bst
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return {
      join_url: res.data.join_url,
      start_url: res.data.start_url,
      meetingId: res.data.id,
      meetingPassword: res.data.password,
      displayName,
      sdkSignature: this.generateSdkSignature(res.data.id.toString(), 0), // 0 = participant
    };
  }

  generateSdkSignature(meetingNumber: string, role: 0 | 1) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60;

    return jwt.sign(
      {
        sdkKey: this.sdkKey,
        mn: meetingNumber,
        role,
        iat,
        exp,
        tokenExp: exp,
      },
      this.sdkSecret,
      { algorithm: 'HS256' },
    );
  }

  @OnEvent('appointment.created')
  async handleAppointmentCreatedEvent(appointment: Appointments) {
    try {
      this.logger.log(
        `📅 Creating Zoom meeting for appointment ${appointment.id}`,
      );

      const startTime = new Date(appointment.time); // ensure it's a Date object

      const meeting = await this.createMeeting(
        'me',
        `Appointment with patient ${appointment.patientId}`,
        startTime.toISOString(),
        30,
        `Patient ${appointment.patientId}`,
      );

      this.logger.log(`✅ Zoom meeting created: ${meeting.join_url}`);

      // 👉 Optionally update appointment with meeting details
      await this.appointmentsService.update(appointment.id, {
        link: meeting.join_url,
        meetingId: meeting.meetingId,
        meetingPassword: meeting.meetingPassword,
        displayName: meeting.displayName,
        signature: meeting.sdkSignature,
      });
    } catch (err) {
      this.logger.error(
        `❌ Failed to create Zoom meeting for appointment ${appointment.id}`,
        err.stack,
      );
    }
  }
}
