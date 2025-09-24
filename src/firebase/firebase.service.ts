import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly adminSdk: typeof admin,
  ) { }

  async verifyIdToken(idToken: string) {
    try {
      console.log('Received token length:', idToken.length);
      console.log('First 20 chars:', idToken.slice(0, 20));
      console.log('Last 20 chars:', idToken.slice(-20));
      console.log('Token parts:', idToken.split('.').length); // must be 3

      console.log('Admin SDK Project ID:', this.adminSdk.app().options.projectId);


      // Decode payload without verification
      const decoded = jwt.decode(idToken, { complete: true }) as any;
      console.log('=== Decoded JWT (no verification) ===');
      console.log('Header:', decoded?.header);
      console.log('Payload:', decoded?.payload);

      // Admin SDK project ID
      const projectId = this.adminSdk.app().options.projectId;
      console.log('Admin SDK projectId:', projectId);

      // Fetch Firebase public keys
    const res = await axios.get(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );
    const publicKeys = res.data;
    console.log('Fetched public keys:', Object.keys(publicKeys));

      // Check if token.kid matches available keys
      const kid = decoded?.header?.kid;
      if (kid && !publicKeys[kid]) {
        console.warn('Token kid not found in Firebase public keys! This causes invalid signature.');
      }


      const decoded2 = await this.adminSdk.auth().verifyIdToken(idToken, true);

      console.log('Decoded token:', decoded2);

      const { name, picture, email, email_verified, uid, aud, iss } = decoded2;

      // Debug checks
      if (aud !== 'neuro-check-pro') {
        console.warn('Token audience mismatch:', aud);
        throw new UnauthorizedException('Token audience mismatch');
      }

      if (iss !== 'https://securetoken.google.com/neuro-check-pro') {
        console.warn('Token issuer mismatch:', iss);
        throw new UnauthorizedException('Token issuer mismatch');
      }

      if (!email) {
        throw new UnauthorizedException('Firebase account has no email');
      }

      return { name, picture, email, email_verified, uid, allClaims: decoded };
    } catch (err) {
      console.error('Firebase Admin verify error:', err);
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }
}
