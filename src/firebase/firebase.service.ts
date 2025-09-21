import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly adminSdk: typeof admin) {}

  async verifyIdToken(idToken: string) {
    return this.adminSdk.auth().verifyIdToken(idToken, true); // checkRevoked = true
  }
}
