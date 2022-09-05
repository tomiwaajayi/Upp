import {IsNotEmpty, IsString} from 'class-validator';

export class SendEmailDTO<T> {
  @IsNotEmpty()
  data!: T;

  @IsString()
  @IsNotEmpty()
  template!: string;

  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;
}
