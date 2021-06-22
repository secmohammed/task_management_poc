import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Confirmed } from '../../shared/validations/Confirmed.operator';

@InputType()
export class ResetPasswordDTO {
  @IsNotEmpty()
  @Field()
  token: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  @Confirmed()
  password: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  password_confirmation: string;
}
