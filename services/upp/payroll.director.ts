import {PayrollBuilder} from './payroll.builder';
import {BuilderPayload} from './builder.interface';

/**
 * This builder is used to create a payroll object
 */
export class PayrollDirector {
  static build(data: BuilderPayload) {
    return new PayrollBuilder(data).get();
  }
}
