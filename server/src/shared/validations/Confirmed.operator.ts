import {
  ValidatorConstraint,
  registerDecorator,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({
  name: 'Confirmed',
  async: false,
})
export class ConfirmedClass implements ValidatorConstraintInterface {
  async validate(text: any, args: ValidationArguments) {
    let currentValue = text;

    let property_name = args.property + '_confirmation';

    let property_value = args.object[property_name];

    return currentValue == property_value;
  }

  defaultMessage(args: ValidationArguments) {
    let property_name = args.property;

    return `${property_name} has not been confirmed - please define DTO attribute '${property_name}_confirmation' with the same value `;
  }
}

export function Confirmed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Confirmed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: ConfirmedClass,
    });
  };
}

interface IConfirmed {
  field: string;
}
