import { DEFAULT_STATIC_IMAGES } from '../app/rest.constant.js';

function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
}

export function transformProperty(
    property: string,
    someObject: Record<string, unknown>,
    transformFn: (object: Record<string, unknown>) => void,
) {
    return Object.keys(someObject).forEach(key => {
        if (key === property) {
            transformFn(someObject);
        } else if (isObject(someObject[key])) {
            transformProperty(
                property,
                someObject[key] as Record<string, unknown>,
                transformFn,
            );
        }
    });
}

export function transformObject(
    properties: string[],
    staticPath: string,
    uploadPath: string,
    data: Record<string, unknown>,
) {
    return properties.forEach(property => {
        transformProperty(property, data, (target: Record<string, unknown>) => {
            const rootPath = DEFAULT_STATIC_IMAGES.includes(
                target[property] as string,
            )
                ? staticPath
                : uploadPath;
            target[property] = `${rootPath}/${target[property]}`;
        });
    });
}
