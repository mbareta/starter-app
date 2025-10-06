import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.flush();
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  findByAccountAndUser(accountId: string, userId: string): Promise<User> {
    return this.usersRepository.findOne({ accountId, userId });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<number> {
    return this.usersRepository.nativeUpdate({ id }, updateUserDto);
  }

  remove(id: number): Promise<number> {
    return this.usersRepository.nativeDelete({ id });
  }
}
