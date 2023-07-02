import { ServiceError } from '../enum/service-error.enum.js';
import { ValidationErrorField } from '../types/validate-error.type.js';

export function createErrorObject(
    serviceError: ServiceError,
    message: string,
    details: ValidationErrorField[] = [],
) {
    return {
        errorType: serviceError,
        message,
        details: [...details],
    };
}
