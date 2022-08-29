import {HttpException, HttpStatus, ValidationError} from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(public validationErrors: Record<string, unknown>) {
    super('', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  getResponse() {
    return {
      statusCode: this.getStatus(),
      error: 'Validation Error',
      errors: this.validationErrors,
      message: 'validation error',
    };
  }

  static formatErrors(errorsToFromat: ValidationError[]): {[x: string]: any} {
    return errorsToFromat.reduce(
      (accumulator: Record<string, unknown>, error: ValidationError) => {
        let constraints: any;
        if (Array.isArray(error.children) && error.children.length) {
          constraints = ValidationException.formatErrors(error.children);
        } else {
          const hasContraints = !!error.constraints;
          if (hasContraints) {
            let items = Object.values(error.constraints as any);
            const lastItem = items.pop();
            items = [items.join(', '), lastItem].filter(item => item);
            constraints = items.join(' and ');
          } else {
            constraints = '';
          }
        }
        return {
          ...accumulator,
          [error.property]: constraints,
        };
      },
      {}
    );
  }
}
