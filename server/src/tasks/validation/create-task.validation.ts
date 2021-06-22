import { InputType, Field } from '@nestjs/graphql';
import { Status } from '../entities/task.entity';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
@InputType()
export class CreateTask {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
