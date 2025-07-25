// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';    
import { UsersService } from './users.service';
import { UserRepository  } from './user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService,UserRepository],
  exports: [UsersService, UserRepository], 
  controllers: [UsersController],
})
export class UsersModule {}
