import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTask } from './create-task.validation';
@InputType()
export class UpdateTask extends CreateTask {
  @Field()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;
}
