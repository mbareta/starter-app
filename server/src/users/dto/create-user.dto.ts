import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  role: string = 'USER';

  sub: string;
}
