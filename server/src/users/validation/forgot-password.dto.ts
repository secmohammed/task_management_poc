import { IsNotEmpty, IsEmail } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
}
