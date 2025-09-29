import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  role: string = 'USER';

  accountId!: string;

  userId!: string;
}
