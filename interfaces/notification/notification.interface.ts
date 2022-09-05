import {IsNotEmpty, IsString} from 'class-validator';

export class SendEmailDTO<T> {
  constructor(data: T, template: string) {
    this.data = data;
    this.template = template;
  }

  @IsNotEmpty()
  data: T;

  @IsString()
  @IsNotEmpty()
  template: string;
}
