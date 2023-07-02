import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validate-error.type';

export function transformValidateError(
    errors: ValidationError[],
): ValidationErrorField[] {
    return errors.map(({ property, value, constraints }) => ({
        property,
        value,
        messages: constraints ? Object.values(constraints) : [],
    }));
}
