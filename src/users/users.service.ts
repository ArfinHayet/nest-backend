// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { omit } from "lodash"
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository
  ) { }

  create(createUserDto: Partial<CreateUserDto>) {
    const user = this.userRepo.create(createUserDto);
    return user;
  }

  async findAll(query) {
    const users = await this.userRepo.findAll(query);
    // Remove password field from each user
    return users.map(user => omit(user, ['password']));
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


  // ✅ New update method
  async update(id: number, updateData: Partial<User>) {
    // check if user exists
    let user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // perform update
    user = await this.userRepo.update(id, updateData);

    // hide password before returning
    return omit(user, ['password']);
  }


  async remove(id: number): Promise<void> {
    return this.userRepo.deleteById(id);
  }
}
