import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class DestroyAssignees {
  @Field(() => [String])
  @IsUUID('4', { each: true })
  userIds: string[];
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  taskId: string;
}
