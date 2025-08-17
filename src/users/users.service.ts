// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { omit } from "lodash"

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository 
  ) { }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userRepo.findAll();
  }

  async findById(id: number) {
    let user = await this.userRepo.findById(id)
    user = omit(user, ['password']);
    return user;
  }

  findByEmailOrPhone(identifier: string): Promise<User> {
    const user = this.userRepo.findOneByCondition([
      { email: identifier },
      { phone: identifier },
    ])

    return user;
  }
}
