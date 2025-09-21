// src/auth/dto/firebase-login.dto.ts
import { IsString } from 'class-validator';

export class FirebaseLoginDto {
  @IsString()
  idToken: string;
}
