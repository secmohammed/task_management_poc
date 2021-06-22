import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateAssignees {
  @Field(() => [String])
  @IsUUID('4', { each: true })
  userIds: string[];
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  taskId: string;
}
