import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../utils/serviceAccountKey.json';          

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          });
        }   
        return admin;  
      }, 
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN',FirebaseService],
})
export class FirebaseModule {}
