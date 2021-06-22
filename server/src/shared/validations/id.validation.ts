import { IsUUID, IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class IsID {
  @Field()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;
}
