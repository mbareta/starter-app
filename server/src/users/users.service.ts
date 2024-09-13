import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.insert(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  findBySub(sub: string) {
    return this.usersRepository.findOne({ sub });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.nativeUpdate({ id }, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.nativeDelete({ id });
  }
}
