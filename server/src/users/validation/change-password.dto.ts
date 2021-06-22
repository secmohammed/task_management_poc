import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { IsEqualTo } from '../../shared/validations/isEqual.operator';

@InputType()
export class ChangePasswordDTO {
  @Field()
  old_password: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  password: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  @IsEqualTo('password')
  password_confirmation: string;
}
