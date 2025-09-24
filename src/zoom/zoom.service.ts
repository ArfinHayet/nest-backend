// src/zoom/zoom.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ZoomService {
  private clientId = process.env.ZOOM_CLIENT_ID!;
  private clientSecret = process.env.ZOOM_CLIENT_SECRET!;
  private accountId = process.env.ZOOM_ACCOUNT_ID!;
  private sdkKey = process.env.ZOOM_SDK_KEY!;
  private sdkSecret = process.env.ZOOM_SDK_SECRET!;

  private async getAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`;
    const res = await axios.post(url, null, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data.access_token;
  }

  async createMeeting(userId: string, topic: string, start: string, duration = 30) {
    const token = await this.getAccessToken();
    const res = await axios.post(
      `https://api.zoom.us/v2/users/${userId}/meetings`,
      {
        topic,
        type: 2,
        start_time: start,
        duration,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data; // contains join_url, start_url
  }

  generateSdkSignature(meetingNumber: string, role: 0 | 1) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // valid 1 hour
    const payload = {
      sdkKey: this.sdkKey,
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
    };
    return jwt.sign(payload, this.sdkSecret, { algorithm: 'HS256' });
  }
}
