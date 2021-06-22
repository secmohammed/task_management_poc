import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class DeleteTask {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  taskId: string;
}
