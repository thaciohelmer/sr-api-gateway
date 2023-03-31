import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  readonly phoneNumber: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly name: string;
  readonly avatarUrl: string;
  @IsNotEmpty()
  readonly category: string;
}
