import {IsNotEmpty, IsString} from 'class-validator';

export class SendEmailDTO<T> {
  @IsNotEmpty()
  data!: T;

  @IsString()
  @IsNotEmpty()
  template!: string;

  @IsString()
  @IsNotEmpty()
  to!: Recipient;

  @IsString()
  @IsNotEmpty()
  subject!: string;
}

export interface Recipient {
  firstName: string;
  lastName: string;
  email: string;
}
